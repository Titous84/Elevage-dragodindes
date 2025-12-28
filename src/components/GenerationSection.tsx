import React from 'react';
import type { Dragodinde, StatutDinde } from '../types/elevage';
import { CarteDinde } from './CarteDinde';

export interface GenerationSectionProps {
  generation: number;
  dindes: Dragodinde[];
  progression: Record<string, StatutDinde>;
  onChangerStatut: (id: string, nouveauStatut: StatutDinde) => void;
  onOuvrirRecette: (id: string) => void;
}

export function GenerationSection(props: GenerationSectionProps): React.JSX.Element {
  const total = props.dindes.length;
  const obtenues = props.dindes.filter((d: Dragodinde) => props.progression[d.id] === 'OBTENUE').length;
  const pourcentage = total === 0 ? 0 : Math.round((obtenues / total) * 100);

  return (
    <section className="section">
      <div className="section-entete">
        <h2>Dragodinde : {props.generation}e génération</h2>
        <div className="compteur">
          {obtenues}/{total} — {pourcentage}%
        </div>
      </div>

      <div className="grille">
        {props.dindes.map((d: Dragodinde) => (
          <CarteDinde
            key={d.id}
            dinde={d}
            statut={props.progression[d.id]}
            onChangerStatut={props.onChangerStatut}
            onOuvrirRecette={props.onOuvrirRecette}
          />
        ))}
      </div>
    </section>
  );
}
