/**
 * Per-route social metadata for a client-rendered SPA.
 *
 * WHY THIS EXISTS
 * Social crawlers (LinkedIn, Facebook, Slack, WhatsApp, X) do not execute
 * JavaScript. They fetch the URL, read the <head>, and stop. Because Vercel
 * rewrites every path to the single index.html, sharing /projects/riselist
 * produced the *homepage* card: same title, same description, same image as
 * every other page on the site. Every shared link looked identical and generic.
 *
 * React Helmet and friends do not fix this — they mutate the DOM after the
 * bundle runs, which is exactly the thing a crawler never does.
 *
 * WHAT THIS DOES
 * After `vite build`, it writes one real HTML file per route — dist/projects/
 * riselist/index.html and so on — each a copy of the built index.html with its
 * own title, description, canonical, Open Graph and Twitter tags. Vercel serves
 * a matching static file before it applies the catch-all rewrite, so crawlers
 * get correct metadata and humans still get the same SPA (the bundle boots and
 * the router takes over from the current URL, as before).
 *
 * The route list is derived from the same data the app renders, so a new project
 * or post is covered automatically. Nothing here invents copy: titles and
 * descriptions come from `projects.ts` / `posts.ts`.
 */

import { build } from 'esbuild';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://my-portfolio-mm2c.vercel.app';
const AUTHOR = 'Laila Mohamed Fikry';
const DEFAULT_IMAGE = '/og-card.png';

/**
 * The data modules are TypeScript, so they cannot be imported directly here.
 * Bundle them to a temporary ESM file and import that. Reading the real modules
 * rather than re-declaring the routes is the point: a new project or post must
 * not be able to ship without its metadata.
 */
async function loadSiteData() {
  const tmp = path.join(DIST, '.meta-data.mjs');
  await build({
    stdin: {
      contents: `
        export { projects } from '${path.join(ROOT, 'src/data/projects.ts').replace(/\\/g, '/')}';
        export { posts } from '${path.join(ROOT, 'src/data/posts.ts').replace(/\\/g, '/')}';
      `,
      resolveDir: ROOT,
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
  return { projects: mod.projects, posts: mod.posts };
}

/** Collapse whitespace and clip to a length social cards will not truncate oddly. */
const clean = (text, max = 200) => {
  const flat = String(text).replace(/\s+/g, ' ').trim();
  if (flat.length <= max) return flat;
  return `${flat.slice(0, max - 1).replace(/[\s,;:.]+\S*$/, '')}…`;
};

const escapeAttr = (text) =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Absolute URLs only — a relative og:image is ignored by most crawlers. */
const absolute = (src) => (/^https?:\/\//i.test(src) ? src : `${SITE}${src.startsWith('/') ? src : `/${src}`}`);

function buildRoutes({ projects, posts }) {
  const routes = [
    {
      route: '/writing',
      title: `Writing | ${AUTHOR}`,
      description:
        'Engineering notes on real-time architecture, computer vision evaluation, industrial monitoring, and the trade-offs behind systems I have built.',
      image: DEFAULT_IMAGE,
      type: 'website',
    },
    {
      route: '/case-study/lm-ms',
      title: `Case Study — LM-MS Power Monitoring | ${AUTHOR}`,
      description:
        'How LM-MS is architected: a monitoring platform for distributed solar, rectifier, inverter and generator power sites — separating acquisition from presentation, a device-agnostic measurement model, and the trade-offs behind each decision.',
      image: DEFAULT_IMAGE,
      type: 'article',
    },
  ];

  for (const project of projects) {
    routes.push({
      route: `/projects/${project.slug}`,
      title: `${project.title} | ${AUTHOR}`,
      description: clean(project.tagline || project.description),
      // A project's own cover is what makes its card recognisable in a feed.
      image: project.image || DEFAULT_IMAGE,
      type: 'article',
    });
  }

  for (const post of posts) {
    routes.push({
      route: `/writing/${post.slug}`,
      title: `${post.title} | ${AUTHOR}`,
      description: clean(post.excerpt),
      image: DEFAULT_IMAGE,
      type: 'article',
      published: post.date,
    });
  }

  return routes;
}

/**
 * Replace the head tags rather than appending duplicates: two og:title tags is
 * undefined behaviour, and crawlers disagree about which one wins.
 */
function applyMeta(html, meta) {
  const url = `${SITE}${meta.route}`;
  const image = absolute(meta.image);
  const title = escapeAttr(meta.title);
  const description = escapeAttr(meta.description);

  let out = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${description}" />`
    )
    .replace(
      /<link rel="canonical" href="[^"]*"\s*\/?>/,
      `<link rel="canonical" href="${url}" />`
    );

  const swap = (property, value) => {
    const attr = property.startsWith('og:') ? 'property' : 'name';
    const pattern = new RegExp(`<meta ${attr}="${property}" content="[^"]*"\\s*/?>`);
    const tag = `<meta ${attr}="${property}" content="${value}" />`;
    out = pattern.test(out) ? out.replace(pattern, tag) : out.replace('</head>', `    ${tag}\n  </head>`);
  };

  swap('og:url', url);
  swap('og:title', title);
  swap('og:description', description);
  swap('og:image', image);
  swap('og:type', meta.type);
  swap('twitter:url', url);
  swap('twitter:title', title);
  swap('twitter:description', description);
  swap('twitter:image', image);

  if (meta.published) {
    out = out.replace(
      '</head>',
      `    <meta property="article:published_time" content="${meta.published}" />\n  </head>`
    );
  }

  return out;
}

async function main() {
  const shell = await readFile(path.join(DIST, 'index.html'), 'utf8');
  const data = await loadSiteData();
  const routes = buildRoutes(data);

  for (const meta of routes) {
    const dir = path.join(DIST, meta.route);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), applyMeta(shell, meta), 'utf8');
  }

  console.log(`prerender-meta: wrote ${routes.length} route files with per-page social metadata`);
}

main().catch((error) => {
  // Fail the build loudly. Silently shipping without this means every shared
  // link falls back to the homepage card, which is the bug this script fixes.
  console.error('prerender-meta failed:', error);
  process.exit(1);
});
