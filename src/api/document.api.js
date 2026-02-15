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
export const exportDocument = async (type, id, dateArrete) => {
  try {
    // Request the XML as a blob
    const res = await api.get(`/${type.toLowerCase()}_list/${id}/export`, {
      responseType: "blob",
    });

    // Ensure we have a blob
    const blob = new Blob([res.data], { type: "application/xml" });

    // Custom filename: type-Sofinance-YYYY-MM-DD.xml
    const fileName = `${type}-Sofinance-${dateArrete}.xml`;

    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary <a> link and trigger click
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    // Handle backend error message
    if (error.response?.data instanceof Blob) {
      const text = await error.response.data.text();
      const json = JSON.parse(text);
      return { success: false, message: json.error };
    }
    return { success: false, message: "Export failed" };
  }
};
