import React, { useState } from 'react';
import type { Dragodinde, StatutDinde } from '../types/elevage';

export interface CarteDindeProps {
  dinde: Dragodinde;
  statut: StatutDinde;
  onChangerStatut: (id: string, nouveauStatut: StatutDinde) => void;
  onOuvrirRecette: (id: string) => void;
}

function libelleStatut(statut: StatutDinde): string {
  if (statut === 'A_FAIRE') return 'À faire';
  if (statut === 'EN_FECONDATION') return 'En fécondation';
  if (statut === 'A_MONTER') return 'À monter';
  return 'Obtenue';
}

function urlImage(slug?: string): string | null {
  if (!slug) return null;
  return `/dindes/${slug}.jpg`;
}

export function CarteDinde(props: CarteDindeProps): React.JSX.Element {
  const [imageOK, setImageOK] = useState<boolean>(true);

  const boutonClass = (valeur: StatutDinde): string => {
    const actif = props.statut === valeur;
    return actif ? 'btn btn-actif' : 'btn';
  };

  const src = urlImage(props.dinde.imageSlug);

  return (
    <div
      className={`carte carte-${props.statut.toLowerCase()}`}
      onClick={() => props.onOuvrirRecette(props.dinde.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') props.onOuvrirRecette(props.dinde.id);
      }}
      title="Clique pour voir la recette (parents)"
    >
      <div className="carte-ligne">
        <div className="carte-titre">
          {src && imageOK && (
            <img
              src={src}
              alt={props.dinde.nom}
              className="dinde-img"
              loading="lazy"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              onError={() => setImageOK(false)}
            />
          )}

          <span className="badge">G{props.dinde.generation}</span>
          <strong>{props.dinde.nom}</strong>
        </div>

        <div className="carte-statut">
          <span className="mini">{libelleStatut(props.statut)}</span>
        </div>
      </div>

      <div className="carte-actions">
        <button
          className={boutonClass('A_FAIRE')}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => props.onChangerStatut(props.dinde.id, 'A_FAIRE')}
          type="button"
        >
          À faire
        </button>

        <button
          className={boutonClass('EN_FECONDATION')}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => props.onChangerStatut(props.dinde.id, 'EN_FECONDATION')}
          type="button"
        >
          Fécondation
        </button>

        <button
          className={boutonClass('A_MONTER')}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => props.onChangerStatut(props.dinde.id, 'A_MONTER')}
          type="button"
        >
          À monter
        </button>

        <button
          className={boutonClass('OBTENUE')}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => props.onChangerStatut(props.dinde.id, 'OBTENUE')}
          type="button"
        >
          Obtenue
        </button>
      </div>
    </div>
  );
}
