import React from "react";

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center  z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm  w-full">
        <h2 className="text-xl font-bold text-sofiblue mb-4">{title}</h2>
        <p className="mb-6 text-lg">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Annuler
          </button>
          <button
            className="btn btn-danger"
            onClick={onConfirm}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
