import React, { useEffect, useMemo, useState } from 'react';
import { ETAPES_OCRE, MONSTRES_OCRE } from '../data/ocreMonstres';
import type { MonstreOcreProgression } from '../types/ocre';
import { chargerEtatOcre, creerEtatOcreInitial, migrerAncienEtatOcre, sauvegarderEtatOcre } from '../utils/stockageOcre';

const EXTENSIONS = ['png', 'jpeg', 'jpg'] as const;

type Extension = (typeof EXTENSIONS)[number];

function ImageMonstre({ nom, slug }: { nom: string; slug: string }): React.JSX.Element {
  const [extension, setExtension] = useState<Extension>('png');
  const [aEssayer, setAEssayer] = useState<Extension[]>([...EXTENSIONS]);

  useEffect(() => {
    setExtension('png');
    setAEssayer([...EXTENSIONS]);
  }, [slug]);

  const gererErreur = (): void => {
    const restantes = aEssayer.slice(1);
    if (restantes.length === 0) {
      setExtension('png');
      setAEssayer([]);
      return;
    }
    setAEssayer(restantes);
    setExtension(restantes[0]);
  };

  if (aEssayer.length === 0) {
    return <div className="ocre-image ocre-image-manquante" aria-hidden="true" />;
  }

  return (
    <img
      className="ocre-image"
      src={`/monstres/${slug}.${extension}`}
      alt={nom}
      loading="lazy"
      onError={gererErreur}
    />
  );
}

export function PageOcre(): React.JSX.Element {
  const [etat, setEtat] = useState<MonstreOcreProgression>(() => {
    const existant = chargerEtatOcre();
    if (existant) return existant;

    const brut = localStorage.getItem('dofus_ocre_captures_v1');
    if (brut) {
      try {
        const ancien = JSON.parse(brut) as unknown;
        return migrerAncienEtatOcre(ancien as { captures?: { nom?: string; obtenue?: boolean }[] });
      } catch {
        return creerEtatOcreInitial();
      }
    }

    return creerEtatOcreInitial();
  });
  const [filtre, setFiltre] = useState<'TOUT' | 'OBTENUE' | 'A_FAIRE'>('TOUT');
  const [recherche, setRecherche] = useState<string>('');

  useEffect(() => {
    sauvegarderEtatOcre(etat);
  }, [etat]);

  const total = MONSTRES_OCRE.length;
  const obtenues = useMemo(
    () => MONSTRES_OCRE.filter((monstre) => etat.progression[monstre.id]).length,
    [etat.progression]
  );
  const pourcentage = total === 0 ? 0 : Math.round((obtenues / total) * 100);

  const termeRecherche = recherche.trim().toLowerCase();

  const monstresParEtape = useMemo(() => {
    return ETAPES_OCRE.map((etape) => {
      const monstres = MONSTRES_OCRE.filter((monstre) => monstre.etape === etape.numero);

      const filtres = monstres.filter((monstre) => {
        const estObtenue = etat.progression[monstre.id];
        if (filtre === 'OBTENUE' && !estObtenue) return false;
        if (filtre === 'A_FAIRE' && estObtenue) return false;
        if (termeRecherche && !monstre.nom.toLowerCase().includes(termeRecherche)) return false;
        return true;
      });

      const obtenuesEtape = monstres.filter((monstre) => etat.progression[monstre.id]).length;

      return {
        numero: etape.numero,
        monstres: filtres,
        total: monstres.length,
        obtenues: obtenuesEtape,
      };
    });
  }, [etat.progression, filtre, termeRecherche]);

  const basculerCapture = (id: string): void => {
    setEtat((ancien: MonstreOcreProgression) => ({
      progression: { ...ancien.progression, [id]: !ancien.progression[id] },
      derniereMAJISO: new Date().toISOString(),
    }));
  };

  const reinitialiser = (): void => {
    const ok = confirm('Réinitialiser toute la progression du Dofus Ocre ?');
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
        const json = JSON.parse(texte) as MonstreOcreProgression;

        if (!json.progression) {
          throw new Error('Format invalide');
        }

        const progression: Record<string, boolean> = { ...creerEtatOcreInitial().progression };
        Object.entries(json.progression).forEach(([id, valeur]) => {
          if (Object.hasOwn(progression, id)) {
            progression[id] = Boolean(valeur);
          }
        });

        setEtat({
          progression,
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
        <div className="ocre-recherche">
          <input
            className="input"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un monstre"
            aria-label="Recherche d'un monstre"
          />
        </div>
        <div className="mini ocre-aide">
          Les monstres sont séparés par étape. Coche chaque capture obtenue pour suivre ta progression.
        </div>
      </div>

      {monstresParEtape.map((etape) => (
        <section key={etape.numero} className="section">
          <div className="section-entete">
            <h2>Étape {etape.numero}</h2>
            <div className="compteur">
              {etape.obtenues} / {etape.total}
            </div>
          </div>

          {etape.monstres.length === 0 ? (
            <div className="ocre-vide mini">Aucun monstre pour ce filtre.</div>
          ) : (
            <ul className="ocre-liste">
              {etape.monstres.map((monstre) => (
                <li key={monstre.id} className={`ocre-item ${etat.progression[monstre.id] ? 'ocre-item-ok' : ''}`}>
                  <label className="ocre-item-check">
                    <input
                      type="checkbox"
                      checked={etat.progression[monstre.id]}
                      onChange={() => basculerCapture(monstre.id)}
                    />
                    <ImageMonstre nom={monstre.nom} slug={monstre.slug} />
                    <span>{monstre.nom}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
