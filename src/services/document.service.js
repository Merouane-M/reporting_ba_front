import { fetchDocuments, deleteDocument } from "../api/document.api";

export const getDocuments = async (type) => {
  const data = await fetchDocuments(type);
  return data;
};

export const removeDocument = async (type, id) => {
  await deleteDocument(type, id);
};
