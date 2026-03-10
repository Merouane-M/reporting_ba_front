// src/components/DocumentsTable/DocumentActions.jsx
import {
  CheckIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

export default function DocumentActions({
  id,
  dateArrete,
  status,
  onView,
  onEdit,
  onDownload,
  onDownloadPDF,
  onDelete,
}) {
  return (
    <div className="flex justify-center gap-2">
      {/* View button - appears only if status is VALIDATED */}
      {status === "VALIDATED" && (
        <button
          className="btn btn-secondary flex items-center gap-1"
          onClick={() => onView(id)}
        >
          <CheckIcon className="h-4 w-4" />
          Terminer
        </button>
      )}
      
      <button
        className="btn btn-primary flex items-center gap-1"
        onClick={() => onEdit(id)}
      >
        <PencilIcon className="h-4 w-4" />
        Modifier
      </button>

      <button
        className="btn btn-secondary flex items-center gap-1"
        onClick={() => onDownload(id, dateArrete, status)}
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        XML
      </button>
      {/* <button
        className="btn btn-secondary flex items-center gap-1"
        onClick={() => onDownloadPDF(id, dateArrete)}
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        PDF
      </button> */}
      {status !== "SENT" && (
        <button
          className="btn btn-danger flex items-center gap-1"
          onClick={() => onDelete(id)}
        >
          <TrashIcon className="h-4 w-4" />
          Supprimer
        </button>
      )}
    </div>
  );
}
