import { fetchDocuments, deleteDocument } from "../api/document.api";

// Get all documents by type
export const getDocuments = async (type) => {
  console.log("getDocuments called with type:", type);
  const data = await fetchDocuments(type);
  console.log("Fetched documents:", data);
  return data;
};


// Delete document by type and id
export const removeDocument = async (type, id) => {
  await deleteDocument(type, id);
};
