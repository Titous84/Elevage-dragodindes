import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const racineRepo = path.resolve(__dirname, '..');
const sortie = path.join(racineRepo, 'public', 'monstres');

const extensions = ['png', 'jpeg', 'jpg'];

function slugifierMonstre(nom) {
  return nom
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');
}

function extraireEtapes(contenu) {
  const regexp = /numero:\s*(\d+),\s*monstres:\s*\[(.*?)\]\s*/gs;
  const resultat = [];
  let match;

  while ((match = regexp.exec(contenu)) !== null) {
    const bloc = match[2];
    const noms = Array.from(bloc.matchAll(/'([^']+)'|"([^"]+)"/g)).map((m) => m[1] ?? m[2]);
    resultat.push(...noms);
  }

  return resultat;
}

async function lireMonstres() {
  const fichier = path.join(racineRepo, 'src', 'data', 'ocreMonstres.ts');
  const contenu = await fs.readFile(fichier, 'utf8');
  return extraireEtapes(contenu);
}

async function telechargerImage(slug) {
  for (const ext of extensions) {
    const url = `https://www.metamob.fr/img/monstres/${slug}.${ext}`;
    const reponse = await fetch(url);
    if (reponse.ok) {
      const buffer = Buffer.from(await reponse.arrayBuffer());
      const destination = path.join(sortie, `${slug}.${ext}`);
      await fs.writeFile(destination, buffer);
      return { url, destination };
    }
  }
  return null;
}

async function main() {
  await fs.mkdir(sortie, { recursive: true });

  const noms = await lireMonstres();
  const slugs = Array.from(new Set(noms.map((nom) => slugifierMonstre(nom))));

  let succes = 0;
  let echec = 0;

  for (const slug of slugs) {
    const resultat = await telechargerImage(slug);
    if (resultat) {
      succes += 1;
      console.log(`Téléchargé: ${resultat.url} -> ${resultat.destination}`);
    } else {
      echec += 1;
      console.warn(`Introuvable: ${slug}`);
    }
  }

  console.log(`\nTerminé. Succès: ${succes}, Échecs: ${echec}`);
}

main().catch((error) => {
  console.error('Erreur lors du téléchargement:', error);
  process.exit(1);
});
