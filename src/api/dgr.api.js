import api from "./axios";

/* =========================
   BENEFICIAIRE (Nested under DGR)
========================= */

export const fetchBeneficiaires = async (dgrId) => {
  const res = await api.get(`/dgr_list/${dgrId}/beneficiaire_list`);
  return res.data;
};

export const fetchBeneficiaireById = async (dgrId, beneficiaireId) => {
  const res = await api.get(
    `/dgr_list/${dgrId}/beneficiaire_list/${beneficiaireId}`
  );
  return res.data;
};

export const createBeneficiaire = async (dgrId, data) => {
  const res = await api.post(
    `/dgr_list/${dgrId}/beneficiaire_list/beneficiaire_create`,
    data
  );
  return res.data;
};

export const updateBeneficiaire = async (dgrId, beneficiaireId, data) => {
  const res = await api.put(
    `/dgr_list/${dgrId}/beneficiaire_list/${beneficiaireId}/update`,
    data
  );
  return res.data;
};

export const deleteBeneficiaire = async (dgrId, beneficiaireId) => {
  const res = await api.delete(
    `/dgr_list/${dgrId}/beneficiaire_list/${beneficiaireId}/delete`
  );
  return res.data;
};


/* =========================
   PERSONNE LIEE (Nested under Beneficiaire)
========================= */

export const fetchPersonnesLiees = async (dgrId, beneficiaireId) => {
  const res = await api.get(
    `/dgr_list/${dgrId}/beneficiaire_list/${beneficiaireId}/personne_liee_list`
  );
  return res.data;
};

export const fetchPersonneLieeById = async (
  dgrId,
  beneficiaireId,
  personneLieeId
) => {
  const res = await api.get(
    `/dgr_list/${dgrId}/beneficiaire_list/${beneficiaireId}/personne_liee_list/${personneLieeId}`
  );
  return res.data;
};

export const createPersonneLiee = async (
  dgrId,
  beneficiaireId,
  data
) => {
  const res = await api.post(
    `/dgr_list/${dgrId}/beneficiaire_list/${beneficiaireId}/personne_liee_list/personne_liee_create`,
    data
  );
  return res.data;
};

export const updatePersonneLiee = async (
  dgrId,
  beneficiaireId,
  personneLieeId,
  data
) => {
  const res = await api.put(
    `/dgr_list/${dgrId}/beneficiaire_list/${beneficiaireId}/personne_liee_list/${personneLieeId}/update`,
    data
  );
  return res.data;
};

export const deletePersonneLiee = async (
  dgrId,
  beneficiaireId,
  personneLieeId
) => {
  const res = await api.delete(
    `/dgr_list/${dgrId}/beneficiaire_list/${beneficiaireId}/personne_liee_list/${personneLieeId}/delete`
  );
  return res.data;
};