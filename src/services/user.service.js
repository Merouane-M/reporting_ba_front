import { fetchProfile } from "../api/user.api";

export async function getProfile() {
  const data = await fetchProfile();

  return {
    nom: data.nom,
    prenom: data.prenom,
  };
}
