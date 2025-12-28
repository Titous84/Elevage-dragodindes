export type StatutDinde = 'A_FAIRE' | 'EN_FECONDATION' | 'A_MONTER' | 'OBTENUE';

export interface Dragodinde {
  id: string;
  nom: string;
  generation: number; // 1..10
  imageSlug?: string; // ex: "amande-rousse"
}

export interface EtatApplication {
  progression: Record<string, StatutDinde>;
  derniereMAJISO: string;
}
