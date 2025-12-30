import type { EtatOcre } from '../types/ocre';

const CLE_STORAGE_OCRE = 'dofus_ocre_captures_v1';

export function chargerEtatOcre(): EtatOcre | null {
  try {
    const brut = localStorage.getItem(CLE_STORAGE_OCRE);
    if (!brut) return null;
    return JSON.parse(brut) as EtatOcre;
  } catch {
    return null;
  }
}

export function sauvegarderEtatOcre(etat: EtatOcre): void {
  localStorage.setItem(CLE_STORAGE_OCRE, JSON.stringify(etat));
}

export function creerEtatOcreInitial(): EtatOcre {
  return {
    captures: [],
    derniereMAJISO: new Date().toISOString(),
  };
}
