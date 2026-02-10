import api from "./axios"; 

export const fetchDocuments = async (type) => {
  const res = await api.get(`/${type.toLowerCase()}_list`);
  return res.data;
};

export const deleteDocument = async (type, id) => {
  await api.delete(`/${type.toLowerCase()}_list/${id}`);
};
