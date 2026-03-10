import {
  fetchDocuments,
  fetchDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  exportDocument, 
  exportPDFDocument,
} from "../api/document.api";

/* =========================
   GET ALL
========================= */
export const getDocuments = async (type) => {
  return await fetchDocuments(type);
};

/* =========================
   GET ONE
========================= */
export const getDocumentById = async (type, id) => {
  return await fetchDocumentById(type, id);
};

/* =========================
   CREATE
========================= */
export const addDocument = async (type, data) => {
  const payload = {
    ...data,
    etablissement_declarant: "025", 
  };

  return await createDocument(type, payload);
};
/* =========================
   UPDATE
========================= */
export const editDocument = async (type, id, data) => {
  return await updateDocument(type, id, data);
};

/* =========================
   DELETE
========================= */
export const removeDocument = async (type, id) => {
  return await deleteDocument(type, id);
};

/* =========================
   EXPORT
========================= */


export const downloadDocument = async (type, id, dateArrete) => {
  return await exportDocument(type, id, dateArrete);
};

export const downloadPDFDocument = async (type, id, dateArrete) => {
  return await exportPDFDocument(type, id, dateArrete);
};
