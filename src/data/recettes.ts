export interface RecetteAccouplement {
  cibleId: string;
  parent1Id: string;
  parent2Id: string;
}

export const RECETTES: RecetteAccouplement[] = [
  // Génération 2
  { cibleId: 'g2-amande-rousse', parent1Id: 'g1-amande', parent2Id: 'g1-rousse' },
  { cibleId: 'g2-doree-rousse', parent1Id: 'g1-doree', parent2Id: 'g1-rousse' },
  { cibleId: 'g2-amande-doree', parent1Id: 'g1-amande', parent2Id: 'g1-doree' },

  // Génération 4
  { cibleId: 'g4-indigo-rousse', parent1Id: 'g3-indigo', parent2Id: 'g1-rousse' },
  { cibleId: 'g4-ebene-rousse', parent1Id: 'g3-ebene', parent2Id: 'g1-rousse' },
  { cibleId: 'g4-amande-indigo', parent1Id: 'g1-amande', parent2Id: 'g3-indigo' },
  { cibleId: 'g4-amande-ebene', parent1Id: 'g1-amande', parent2Id: 'g3-ebene' },
  { cibleId: 'g4-doree-indigo', parent1Id: 'g1-doree', parent2Id: 'g3-indigo' },
  { cibleId: 'g4-doree-ebene', parent1Id: 'g1-doree', parent2Id: 'g3-ebene' },
  { cibleId: 'g4-ebene-indigo', parent1Id: 'g3-ebene', parent2Id: 'g3-indigo' },

  // Génération 6
  { cibleId: 'g6-pourpre-rousse', parent1Id: 'g5-pourpre', parent2Id: 'g1-rousse' },
  { cibleId: 'g6-orchidee-rousse', parent1Id: 'g5-orchidee', parent2Id: 'g1-rousse' },
  { cibleId: 'g6-amande-pourpre', parent1Id: 'g1-amande', parent2Id: 'g5-pourpre' },
  { cibleId: 'g6-amande-orchidee', parent1Id: 'g1-amande', parent2Id: 'g5-orchidee' },
  { cibleId: 'g6-doree-pourpre', parent1Id: 'g1-doree', parent2Id: 'g5-pourpre' },
  { cibleId: 'g6-doree-orchidee', parent1Id: 'g1-doree', parent2Id: 'g5-orchidee' },
  { cibleId: 'g6-indigo-pourpre', parent1Id: 'g3-indigo', parent2Id: 'g5-pourpre' },
  { cibleId: 'g6-indigo-orchidee', parent1Id: 'g3-indigo', parent2Id: 'g5-orchidee' },
  { cibleId: 'g6-ebene-pourpre', parent1Id: 'g3-ebene', parent2Id: 'g5-pourpre' },
  { cibleId: 'g6-ebene-orchidee', parent1Id: 'g3-ebene', parent2Id: 'g5-orchidee' },
  { cibleId: 'g6-orchidee-pourpre', parent1Id: 'g5-orchidee', parent2Id: 'g5-pourpre' },

  // Génération 8
  { cibleId: 'g8-ivoire-rousse', parent1Id: 'g7-ivoire', parent2Id: 'g1-rousse' },
  { cibleId: 'g8-turquoise-rousse', parent1Id: 'g7-turquoise', parent2Id: 'g1-rousse' },
  { cibleId: 'g8-amande-ivoire', parent1Id: 'g1-amande', parent2Id: 'g7-ivoire' },
  { cibleId: 'g8-amande-turquoise', parent1Id: 'g1-amande', parent2Id: 'g7-turquoise' },
  { cibleId: 'g8-doree-ivoire', parent1Id: 'g1-doree', parent2Id: 'g7-ivoire' },
  { cibleId: 'g8-doree-turquoise', parent1Id: 'g1-doree', parent2Id: 'g7-turquoise' },
  { cibleId: 'g8-indigo-ivoire', parent1Id: 'g3-indigo', parent2Id: 'g7-ivoire' },
  { cibleId: 'g8-indigo-turquoise', parent1Id: 'g3-indigo', parent2Id: 'g7-turquoise' },
  { cibleId: 'g8-ebene-ivoire', parent1Id: 'g3-ebene', parent2Id: 'g7-ivoire' },
  { cibleId: 'g8-ebene-turquoise', parent1Id: 'g3-ebene', parent2Id: 'g7-turquoise' },
  { cibleId: 'g8-ivoire-pourpre', parent1Id: 'g7-ivoire', parent2Id: 'g5-pourpre' },
  { cibleId: 'g8-turquoise-pourpre', parent1Id: 'g7-turquoise', parent2Id: 'g5-pourpre' },
  { cibleId: 'g8-ivoire-orchidee', parent1Id: 'g7-ivoire', parent2Id: 'g5-orchidee' },
  { cibleId: 'g8-turquoise-orchidee', parent1Id: 'g7-turquoise', parent2Id: 'g5-orchidee' },
  { cibleId: 'g8-ivoire-turquoise', parent1Id: 'g7-ivoire', parent2Id: 'g7-turquoise' },

  // Génération 10
  { cibleId: 'g10-emeraude-rousse', parent1Id: 'g9-emeraude', parent2Id: 'g1-rousse' },
  { cibleId: 'g10-prune-rousse', parent1Id: 'g9-prune', parent2Id: 'g1-rousse' },
  { cibleId: 'g10-amande-emeraude', parent1Id: 'g1-amande', parent2Id: 'g9-emeraude' },
  { cibleId: 'g10-prune-amande', parent1Id: 'g9-prune', parent2Id: 'g1-amande' },
  { cibleId: 'g10-doree-emeraude', parent1Id: 'g1-doree', parent2Id: 'g9-emeraude' },
  { cibleId: 'g10-prune-doree', parent1Id: 'g9-prune', parent2Id: 'g1-doree' },
  { cibleId: 'g10-emeraude-indigo', parent1Id: 'g9-emeraude', parent2Id: 'g3-indigo' },
  { cibleId: 'g10-prune-indigo', parent1Id: 'g9-prune', parent2Id: 'g3-indigo' },
  { cibleId: 'g10-ebene-emeraude', parent1Id: 'g3-ebene', parent2Id: 'g9-emeraude' },
  { cibleId: 'g10-prune-ebene', parent1Id: 'g9-prune', parent2Id: 'g3-ebene' },
  { cibleId: 'g10-emeraude-pourpre', parent1Id: 'g9-emeraude', parent2Id: 'g5-pourpre' },
  { cibleId: 'g10-prune-pourpre', parent1Id: 'g9-prune', parent2Id: 'g5-pourpre' },
  { cibleId: 'g10-emeraude-orchidee', parent1Id: 'g9-emeraude', parent2Id: 'g5-orchidee' },
  { cibleId: 'g10-prune-orchidee', parent1Id: 'g9-prune', parent2Id: 'g5-orchidee' },
  { cibleId: 'g10-emeraude-ivoire', parent1Id: 'g9-emeraude', parent2Id: 'g7-ivoire' },
  { cibleId: 'g10-prune-ivoire', parent1Id: 'g9-prune', parent2Id: 'g7-ivoire' },
  { cibleId: 'g10-emeraude-turquoise', parent1Id: 'g9-emeraude', parent2Id: 'g7-turquoise' },
  { cibleId: 'g10-prune-turquoise', parent1Id: 'g9-prune', parent2Id: 'g7-turquoise' },
  { cibleId: 'g10-prune-emeraude', parent1Id: 'g9-prune', parent2Id: 'g9-emeraude' },
];
