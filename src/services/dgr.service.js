// src/services/dgr.service.js
import * as dgrApi from "../api/dgr.api";

/* =========================
   Beneficiaire
========================= */

export const getBeneficiaires = async (dgrId) => {
  // API already returns res.data, so just return it directly
  return await dgrApi.fetchBeneficiaires(dgrId);
};

export const getBeneficiaire = async (dgrId, beneficiaireId) => {
  // API already returns res.data
  return await dgrApi.fetchBeneficiaireById(dgrId, beneficiaireId);
};

export const addBeneficiaire = async (dgrId, payload) => {
  try {
    const response = await dgrApi.createBeneficiaire(dgrId, payload);
    return response;
  } catch (error) {
    console.error("Error in addBeneficiaire :", error);
    throw error;
  }
};

export const editBeneficiaire = async (dgrId, beneficiaireId, payload) => {
  // API already returns res.data
  return await dgrApi.updateBeneficiaire(dgrId, beneficiaireId, payload);
};

export const removeBeneficiaire = async (dgrId, beneficiaireId) => {
  return await dgrApi.deleteBeneficiaire(dgrId, beneficiaireId);
};

/* =========================
   Personne Liee
========================= */

export const getPersonnesLiees = async (dgrId, beneficiaireId) => {
  // API already returns res.data
  return await dgrApi.fetchPersonnesLiees(dgrId, beneficiaireId);
};

export const getPersonneLiee = async (dgrId, beneficiaireId, personneLieeId) => {
  // API already returns res.data
  return await dgrApi.fetchPersonneLieeById(dgrId, beneficiaireId, personneLieeId);
};

export const addPersonneLiee = async (dgrId, beneficiaireId, payload) => {
  // API already returns res.data
  return await dgrApi.createPersonneLiee(dgrId, beneficiaireId, payload);
};

export const editPersonneLiee = async (dgrId, beneficiaireId, personneLieeId, payload) => {
  // API already returns res.data
  return await dgrApi.updatePersonneLiee(dgrId, beneficiaireId, personneLieeId, payload);
};

export const removePersonneLiee = async (dgrId, beneficiaireId, personneLieeId) => {
  return await dgrApi.deletePersonneLiee(dgrId, beneficiaireId, personneLieeId);
};