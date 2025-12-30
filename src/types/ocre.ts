export interface CaptureAme {
  id: string;
  nom: string;
  obtenue: boolean;
}

export interface EtatOcre {
  captures: CaptureAme[];
  derniereMAJISO: string;
}
