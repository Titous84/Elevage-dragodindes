import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ---------------------------------------------------------
// Script: télécharge les images Tofus dans public/dindes/
// - essaie plusieurs URLs (listing-dinde + elevage + extensions)
// Usage: node scripts/telecharger-images-tofus.mjs
// ---------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const racineProjet = path.resolve(__dirname, '..');

const fichierDindes = path.join(racineProjet, 'src', 'data', 'dragodindes.ts');
const dossierSortie = path.join(racineProjet, 'public', 'dindes');

fs.mkdirSync(dossierSortie, { recursive: true });

function extraireSlugsDepuisTS(contenu) {
  const regex = /imageSlug\s*:\s*['"]([^'"]+)['"]/g;
  const slugs = new Set();
  let match;
  while ((match = regex.exec(contenu)) !== null) {
    slugs.add(match[1]);
  }
  return Array.from(slugs);
}

async function essayerTelecharger(url, cheminFichier) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    },
  });

  if (!res.ok) return { ok: false, status: res.status };

  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(cheminFichier, Buffer.from(arrayBuffer));
  return { ok: true, status: res.status };
}

function candidatsUrls(slug) {
  // 1) Listing (le plus courant)
  // 2) Dossier elevage (certains y sont)
  // 3) Extensions variées
  return [
    `https://tofus.fr/images/fiches/listing-dinde/${slug}.jpg`,
    `https://tofus.fr/images/fiches/listing-dinde/${slug}.png`,
    `https://tofus.fr/images/elevage/${slug}.jpg`,
    `https://tofus.fr/images/elevage/${slug}.JPG`,
    `https://tofus.fr/images/elevage/${slug}.png`,
  ];
}

(async () => {
  console.log('--- Téléchargement images dragodindes (Tofus) ---');

  if (!fs.existsSync(fichierDindes)) {
    console.error(`Fichier introuvable: ${fichierDindes}`);
    process.exit(1);
  }

  const contenu = fs.readFileSync(fichierDindes, 'utf8');
  const slugs = extraireSlugsDepuisTS(contenu);

  if (slugs.length === 0) {
    console.error("Aucun 'imageSlug' trouvé dans src/data/dragodindes.ts");
    process.exit(1);
  }

  console.log(`Slugs trouvés: ${slugs.length}`);
  console.log(`Dossier sortie: ${dossierSortie}`);
  console.log('');

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (const slug of slugs) {
    const fichier = path.join(dossierSortie, `${slug}.jpg`);

    // on sauvegarde toujours en .jpg côté local (même si source .png/.JPG)
    if (fs.existsSync(fichier)) {
      skipped++;
      console.log(`SKIP  ${slug}.jpg (déjà présent)`);
      continue;
    }

    const urls = candidatsUrls(slug);
    let success = false;

    for (const url of urls) {
      const res = await essayerTelecharger(url, fichier);
      if (res.ok) {
        ok++;
        console.log(`OK    ${slug}.jpg  <=  ${url}`);
        success = true;
        break;
      }
    }

    if (!success) {
      failed++;
      console.log(`FAIL  ${slug}.jpg (aucune URL valide)`);
    }
  }

  console.log('\n--- Résumé ---');
  console.log(`OK: ${ok}`);
  console.log(`SKIP: ${skipped}`);
  console.log(`FAIL: ${failed}`);

  if (failed > 0) {
    console.log(
      "\nAstuce: si certains slugs FAIL, ouvre la page Tofus correspondante et ajuste le slug (ordre, tirets, accents)."
    );
  }
})();
