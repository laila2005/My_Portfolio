/**
 * Social share cards in the site's "Ink & Night" style.
 *
 *   public/og-card.png        the home page card
 *   public/og/<slug>.png      one card per project
 *
 * Run with: node scripts/generate-social-cards.mjs
 * The PNGs are committed, so a normal build never needs this script or any
 * installed fonts. Re-run it when a project's title, tagline or cover changes.
 *
 * Every word on a card comes from src/data/projects.ts or from facts already on
 * the site; nothing here is new copy.
 */
import sharp from 'sharp';
import { build } from 'esbuild';
import { mkdir, rm, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const W = 1200;
const H = 630;
const DOMAIN = 'my-portfolio-mm2c.vercel.app';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Greedy word wrap by character count; good enough for a fixed card font. */
function wrap(text, maxChars, maxLines) {
  const words = String(text).replace(/\s+/g, ' ').trim().split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = (line + ' ' + word).trim();
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1].replace(/[\s,;:.]+\S*$/, '') + '…';
    return kept;
  }
  return lines;
}

/** The site's butterfly, as SVG group markup at a given position and size. */
function butterfly(x, y, scale, { color = '#c4b5fd', opacity = 1, rotate = 0 } = {}) {
  return `<g transform="translate(${x} ${y}) rotate(${rotate} ${50 * scale} ${40 * scale}) scale(${scale})" fill="none" stroke="${color}" stroke-width="${1.6}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}">
    <path d="M50 40 C40 10 5 4 8 30 C10 46 35 49 50 40 Z" fill="${color}" fill-opacity="0.08"/>
    <path d="M50 42 C38 50 15 52 20 70 C25 83 42 71 50 46 Z" fill="${color}" fill-opacity="0.08"/>
    <path d="M50 40 C60 10 95 4 92 30 C90 46 65 49 50 40 Z" fill="${color}" fill-opacity="0.08"/>
    <path d="M50 42 C62 50 85 52 80 70 C75 83 58 71 50 46 Z" fill="${color}" fill-opacity="0.08"/>
    <path d="M47 39 C36 25 22 17 12 22" stroke-width="1.1"/><path d="M47 41 C34 36 20 36 11 33" stroke-width="1.1"/><path d="M46 44 C38 49 30 55 24 64" stroke-width="1.1"/>
    <path d="M53 39 C64 25 78 17 88 22" stroke-width="1.1"/><path d="M53 41 C66 36 80 36 89 33" stroke-width="1.1"/><path d="M54 44 C62 49 70 55 76 64" stroke-width="1.1"/>
    <ellipse cx="20" cy="27" rx="4.2" ry="2.6" transform="rotate(-25 20 27)" fill="${color}" fill-opacity="0.5" stroke="none"/>
    <ellipse cx="80" cy="27" rx="4.2" ry="2.6" transform="rotate(25 80 27)" fill="${color}" fill-opacity="0.5" stroke="none"/>
    <ellipse cx="50" cy="48" rx="2.2" ry="15" fill="${color}" fill-opacity="0.3"/>
    <circle cx="50" cy="31" r="2.6" fill="${color}" fill-opacity="0.6"/>
    <path d="M49 29 C46 21 41 16 35 13"/><path d="M51 29 C54 21 59 16 65 13"/>
  </g>`;
}

/** A sparse star field, deterministic so the cards do not change between runs. */
function stars() {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: 46 }, () => {
    const x = Math.round(rnd() * W);
    const y = Math.round(rnd() * H);
    const r = (0.8 + rnd() * 1.4).toFixed(1);
    const o = (0.25 + rnd() * 0.55).toFixed(2);
    const c = rnd() > 0.8 ? '#c4b5fd' : '#ffffff';
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="${o}"/>`;
  }).join('');
}

const base = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0e0d16"/>
      <stop offset="60%" stop-color="#161327"/>
      <stop offset="100%" stop-color="#0e0d16"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="1000" cy="300" r="380" fill="url(#glow)"/>
  ${stars()}`;

const out = async (svg, composites, file) => {
  await sharp(Buffer.from(svg)).composite(composites).png({ compressionLevel: 9 }).toFile(file);
  const { size } = await stat(file);
  console.log(`${file.replace(root, '').replace(/\\/g, '/')}  ${(size / 1024).toFixed(0)} KB`);
};

const chip = (x, y, label) => {
  const w = label.length * 12.2 + 36;
  return {
    w,
    svg: `<g><rect x="${x}" y="${y}" width="${w}" height="40" rx="20" fill="rgba(196,181,253,0.10)" stroke="rgba(196,181,253,0.45)"/><text x="${x + w / 2}" y="${y + 26}" text-anchor="middle" font-family="Poppins, Segoe UI, sans-serif" font-size="18" font-weight="600" fill="#e9d5ff">${esc(label)}</text></g>`,
  };
};

async function homeCard() {
  const size = 300;
  const circle = Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`);
  const portrait = await sharp(join(pub, 'profile2.webp'))
    .resize(size, size, { fit: 'cover', position: 'top' })
    .composite([{ input: circle, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const labels = ['Co-Founder, LM Smart Solutions', '3rd Place, Agents at Work', 'NASA Space Apps 2026'];
  let cx = 80;
  const chips = labels
    .map((label, i) => {
      const c = chip(cx, 470 + (i > 1 ? 0 : 0), label);
      cx += c.w + 12;
      return c.svg;
    })
    .join('');

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  ${base}
  ${butterfly(80, 80, 0.55, { opacity: 0.9, rotate: -10 })}
  <text x="80" y="230" font-family="Poppins, Segoe UI, sans-serif" font-size="76" font-weight="800" fill="#ffffff">Laila <tspan fill="#a78bfa">Mohamed</tspan></text>
  <text x="80" y="292" font-family="Poppins, Segoe UI, sans-serif" font-size="32" font-weight="600" fill="#e9d5ff">Software Engineer · Full-Stack &amp; Systems</text>
  <text x="80" y="352" font-family="Inter, Segoe UI, sans-serif" font-size="26" fill="#a1a1b5">Enterprise IoT platforms · Real-time systems · AI agents</text>
  <text x="80" y="416" font-family="Inter, Segoe UI, sans-serif" font-size="22" font-weight="600" fill="#8b8ba3">Open to remote work</text>
  ${chips}
  <text x="80" y="588" font-family="Inter, Segoe UI, sans-serif" font-size="22" font-weight="600" fill="#6b6b85">${DOMAIN}</text>
  <circle cx="930" cy="300" r="166" fill="none" stroke="#a78bfa" stroke-width="3" opacity="0.8"/>
  <circle cx="930" cy="300" r="182" fill="none" stroke="rgba(196,181,253,0.2)" stroke-width="1.5" stroke-dasharray="6 8"/>
  ${butterfly(1030, 110, 0.9, { opacity: 0.95, rotate: 14 })}
  ${butterfly(640, 70, 0.5, { opacity: 0.6, rotate: -18 })}
</svg>`;
  await out(svg, [{ input: portrait, top: 300 - size / 2, left: 930 - size / 2 }], join(pub, 'og-card.png'));
}

async function loadProjects() {
  const tmp = join(root, 'scripts', '.projects-tmp.mjs');
  await build({
    stdin: {
      contents: `export { projects } from '${join(root, 'src/data/projects.ts').replace(/\\/g, '/')}';`,
      resolveDir: root,
      loader: 'ts',
    },
    outfile: tmp,
    bundle: true,
    format: 'esm',
    platform: 'node',
    logLevel: 'silent',
  });
  const mod = await import(`file://${tmp}?t=${Date.now()}`);
  await rm(tmp, { force: true });
  return mod.projects;
}

async function projectCard(project) {
  const [name, ...rest] = project.title.split(' – ');
  const subtitle = rest.join(' – ');
  const titleLines = wrap(name, 16, 2);
  const taglineLines = wrap(project.tagline || project.description, 40, 4);
  const titleSize = titleLines.length > 1 ? 58 : 68;

  let y = 190;
  const titleSvg = titleLines
    .map((l, i) => `<text x="80" y="${y + i * (titleSize + 6)}" font-family="Poppins, Segoe UI, sans-serif" font-size="${titleSize}" font-weight="800" fill="#ffffff">${esc(l)}</text>`)
    .join('');
  y += titleLines.length * (titleSize + 6);
  const subSvg = subtitle
    ? `<text x="80" y="${y - 4}" font-family="Poppins, Segoe UI, sans-serif" font-size="26" font-weight="600" fill="#a78bfa">${esc(wrap(subtitle, 34, 1)[0])}</text>`
    : '';
  y += subtitle ? 36 : 10;
  const tagSvg = taglineLines
    .map((l, i) => `<text x="80" y="${y + i * 34}" font-family="Inter, Segoe UI, sans-serif" font-size="25" fill="#b4b4c8">${esc(l)}</text>`)
    .join('');

  let cx = 80;
  const chipY = 500;
  const chips = (project.tech || [])
    .slice(0, 4)
    .map((t) => {
      const c = chip(cx, chipY, t);
      cx += c.w + 10;
      return cx > 640 ? '' : c.svg;
    })
    .join('');

  // Local covers go in a framed panel; remote ones (hot-linked thumbnails) are
  // not downloaded here, so those cards use the butterfly mark instead.
  const localCover = project.image && project.image.startsWith('/') ? join(pub, project.image) : null;
  let panel = { x: 700, y: 95, w: 420, h: 440 };
  const composites = [];
  let panelSvg = '';
  if (localCover) {
    // Wide banners keep their whole frame (letterboxed on the night colour);
    // other covers fill the panel.
    const meta = await sharp(localCover).metadata();
    const wide = meta.width / meta.height > 1.4;
    if (wide) panel = { x: 650, y: 175, w: 490, h: 276 };
    const mask = Buffer.from(`<svg width="${panel.w}" height="${panel.h}"><rect width="${panel.w}" height="${panel.h}" rx="28" fill="#fff"/></svg>`);
    const img = await sharp(localCover)
      .resize(panel.w, panel.h, wide
        ? { fit: 'contain', background: { r: 14, g: 13, b: 22, alpha: 1 } }
        : { fit: 'cover', position: project.imagePosition?.includes('left') ? 'left' : 'centre' })
      .composite([{ input: mask, blend: 'dest-in' }])
      .png()
      .toBuffer();
    composites.push({ input: img, top: panel.y, left: panel.x });
    panelSvg = `<rect x="${panel.x}" y="${panel.y}" width="${panel.w}" height="${panel.h}" rx="28" fill="none" stroke="rgba(196,181,253,0.55)" stroke-width="2.5"/>`;
  } else {
    panelSvg = `<rect x="${panel.x}" y="${panel.y}" width="${panel.w}" height="${panel.h}" rx="28" fill="rgba(196,181,253,0.06)" stroke="rgba(196,181,253,0.45)" stroke-width="2.5"/>
      ${butterfly(panel.x + 70, panel.y + 120, 2.8, { opacity: 0.9, rotate: -8 })}`;
  }

  const badge = project.status
    ? `<g><rect x="80" y="76" width="${project.status.length * 13 + 40}" height="40" rx="20" fill="#6d28d9"/><text x="${80 + (project.status.length * 13 + 40) / 2}" y="102" text-anchor="middle" font-family="Poppins, Segoe UI, sans-serif" font-size="18" font-weight="700" fill="#fff">${esc(project.status.toUpperCase())}</text></g>`
    : `<text x="80" y="104" font-family="Poppins, Segoe UI, sans-serif" font-size="18" font-weight="700" letter-spacing="4" fill="#a78bfa">PROJECT</text>`;

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  ${base}
  ${badge}
  ${titleSvg}
  ${subSvg}
  ${tagSvg}
  ${chips}
  <text x="80" y="590" font-family="Inter, Segoe UI, sans-serif" font-size="21" font-weight="600" fill="#6b6b85">Laila Mohamed Fikry · ${DOMAIN}</text>
  ${panelSvg}
  ${butterfly(1085, 50, 0.6, { opacity: 0.85, rotate: 16 })}
</svg>`;
  await out(svg, composites, join(pub, 'og', `${project.slug}.png`));
}

await mkdir(join(pub, 'og'), { recursive: true });
await homeCard();
for (const project of await loadProjects()) {
  await projectCard(project);
}
