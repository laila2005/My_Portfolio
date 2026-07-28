/**
 * Generates the social share card and compresses oversized public/ images to WebP.
 * Run with: node scripts/generate-assets.mjs
 */
import sharp from 'sharp';
import { readFile, writeFile, stat } from 'node:fs/promises';
import { join, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');

const NAME = 'Laila Mohamed Fikry';
const TITLE = 'Software Engineer · Full-Stack & Systems';
const TAGLINE = 'Enterprise IoT platforms · Real-time systems · AI pipelines';
const DOMAIN = 'my-portfolio-mm2c.vercel.app';

/** Escape text for safe inclusion in SVG markup. */
const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function buildSocialCard() {
  const W = 1200;
  const H = 630;

  // Circular portrait, composited separately so sharp does the resampling.
  const portraitSize = 300;
  const circle = Buffer.from(
    `<svg width="${portraitSize}" height="${portraitSize}"><circle cx="${portraitSize / 2}" cy="${portraitSize / 2}" r="${portraitSize / 2}" fill="#fff"/></svg>`
  );
  const portrait = await sharp(join(pub, 'profile2.jpg'))
    .resize(portraitSize, portraitSize, { fit: 'cover', position: 'top' })
    .composite([{ input: circle, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const techChips = ['React', 'Next.js', 'Node.js', 'FastAPI', 'PostgreSQL', 'Python'];
  let chipX = 80;
  const chips = techChips
    .map((t) => {
      const w = t.length * 13 + 34;
      const el = `<g><rect x="${chipX}" y="470" width="${w}" height="42" rx="21" fill="rgba(167,139,250,0.14)" stroke="rgba(167,139,250,0.45)"/><text x="${chipX + w / 2}" y="497" font-family="Poppins, Segoe UI, sans-serif" font-size="18" font-weight="600" fill="#c4b5fd" text-anchor="middle">${esc(t)}</text></g>`;
      chipX += w + 12;
      return el;
    })
    .join('');

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B0614"/>
      <stop offset="55%" stop-color="#150C28"/>
      <stop offset="100%" stop-color="#0B0614"/>
    </linearGradient>
    <radialGradient id="glowA" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f472b6" stop-opacity="0.40"/>
      <stop offset="100%" stop-color="#f472b6" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="nameGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="60%" stop-color="#e9d5ff"/>
      <stop offset="100%" stop-color="#f9a8d4"/>
    </linearGradient>
    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#a78bfa"/>
      <stop offset="100%" stop-color="#f472b6"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="120" cy="90" r="340" fill="url(#glowA)"/>
  <circle cx="1080" cy="560" r="320" fill="url(#glowB)"/>

  <!-- subtle grid -->
  <g stroke="rgba(255,255,255,0.035)" stroke-width="1">
    ${Array.from({ length: 11 }, (_, i) => `<line x1="${i * 120}" y1="0" x2="${i * 120}" y2="${H}"/>`).join('')}
    ${Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${i * 120}" x2="${W}" y2="${i * 120}"/>`).join('')}
  </g>

  <!-- accent bar -->
  <rect x="80" y="96" width="64" height="6" rx="3" fill="url(#ring)"/>

  <text x="80" y="200" font-family="Poppins, Segoe UI, sans-serif" font-size="72" font-weight="800" fill="url(#nameGrad)">${esc(NAME)}</text>
  <text x="80" y="262" font-family="Poppins, Segoe UI, sans-serif" font-size="32" font-weight="600" fill="#a78bfa">${esc(TITLE)}</text>
  <text x="80" y="330" font-family="Inter, Segoe UI, sans-serif" font-size="24" fill="#9ca3af">${esc(TAGLINE)}</text>

  <!-- terminal motif echoing the site hero -->
  <g>
    <rect x="80" y="368" width="560" height="72" rx="14" fill="rgba(255,255,255,0.045)" stroke="rgba(167,139,250,0.28)"/>
    <circle cx="108" cy="404" r="6" fill="#f87171"/>
    <circle cx="128" cy="404" r="6" fill="#fbbf24"/>
    <circle cx="148" cy="404" r="6" fill="#4ade80"/>
    <text x="176" y="412" font-family="Consolas, monospace" font-size="21" fill="#d8b4fe">$ ./build --scale=national</text>
  </g>

  ${chips}

  <text x="80" y="580" font-family="Inter, Segoe UI, sans-serif" font-size="22" font-weight="600" fill="#6b7280">${esc(DOMAIN)}</text>

  <!-- portrait ring -->
  <circle cx="950" cy="290" r="162" fill="none" stroke="url(#ring)" stroke-width="3" opacity="0.85"/>
  <circle cx="950" cy="290" r="178" fill="none" stroke="rgba(167,139,250,0.18)" stroke-width="1.5"/>
</svg>`;

  await sharp(Buffer.from(svg))
    .composite([{ input: portrait, top: 290 - 150, left: 950 - 150 }])
    .png({ quality: 92, compressionLevel: 9 })
    .toFile(join(pub, 'og-card.png'));

  const { size } = await stat(join(pub, 'og-card.png'));
  console.log(`og-card.png  1200x630  ${(size / 1024).toFixed(0)} KB`);
}

// Referenced covers to convert to WebP. `width` caps the intrinsic size at ~2x
// the largest rendered size so we stop shipping 1024px+ art for 600px slots.
const COVERS = [
  { file: 'MazeGame.png', width: 1200, quality: 78 },
  { file: 'inqaz-cover.png', width: 1200, quality: 80 },
  { file: 'crash-detection-cover-v2.png', width: 1200, quality: 80 },
  { file: 'chat-ui-cover.png', width: 1400, quality: 80 },
  { file: 'riselist_logo.png', width: 1200, quality: 82 },
  { file: 'dishcraft.PNG', width: 1200, quality: 80 },
  { file: 'profile2.jpg', width: 600, quality: 82 },
];

async function convertCovers() {
  const rows = [];
  for (const { file, width, quality } of COVERS) {
    const src = join(pub, file);
    let before;
    try {
      ({ size: before } = await stat(src));
    } catch {
      console.warn(`skip (missing): ${file}`);
      continue;
    }
    const out = join(pub, `${basename(file, extname(file))}.webp`);
    const meta = await sharp(src).metadata();
    await sharp(src)
      .resize({ width: Math.min(width, meta.width ?? width), withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(out);
    const { size: after } = await stat(out);
    rows.push({
      file,
      before: `${(before / 1024).toFixed(0)} KB`,
      after: `${(after / 1024).toFixed(0)} KB`,
      saved: `${(100 - (after / before) * 100).toFixed(0)}%`,
      dims: `${Math.min(width, meta.width ?? width)}w`,
    });
  }
  console.table(rows);
  const total = rows.reduce((a, r) => a + parseInt(r.after), 0);
  console.log(`WebP total: ${total} KB`);
}

/** Emit the intrinsic dimensions of each generated WebP so components can set width/height. */
async function writeDimensions() {
  const dims = {};
  for (const { file } of COVERS) {
    const webp = join(pub, `${basename(file, extname(file))}.webp`);
    try {
      const m = await sharp(webp).metadata();
      dims[`/${basename(webp)}`] = { w: m.width, h: m.height };
    } catch {
      /* skipped above */
    }
  }
  await writeFile(join(root, 'src/data/image-dimensions.json'), JSON.stringify(dims, null, 2) + '\n');
  console.log('wrote src/data/image-dimensions.json');
}

await buildSocialCard();
await convertCovers();
await writeDimensions();
