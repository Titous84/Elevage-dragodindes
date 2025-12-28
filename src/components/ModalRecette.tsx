import React, { useEffect, useState } from 'react';
import type { Dragodinde, StatutDinde } from '../types/elevage';
import type { RecetteAccouplement } from '../data/recettes';

export interface ModalRecetteProps {
  estOuvert: boolean;
  onFermer: () => void;

  dindeCible: Dragodinde | null;
  recette: RecetteAccouplement | null;

  progression: Record<string, StatutDinde>;
  trouverDindeParId: (id: string) => Dragodinde | undefined;

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

export function ModalRecette(props: ModalRecetteProps): React.JSX.Element | null {
  const [imgOKCible, setImgOKCible] = useState(true);
  const [imgOKP1, setImgOKP1] = useState(true);
  const [imgOKP2, setImgOKP2] = useState(true);

  useEffect(() => {
    setImgOKCible(true);
    setImgOKP1(true);
    setImgOKP2(true);
  }, [props.dindeCible?.id]);

  if (!props.estOuvert || !props.dindeCible) return null;

  const parent1 = props.recette ? props.trouverDindeParId(props.recette.parent1Id) : undefined;
  const parent2 = props.recette ? props.trouverDindeParId(props.recette.parent2Id) : undefined;

  const srcCible = urlImage(props.dindeCible.imageSlug);
  const srcP1 = parent1 ? urlImage(parent1.imageSlug) : null;
  const srcP2 = parent2 ? urlImage(parent2.imageSlug) : null;

  return (
    <div className="modal-overlay" onMouseDown={props.onFermer}>
      <div className="modal modal-pop" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-entete">
          <div className="modal-titre">
            <div className="sparkle" aria-hidden="true" />
            <h3>Recette d’élevage</h3>
          </div>

          <button className="btn" type="button" onClick={props.onFermer}>
            ✕
          </button>
        </div>

        <div className="modal-contenu">
          <div className="modal-cible">
            {srcCible && imgOKCible && (
              <img
                src={srcCible}
                alt={props.dindeCible.nom}
                className="dinde-img dinde-img-lg"
                loading="lazy"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                onError={() => setImgOKCible(false)}
              />
            )}
            <div>
              <div className="badge">G{props.dindeCible.generation}</div>
              <div className="modal-cible-nom">{props.dindeCible.nom}</div>
            </div>
          </div>

          {!props.recette && (
            <p className="mini" style={{ marginTop: 12 }}>
              Cette dragodinde est une base / “pure” dans cette checklist.
              <br />
              (Aucune recette affichée ici.)
            </p>
          )}

          {props.recette && parent1 && parent2 && (
            <>
              <div className="mini" style={{ marginTop: 12 }}>
                Parents nécessaires (cliquables) :
              </div>

              <div className="modal-parents">
                <div
                  className={`parent parent-${props.progression[parent1.id].toLowerCase()} parent-click`}
                  role="button"
                  tabIndex={0}
                  onClick={() => props.onOuvrirRecette(parent1.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') props.onOuvrirRecette(parent1.id);
                  }}
                  title="Ouvrir la recette de ce parent"
                >
                  {srcP1 && imgOKP1 && (
                    <img
                      src={srcP1}
                      alt={parent1.nom}
                      className="dinde-img"
                      loading="lazy"
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      onError={() => setImgOKP1(false)}
                    />
                  )}
                  <div>
                    <div className="badge">G{parent1.generation}</div>
                    <strong>{parent1.nom}</strong>
                    <div className="mini">{libelleStatut(props.progression[parent1.id])}</div>
                  </div>
                </div>

                <div
                  className={`parent parent-${props.progression[parent2.id].toLowerCase()} parent-click`}
                  role="button"
                  tabIndex={0}
                  onClick={() => props.onOuvrirRecette(parent2.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') props.onOuvrirRecette(parent2.id);
                  }}
                  title="Ouvrir la recette de ce parent"
                >
                  {srcP2 && imgOKP2 && (
                    <img
                      src={srcP2}
                      alt={parent2.nom}
                      className="dinde-img"
                      loading="lazy"
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      onError={() => setImgOKP2(false)}
                    />
                  )}
                  <div>
                    <div className="badge">G{parent2.generation}</div>
                    <strong>{parent2.nom}</strong>
                    <div className="mini">{libelleStatut(props.progression[parent2.id])}</div>
                  </div>
                </div>
              </div>

              <div className="mini" style={{ marginTop: 12, opacity: 0.9 }}>
                Astuce : clique les parents pour remonter la chaîne.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
