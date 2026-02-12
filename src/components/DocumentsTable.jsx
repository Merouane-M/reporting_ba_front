// src/components/DocumentsTable.jsx
import { useEffect, useState } from "react";
import { getDocuments, removeDocument } from "../services/document.service";
import { useDocument } from "../context/DocumentContext";
import { useNavigate } from "react-router-dom"; // Add this import
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

  const handleView = (id) => console.log("View", id, "Type:", type); // Use type
  const handleEdit = (id) => {
    navigate(`/documents/${type}/edit/${id}`); // Navigate to edit page
  };
  const handleDownload = (id) => console.log("Download", id, "Type:", type);

  // ================= SORT, FILTER, PAGINATE =================
  const sortedData = [...data].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const filteredData = sortedData.filter((doc) => {
    const matchesText =
      doc.id.toString().includes(filterText) ||
      doc.status.toLowerCase().includes(filterText.toLowerCase());

    const filterDateObj = filterDate ? new Date(filterDate) : null;
    const matchesDate =
      !filterDateObj ||
      [doc.created_at, doc.updated_at, doc.date_arrete].some((d) => {
        const date = new Date(d);
        return (
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
    currentPage * ITEMS_PER_PAGE
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
              <th className="p-4 text-left font-semibold">Date d'arrêté</th>
              <th className="p-4 text-left font-semibold">Création</th>
              <th className="p-4 text-left font-semibold">
                Dernière modification
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
                  {new Date(row.date_arrete).toLocaleDateString("fr-FR")}
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