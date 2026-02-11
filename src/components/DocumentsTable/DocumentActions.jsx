// src/components/DocumentsTable/DocumentActions.jsx
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon
} from "@heroicons/react/24/outline";

export default function DocumentActions({ id, onView, onEdit, onDownload, onDelete }) {
  return (
    <div className="flex justify-center gap-2">
      <button
        className="btn btn-primary flex items-center gap-1"
        onClick={() => onView(id)}
      >
        <EyeIcon className="h-4 w-4" />
        Consulter
      </button>

      <button
        className="btn btn-secondary flex items-center gap-1"
        onClick={() => onEdit(id)}
      >
        <PencilIcon className="h-4 w-4" />
        Modifier
      </button>

      <button
        className="btn btn-secondary flex items-center gap-1"
        onClick={() => onDownload(id)}
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        Télécharger
      </button>

      <button
        className="btn btn-danger flex items-center gap-1"
        onClick={() => onDelete(id)}
      >
        <TrashIcon className="h-4 w-4" />
        Supprimer
      </button>
    </div>
  );
}
