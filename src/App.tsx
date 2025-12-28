import React, { useEffect, useMemo, useState } from 'react';
import { DRAGODINDES } from './data/dragodindes';
import type { EtatApplication, StatutDinde, Dragodinde } from './types/elevage';
import { chargerEtat, creerEtatInitial, sauvegarderEtat } from './utils/stockageLocal';
import { BarreOutils } from './components/BarreOutils';
import { GenerationSection } from './components/GenerationSection';

import { RECETTES } from './data/recettes';
import { ModalRecette } from './components/ModalRecette';

function genererListeGenerations(): number[] {
  return Array.from(new Set(DRAGODINDES.map((d) => d.generation))).sort((a, b) => a - b);
}

export default function App(): React.JSX.Element {
  const ids = useMemo(() => DRAGODINDES.map((d) => d.id), []);
  const [etat, setEtat] = useState<EtatApplication>(() => {
    const existant = chargerEtat();
    return existant ?? creerEtatInitial(ids);
  });

  const [filtre, setFiltre] = useState<string>('TOUT');

  // Modal recette
  const [modalOuvert, setModalOuvert] = useState<boolean>(false);
  const [dindeSelectionneeId, setDindeSelectionneeId] = useState<string | null>(null);

  useEffect(() => {
    sauvegarderEtat(etat);
  }, [etat]);

  const total = DRAGODINDES.length;
  const obtenues = DRAGODINDES.filter((d) => etat.progression[d.id] === 'OBTENUE').length;

  const generations = useMemo(() => genererListeGenerations(), []);

  const changerStatut = (id: string, nouveauStatut: StatutDinde): void => {
    setEtat((ancien: EtatApplication) => {
      return {
        progression: { ...ancien.progression, [id]: nouveauStatut },
        derniereMAJISO: new Date().toISOString(),
      };
    });
  };

  const exporter = (): void => {
    const contenu = JSON.stringify(etat, null, 2);
    const blob = new Blob([contenu], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'progression-elevage.json';
    a.click();

    URL.revokeObjectURL(url);
  };

  const importer = (): void => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = async () => {
      const fichier = input.files?.[0];
      if (!fichier) return;

      try {
        const texte = await fichier.text();
        const json = JSON.parse(texte) as EtatApplication;

        const nouvelleProgression: Record<string, StatutDinde> = { ...etat.progression };
        ids.forEach((id: string) => {
          const val = json.progression?.[id];
          if (val === 'A_FAIRE' || val === 'EN_FECONDATION' || val === 'A_MONTER' || val === 'OBTENUE') {
            nouvelleProgression[id] = val;
          }
        });

        setEtat({
          progression: nouvelleProgression,
          derniereMAJISO: new Date().toISOString(),
        });
      } catch {
        alert('Import impossible : fichier invalide.');
      }
    };

    input.click();
  };

  const reinitialiser = (): void => {
    const ok = confirm('Réinitialiser toute la progression ?');
    if (!ok) return;
    setEtat(creerEtatInitial(ids));
    setFiltre('TOUT');
  };

  // Utilitaires des recettes
  const trouverDindeParId = (id: string): Dragodinde | undefined => DRAGODINDES.find((d) => d.id === id);
  const recettePour = (id: string) => RECETTES.find((r) => r.cibleId === id) ?? null;

  const ouvrirRecette = (id: string): void => {
    setDindeSelectionneeId(id);
    setModalOuvert(true);
  };

  const fermerRecette = (): void => setModalOuvert(false);

  return (
    <div className="page">
      <BarreOutils
        total={total}
        obtenues={obtenues}
        filtre={filtre}
        onChangerFiltre={setFiltre}
        onExporter={exporter}
        onImporter={importer}
        onReinitialiser={reinitialiser}
      />

      <div className="contenu">
        {generations.map((g: number) => {
          const dindesGen = DRAGODINDES.filter((d) => d.generation === g);

          const dindesFiltrees =
            filtre === 'TOUT'
              ? dindesGen
              : dindesGen.filter((d) => etat.progression[d.id] === (filtre as StatutDinde));

          return (
            <GenerationSection
              key={g}
              generation={g}
              dindes={dindesFiltrees}
              progression={etat.progression}
              onChangerStatut={changerStatut}
              onOuvrirRecette={ouvrirRecette}
            />
          );
        })}
      </div>

      <ModalRecette
        estOuvert={modalOuvert}
        onFermer={fermerRecette}
        dindeCible={dindeSelectionneeId ? trouverDindeParId(dindeSelectionneeId) ?? null : null}
        recette={dindeSelectionneeId ? recettePour(dindeSelectionneeId) : null}
        progression={etat.progression}
        trouverDindeParId={trouverDindeParId}
        onOuvrirRecette={ouvrirRecette}
      />
    </div>
  );
}
