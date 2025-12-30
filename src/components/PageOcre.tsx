import React, { useEffect, useMemo, useState } from 'react';
import type { CaptureAme, EtatOcre } from '../types/ocre';
import { chargerEtatOcre, creerEtatOcreInitial, sauvegarderEtatOcre } from '../utils/stockageOcre';

function creerIdCapture(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function PageOcre(): React.JSX.Element {
  const [etat, setEtat] = useState<EtatOcre>(() => {
    const existant = chargerEtatOcre();
    return existant ?? creerEtatOcreInitial();
  });
  const [nouvelleCapture, setNouvelleCapture] = useState<string>('');
  const [filtre, setFiltre] = useState<'TOUT' | 'OBTENUE' | 'A_FAIRE'>('TOUT');

  useEffect(() => {
    sauvegarderEtatOcre(etat);
  }, [etat]);

  const total = etat.captures.length;
  const obtenues = useMemo(() => etat.captures.filter((capture) => capture.obtenue).length, [etat.captures]);
  const pourcentage = total === 0 ? 0 : Math.round((obtenues / total) * 100);

  const capturesFiltrees = useMemo(() => {
    if (filtre === 'OBTENUE') return etat.captures.filter((capture) => capture.obtenue);
    if (filtre === 'A_FAIRE') return etat.captures.filter((capture) => !capture.obtenue);
    return etat.captures;
  }, [etat.captures, filtre]);

  const ajouterCapture = (): void => {
    const nom = nouvelleCapture.trim();
    if (!nom) return;

    const nouvelleEntree: CaptureAme = {
      id: creerIdCapture(),
      nom,
      obtenue: false,
    };

    setEtat((ancien: EtatOcre) => ({
      captures: [nouvelleEntree, ...ancien.captures],
      derniereMAJISO: new Date().toISOString(),
    }));
    setNouvelleCapture('');
  };

  const basculerCapture = (id: string): void => {
    setEtat((ancien: EtatOcre) => ({
      captures: ancien.captures.map((capture) =>
        capture.id === id ? { ...capture, obtenue: !capture.obtenue } : capture
      ),
      derniereMAJISO: new Date().toISOString(),
    }));
  };

  const supprimerCapture = (id: string): void => {
    setEtat((ancien: EtatOcre) => ({
      captures: ancien.captures.filter((capture) => capture.id !== id),
      derniereMAJISO: new Date().toISOString(),
    }));
  };

  const reinitialiser = (): void => {
    const ok = confirm('Effacer toutes les captures du Dofus Ocre ?');
    if (!ok) return;
    setEtat(creerEtatOcreInitial());
  };

  const exporter = (): void => {
    const contenu = JSON.stringify(etat, null, 2);
    const blob = new Blob([contenu], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'captures-ocre.json';
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
        const json = JSON.parse(texte) as EtatOcre;

        const captures = Array.isArray(json.captures)
          ? json.captures
              .filter((capture) => typeof capture.nom === 'string')
              .map((capture) => ({
                id: typeof capture.id === 'string' ? capture.id : creerIdCapture(),
                nom: capture.nom.trim(),
                obtenue: Boolean(capture.obtenue),
              }))
              .filter((capture) => capture.nom.length > 0)
          : [];

        setEtat({
          captures,
          derniereMAJISO: new Date().toISOString(),
        });
      } catch {
        alert('Import impossible : fichier invalide.');
      }
    };

    input.click();
  };

  return (
    <div className="page-ocre">
      <div className="barre">
        <div className="barre-gauche">
          <div className="titre-wow">
            <div className="logo-orbe" aria-hidden="true" />
            <div>
              <h1>Checklist Dofus Ocre — Captures d'âmes</h1>
              <div className="mini">
                Progression : <strong>{obtenues}</strong> / {total} — {pourcentage}%
              </div>
            </div>
          </div>

          <div className="progress-outer" aria-label="Progression des captures d'âmes">
            <div className="progress-inner" style={{ width: `${pourcentage}%` }} />
          </div>
        </div>

        <div className="barre-actions">
          <select className="select" value={filtre} onChange={(e) => setFiltre(e.target.value as typeof filtre)}>
            <option value="TOUT">Tout</option>
            <option value="A_FAIRE">À capturer</option>
            <option value="OBTENUE">Capturée</option>
          </select>

          <button className="btn" type="button" onClick={exporter}>
            Exporter
          </button>
          <button className="btn" type="button" onClick={importer}>
            Importer
          </button>
          <button className="btn btn-danger" type="button" onClick={reinitialiser}>
            Réinitialiser
          </button>
        </div>
      </div>

      <div className="ocre-actions">
        <div className="ocre-ajout">
          <input
            className="input"
            value={nouvelleCapture}
            onChange={(e) => setNouvelleCapture(e.target.value)}
            placeholder="Ex. : Dragoeuf de saphir"
            aria-label="Nom de la capture d'âme"
          />
          <button className="btn" type="button" onClick={ajouterCapture}>
            Ajouter
          </button>
        </div>
        <div className="mini ocre-aide">
          Ajoute chaque monstre capturé pour cocher ta progression du Dofus Ocre.
        </div>
      </div>

      <div className="section">
        <div className="section-entete">
          <h2>Captures</h2>
          <div className="compteur">
            {obtenues} capturée{obtenues > 1 ? 's' : ''} / {total}
          </div>
        </div>

        {capturesFiltrees.length === 0 ? (
          <div className="ocre-vide mini">Aucune capture pour le moment. Ajoute ta première entrée !</div>
        ) : (
          <ul className="ocre-liste">
            {capturesFiltrees.map((capture) => (
              <li key={capture.id} className={`ocre-item ${capture.obtenue ? 'ocre-item-ok' : ''}`}>
                <label className="ocre-item-check">
                  <input
                    type="checkbox"
                    checked={capture.obtenue}
                    onChange={() => basculerCapture(capture.id)}
                  />
                  <span>{capture.nom}</span>
                </label>
                <button className="btn btn-ghost" type="button" onClick={() => supprimerCapture(capture.id)}>
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
