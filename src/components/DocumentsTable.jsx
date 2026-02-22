// src/components/DocumentsTable.jsx
import { useEffect, useState } from "react";
import {
  getDocuments,
  removeDocument,
  editDocument,
  downloadDocument,
} from "../services/document.service"; // Add editDocument import
import { useDocument } from "../context/DocumentContext";
import { useNavigate } from "react-router-dom"; // Add this import
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline"; // Add icons for sort
import DocumentActions from "./DocumentsTable/DocumentActions";
import DocumentStatus from "./DocumentsTable/DocumentStatus";
import ConfirmModal from "./DocumentsTable/ConfirmModal";

function DocumentsTable({ type }) {
  const { document } = useDocument();
  const navigate = useNavigate(); // Add navigate hook
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Filters & pagination
  const [filterText, setFilterText] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  // Sorting state
  const [sortColumn, setSortColumn] = useState("created_at"); // Default sort by created_at
  const [sortDirection, setSortDirection] = useState("desc"); // Default descending

  // ================= HELPER FUNCTION =================
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      const [day, month, year] = parts.map(Number);
      return new Date(year, month - 1, day); // Month is 0-indexed
    }
    return new Date(dateStr); // Fallback for other formats
  };

  // ================= FETCH DOCUMENTS =================
  const fetchData = async () => {
    if (!type) return; // Early return if type is not set

    setLoading(true);
    try {
      const docs = await getDocuments(type); // Use type prop instead of context
      setData(docs);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type]); // Depend on type prop

  // ================= HANDLERS =================
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setIsModalOpen(true); // open confirmation modal
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    try {
      await removeDocument(type, selectedId); // Use type prop
      fetchData(); // refresh table
      setIsModalOpen(false);
      setSelectedId(null);
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setSelectedId(null);
  };

  const handleView = async (id) => {
    try {
      // Update the document status to "SENT"
      await editDocument(type, id, { status: "SENT" });
      fetchData(); // Refresh the table to show the updated status
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut :", err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/documents/${type}/edit/${id}`); // Navigate to edit page
  };

  //=================Download==================

  const handleDownload = async (id, dateArrete, status) => {
    try {
      // Parse dateArrete (handles dd.mm.yyyy) and convert to YYYY-MM-DD
      const parsedDate = parseDate(dateArrete);
      const formattedDate = parsedDate ? parsedDate.toISOString().split("T")[0] : null;

      if (!formattedDate) {
        alert("Date d'arrêté invalide.");
        return;
      }

      // Trigger backend export/download
      const result = await downloadDocument(type, id, formattedDate);

      if (result.success) {
        // Update document status to VALIDATED only if current status is "IN_PROCESS"
        if (status === "IN_PROCESS") {
          await editDocument(type, id, { status: "VALIDATED" });
        }

        // Refresh the table data
        fetchData();
      } else {
        // Show backend error
        alert(`Erreur: ${result.message}`);
      }
    } catch (error) {
      console.error("Download or update failed:", error);
      alert("Une erreur est survenue lors du téléchargement ou de la validation.");
    }
  };

  // ================= SORT HANDLER =================
  const handleSort = (column) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New column, default to desc
      setSortColumn(column);
      setSortDirection("desc");
    }
    setCurrentPage(1); // Reset to first page on sort change
  };

  // ================= SORT, FILTER, PAGINATE =================
  const sortedData = [...data].sort((a, b) => {
    const aValue = parseDate(a[sortColumn]); // Use parseDate for date_arrete
    const bValue = parseDate(b[sortColumn]);
    if (sortDirection === "asc") {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  const filteredData = sortedData.filter((doc) => {
    const matchesText =
      doc.id.toString().includes(filterText) ||
      doc.status.toLowerCase().includes(filterText.toLowerCase());

    const filterDateObj = filterDate ? new Date(filterDate) : null;
    const matchesDate =
      !filterDateObj ||
      [doc.created_at, doc.updated_at, doc.date_arrete].some((d) => {
        const date = parseDate(d); // Use parseDate for date_arrete
        return (
          date &&
          date.getFullYear() === filterDateObj.getFullYear() &&
          date.getMonth() === filterDateObj.getMonth() &&
          date.getDate() === filterDateObj.getDate()
        );
      });

    return matchesText && matchesDate;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sofiblue"></div>
        <span className="ml-2 text-sofiblue font-bold">Chargement…</span>
      </div>
    );
  }

  // ================= EMPTY =================
  if (!loading && data.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sofiblue font-bold">
          Aucun document trouvé pour {type || "?"}.
        </p>
      </div>
    );
  }

  // ================= TABLE =================
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold text-sofiblue">
          {type} Declarations
        </h2>

        <div className="flex flex-col md:flex-row gap-2 w-full md:w-1/2">
          <input
            type="text"
            placeholder="Rechercher par ID ou status..."
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-sofiblue rounded-md px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-sofiblue"
          />

          <input
            type="date"
            placeholder="Filtrer par date"
            value={filterDate}
            onChange={(e) => {
              setFilterDate(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-sofiblue rounded-md px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-sofiblue"
          />
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-sofiblue text-white">
              <th className="p-4 text-left font-semibold">ID</th>
              <th
                className="p-4 text-left font-semibold cursor-pointer hover:bg-sofiblue/80 transition"
                onClick={() => handleSort("date_arrete")}
              >
                <div className="flex items-center gap-1">
                  Date d'arrêté
                  {sortColumn === "date_arrete" &&
                    (sortDirection === "asc" ? (
                      <ChevronUpIcon className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    ))}
                </div>
              </th>
              <th
                className="p-4 text-left font-semibold cursor-pointer hover:bg-sofiblue/80 transition"
                onClick={() => handleSort("created_at")}
              >
                <div className="flex items-center gap-1">
                  Création
                  {sortColumn === "created_at" &&
                    (sortDirection === "asc" ? (
                      <ChevronUpIcon className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    ))}
                </div>
              </th>
              <th
                className="p-4 text-left font-semibold cursor-pointer hover:bg-sofiblue/80 transition"
                onClick={() => handleSort("updated_at")}
              >
                <div className="flex items-center gap-1">
                  Dernière modification
                  {sortColumn === "updated_at" &&
                    (sortDirection === "asc" ? (
                      <ChevronUpIcon className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    ))}
                </div>
              </th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={row.id}
                className={`hover:bg-gray-50 border-b border-sofiblue transition-colors ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="p-4 text-lg text-sofiblue">{row.id}</td>
                <td className="p-4 text-lg font-bold text-sofiblue">
                  {parseDate(row.date_arrete)?.toLocaleDateString("fr-FR") || "Invalid Date"}
                </td>
                <td className="p-4 text-lg text-sofiblue">
                  {new Date(row.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="p-4 text-lg text-sofiblue">
                  {new Date(row.updated_at).toLocaleString("fr-FR")}
                </td>
                <td>
                  <DocumentStatus status={row.status} />
                </td>
                <td className="p-4">
                  <DocumentActions
                    id={row.id}
                    dateArrete={row.date_arrete}
                    status={row.status}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDownload={handleDownload}
                    onDelete={() => handleDeleteClick(row.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            className="btn btn-secondary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Précédent
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`btn ${
                currentPage === i + 1 ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="btn btn-secondary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Suivant
          </button>
        </div>
      )}

      {/* ================= CONFIRM MODAL ================= */}
      <ConfirmModal
        isOpen={isModalOpen}
        title="Confirmer la suppression ⚠️"
        message="Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default DocumentsTable;