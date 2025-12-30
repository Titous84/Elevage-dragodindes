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
    const etat = JSON.parse(brut) as MonstreOcreProgression;
    return normaliserProgression(etat.progression ?? {});
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

export function normaliserProgression(progression: Record<string, boolean>): MonstreOcreProgression {
  const base = creerEtatOcreInitial();
  const idsParCle = new Map<string, string>();
  MONSTRES_OCRE.forEach((monstre) => {
    idsParCle.set(`${monstre.etape}-${monstre.slug}`, monstre.id);
  });

  Object.entries(progression).forEach(([id, valeur]) => {
    if (!valeur) return;
    if (Object.hasOwn(base.progression, id)) {
      base.progression[id] = true;
      return;
    }

    const match = id.match(/^etape-(\\d+)-(.+?)(?:-\\d+)?$/);
    if (!match) return;
    const cle = `${match[1]}-${match[2]}`;
    const idNormalise = idsParCle.get(cle);
    if (idNormalise) {
      base.progression[idNormalise] = true;
    }
  });

  return {
    progression: base.progression,
    derniereMAJISO: new Date().toISOString(),
  };
}

export function migrerAncienEtatOcre(etat: AncienEtatOcre): MonstreOcreProgression {
  const base = creerEtatOcreInitial();
  if (!etat.captures || etat.captures.length === 0) {
    return base;
  }

  const parSlug: Record<string, string> = {};
  MONSTRES_OCRE.forEach((monstre) => {
    if (!parSlug[monstre.slug]) {
      parSlug[monstre.slug] = monstre.id;
    }
  });

  etat.captures.forEach((capture) => {
    if (!capture.nom || !capture.obtenue) return;
    const slug = slugifierMonstre(capture.nom);
    const id = parSlug[slug];
    if (id) {
      base.progression[id] = true;
    }
  });

  return {
    progression: base.progression,
    derniereMAJISO: new Date().toISOString(),
  };
}
