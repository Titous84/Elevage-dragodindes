import type { EtatApplication, StatutDinde } from '../types/elevage';

const CLE_STORAGE = 'dofus_elevage_checklist_v2';

export function chargerEtat(): EtatApplication | null {
  try {
    const brut = localStorage.getItem(CLE_STORAGE);
    if (!brut) return null;
    return JSON.parse(brut) as EtatApplication;
  } catch {
    return null;
  }
}

export function sauvegarderEtat(etat: EtatApplication): void {
  localStorage.setItem(CLE_STORAGE, JSON.stringify(etat));
}

export function creerEtatInitial(ids: string[]): EtatApplication {
  const progression: Record<string, StatutDinde> = {};
  ids.forEach((id: string) => {
    progression[id] = 'A_FAIRE';
  });

  return {
    progression,
    derniereMAJISO: new Date().toISOString(),
  };
}
