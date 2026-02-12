import api from "./axios";

/* =========================
   GET ALL DOCUMENTS
========================= */
export const fetchDocuments = async (type) => {
  const res = await api.get(`/${type.toLowerCase()}_list/`);
  return res.data;
};

/* =========================
   GET SINGLE DOCUMENT
========================= */
export const fetchDocumentById = async (type, id) => {
  const res = await api.get(`/${type.toLowerCase()}_list/${id}`);
  return res.data;
};

/* =========================
   CREATE DOCUMENT
========================= */
export const createDocument = async (type, data) => {
  const res = await api.post(
    `/${type.toLowerCase()}_list/${type.toLowerCase()}_create`,
    data
  );
  return res.data;
};

/* =========================
   UPDATE DOCUMENT
========================= */
export const updateDocument = async (type, id, data) => {
  const res = await api.put(
    `/${type.toLowerCase()}_list/${id}/update`,
    data
  );
  return res.data;
};

/* =========================
   DELETE DOCUMENT
========================= */
export const deleteDocument = async (type, id) => {
  const res = await api.delete(`/${type.toLowerCase()}_list/${id}/delete`);
  return res.data;
};

/* =========================
   EXPORT DOCUMENT (DOWNLOAD XML)
========================= */
export const exportDocument = async (type, id) => {
  const res = await api.get(`/${type.toLowerCase()}_list/${id}/export`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${type}_${id}.xml`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
