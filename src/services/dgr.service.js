// src/services/dgr.service.js
import * as dgrApi from "../api/dgr.api";

/* =========================
   Beneficiaire
========================= */

export const getBeneficiaires = async (dgrId) => {
  const { data } = await dgrApi.fetchBeneficiaires(dgrId);
  return data;
};

export const getBeneficiaire = async (dgrId, beneficiaireId) => {
  const { data } = await dgrApi.fetchBeneficiaireById(
    dgrId,
    beneficiaireId
  );
  return data;
};

export const addBeneficiaire = async (dgrId, payload) => {
  try {
    console.log("Sending payload to createBeneficiaire:", payload);
    const response = await dgrApi.createBeneficiaire(dgrId, payload);
    console.log("Full response from createBeneficiaire:", response);
    console.log("response.data.id:", response.id);
    // Removed the error check since backend returns the object on success

    return response;
  } catch (error) {
    console.error("Error in addBeneficiaire a777:", error);
    throw error; // Re-throw to propagate to component
  }
};

export const editBeneficiaire = async (
  dgrId,
  beneficiaireId,
  payload
) => {
  const { data } = await dgrApi.updateBeneficiaire(
    dgrId,
    beneficiaireId,
    payload
  );
  return data;
};

export const removeBeneficiaire = async (
  dgrId,
  beneficiaireId
) => {
  return await dgrApi.deleteBeneficiaire(
    dgrId,
    beneficiaireId
  );
};

/* =========================
   Personne Liee
========================= */

export const getPersonnesLiees = async (
  dgrId,
  beneficiaireId
) => {
  const { data } = await dgrApi.fetchPersonnesLiees(
    dgrId,
    beneficiaireId
  );
  return data;
};

export const getPersonneLiee = async (
  dgrId,
  beneficiaireId,
  personneLieeId
) => {
  const { data } = await dgrApi.fetchPersonneLieeById(
    dgrId,
    beneficiaireId,
    personneLieeId
  );
  return data;
};

export const addPersonneLiee = async (
  dgrId,
  beneficiaireId,
  payload
) => {
  const { data } = await dgrApi.createPersonneLiee(
    dgrId,
    beneficiaireId,
    payload
  );
  return data;
};

export const editPersonneLiee = async (
  dgrId,
  beneficiaireId,
  personneLieeId,
  payload
) => {
  const { data } = await dgrApi.updatePersonneLiee(
    dgrId,
    beneficiaireId,
    personneLieeId,
    payload
  );
  return data;
};

export const removePersonneLiee = async (
  dgrId,
  beneficiaireId,
  personneLieeId
) => {
  return await dgrApi.deletePersonneLiee(
    dgrId,
    beneficiaireId,
    personneLieeId
  );
};