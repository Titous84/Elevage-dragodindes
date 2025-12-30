import { MONSTRES_OCRE } from '../data/ocreMonstres';
import type { MonstreOcreProgression } from '../types/ocre';
import { slugifierMonstre } from './slugMonstre';

const CLE_STORAGE_OCRE = 'dofus_ocre_captures_v2';

type AncienEtatOcre = {
  captures?: { id?: string; nom?: string; obtenue?: boolean }[];
};

export function chargerEtatOcre(): MonstreOcreProgression | null {
  try {
    const brut = localStorage.getItem(CLE_STORAGE_OCRE);
    if (!brut) return null;
    return JSON.parse(brut) as MonstreOcreProgression;
  } catch {
    return null;
  }
}

export function sauvegarderEtatOcre(etat: MonstreOcreProgression): void {
  localStorage.setItem(CLE_STORAGE_OCRE, JSON.stringify(etat));
}

export function creerEtatOcreInitial(): MonstreOcreProgression {
  const progression: Record<string, boolean> = {};
  MONSTRES_OCRE.forEach((monstre) => {
    progression[monstre.id] = false;
  });

  return {
    progression,
    derniereMAJISO: new Date().toISOString(),
  };
}

export function migrerAncienEtatOcre(etat: AncienEtatOcre): MonstreOcreProgression {
  const base = creerEtatOcreInitial();
  if (!etat.captures || etat.captures.length === 0) {
    return base;
  }

  const parSlug: Record<string, string[]> = {};
  MONSTRES_OCRE.forEach((monstre) => {
    if (!parSlug[monstre.slug]) {
      parSlug[monstre.slug] = [];
    }
    parSlug[monstre.slug].push(monstre.id);
  });

  Object.values(parSlug).forEach((ids) => ids.sort());

  const compteurs: Record<string, number> = {};

  etat.captures.forEach((capture) => {
    if (!capture.nom || !capture.obtenue) return;
    const slug = slugifierMonstre(capture.nom);
    const index = compteurs[slug] ?? 0;
    const id = parSlug[slug]?.[index];
    if (id) {
      base.progression[id] = true;
      compteurs[slug] = index + 1;
    }
  });

  return {
    progression: base.progression,
    derniereMAJISO: new Date().toISOString(),
  };
}
