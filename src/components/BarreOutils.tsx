import React from 'react';

export interface BarreOutilsProps {
  total: number;
  obtenues: number;
  filtre: string;
  onChangerFiltre: (valeur: string) => void;
  onExporter: () => void;
  onImporter: () => void;
  onReinitialiser: () => void;
}

export function BarreOutils(props: BarreOutilsProps): React.JSX.Element {
  const pourcentage = props.total === 0 ? 0 : Math.round((props.obtenues / props.total) * 100);

  return (
    <div className="barre">
      <div className="barre-gauche">
        <div className="titre-wow">
          <div className="logo-orbe" aria-hidden="true" />
          <div>
            <h1>Checklist élevage — “De génération en génération”</h1>
            <div className="mini">
              Progression : <strong>{props.obtenues}</strong> / {props.total} — {pourcentage}%
            </div>
          </div>
        </div>

        <div className="progress-outer" aria-label="Progression globale">
          <div className="progress-inner" style={{ width: `${pourcentage}%` }} />
        </div>
      </div>

      <div className="barre-actions">
        <select
          className="select"
          value={props.filtre}
          onChange={(e) => props.onChangerFiltre(e.target.value)}
        >
          <option value="TOUT">Tout</option>
          <option value="A_FAIRE">À faire</option>
          <option value="EN_FECONDATION">En fécondation</option>
          <option value="A_MONTER">À monter</option>
          <option value="OBTENUE">Obtenue</option>
        </select>

        <button className="btn" type="button" onClick={props.onExporter}>
          Exporter
        </button>
        <button className="btn" type="button" onClick={props.onImporter}>
          Importer
        </button>
        <button className="btn btn-danger" type="button" onClick={props.onReinitialiser}>
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
