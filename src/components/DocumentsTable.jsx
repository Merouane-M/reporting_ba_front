import { useEffect, useState } from "react";
import { getDocuments, removeDocument } from "../services/document.service";

// Assuming you have icons available (e.g., from Heroicons or React Icons). If not, install via npm i react-icons and import as needed.
// Example imports (adjust based on your icon library):
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';  // For view, edit, delete

function DocumentsTable({ type }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const docs = await getDocuments(type);
      setData(docs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      await removeDocument(type, id);
      fetchData(); // refresh table
    }
  };

  const handleView = (id) => {
    console.log("View", id);
    // Add navigation or modal logic here if needed
  };

  const handleEdit = (id) => {
    console.log("Edit", id);
    // Add navigation or modal logic here if needed
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sofiblue"></div>
        <span className="ml-2 text-gray-600">Chargement…</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Aucun document trouvé pour {type}.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{type} Declarations</h2>
      
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-sofiblue text-white">
              <th className="p-4 text-left font-semibold">ID</th>
              <th className="p-4 text-left font-semibold">Date d'arrêté</th>
              <th className="p-4 text-left font-semibold">Created At</th>
              <th className="p-4 text-left font-semibold">Updated At</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={row.id}
                className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="p-4 text-gray-700">{row.id}</td>
                <td className="p-4 text-gray-700">{new Date(row.date_arrete).toLocaleDateString('fr-FR')}</td>
                <td className="p-4 text-gray-700">{new Date(row.created_at).toLocaleString('fr-FR')}</td>
                <td className="p-4 text-gray-700">{new Date(row.updated_at).toLocaleString('fr-FR')}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.status === 'Active' ? 'bg-green-100 text-green-800' :
                      row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-2">
                  <button
                    className="btn btn-primary flex items-center gap-1"
                    onClick={() => handleView(row.id)}
                    title="View"
                  >
                    <EyeIcon className="h-4 w-4" />
                    View
                  </button>
                  <button
                    className="btn btn-secondary flex items-center gap-1"
                    onClick={() => handleEdit(row.id)}
                    title="Edit"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    className="btn btn-danger flex items-center gap-1"
                    onClick={() => handleDelete(row.id)}
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.map((row) => (
          <div key={row.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-gray-800">ID: {row.id}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  row.status === 'Active' ? 'bg-green-100 text-green-800' :
                  row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}
              >
                {row.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Date d'arrêté: {new Date(row.date_arrete).toLocaleDateString('fr-FR')}</p>
            <p className="text-sm text-gray-600 mb-1">Created: {new Date(row.created_at).toLocaleString('fr-FR')}</p>
            <p className="text-sm text-gray-600 mb-4">Updated: {new Date(row.updated_at).toLocaleString('fr-FR')}</p>
            <div className="flex gap-2">
              <button
                className="btn btn-primary flex items-center gap-1 text-xs"
                onClick={() => handleView(row.id)}
              >
                <EyeIcon className="h-3 w-3" />
                View
              </button>
              <button
                className="btn btn-secondary flex items-center gap-1 text-xs"
                onClick={() => handleEdit(row.id)}
              >
                <PencilIcon className="h-3 w-3" />
                Edit
              </button>
              <button
                className="btn btn-danger flex items-center gap-1 text-xs"
                onClick={() => handleDelete(row.id)}
              >
                <TrashIcon className="h-3 w-3" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DocumentsTable;