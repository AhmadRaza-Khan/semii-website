// Copies the framework's docs, changelog and logo into the site.
//
//   npm run sync            (expects the framework checkout one level up)
//   FRAMEWORK=../semii npm run sync
//
// The copies are committed in this repo, because Vercel builds the site
// without the framework checkout. Re-run after the docs change.
import { mkdir, readFile, readdir, rm, writeFile, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.env.FRAMEWORK ?? '..');
const repo = 'https://github.com/AhmadRaza-Khan/semii';
const out = path.resolve('src/content/docs');

if (!existsSync(path.join(root, 'docs', 'README.md'))) {
  console.error(`No framework docs at ${root}/docs. Set FRAMEWORK=/path/to/semii.`);
  process.exit(1);
}

// Order and grouping of the sidebar.
const pages = [
  { src: 'docs/README.md', slug: 'index', section: 'Guides', order: 0, title: 'Overview' },
  { src: 'docs/getting-started.md', slug: 'getting-started', section: 'Guides', order: 1 },
  { src: 'docs/cli.md', slug: 'cli', section: 'Guides', order: 2 },
  { src: 'docs/deployment.md', slug: 'deployment', section: 'Guides', order: 3 },
  ...['web', 'auth', 'config', 'validate', 'db', 'server', 'logx', 'testkit', 'banner'].map((p, i) => ({
    src: `docs/packages/${p}.md`, slug: `packages/${p}`, section: 'Packages', order: 10 + i,
  })),
];

// Turn a link inside docs/<from> into a site URL or a GitHub URL.
function rewriteLink(href, from) {
  if (/^([a-z]+:|#|\/)/i.test(href)) return href;
  const [file, hash = ''] = href.split('#');
  const anchor = hash ? `#${hash}` : '';
  const target = path.posix.normalize(path.posix.join(path.posix.dirname(from), file));
  const page = pages.find((p) => p.src === target);
  if (page) return (page.slug === 'index' ? '/docs' : `/docs/${page.slug}`) + anchor;
  if (target === 'CHANGELOG.md') return '/changelog' + anchor;
  return `${repo}/blob/main/${target}${anchor}`;
}

function firstParagraph(body) {
  const para = body.split(/\n\s*\n/).find((b) => b.trim() && !/^(#|```|\||-|\*|>|<)/.test(b.trim()));
  return (para ?? '').replace(/\s+/g, ' ').replace(/[`*_]|\[([^\]]+)\]\([^)]+\)/g, '$1').trim().slice(0, 158);
}

const yaml = (s) => JSON.stringify(s);

await rm(out, { recursive: true, force: true });
for (const p of pages) {
  const raw = await readFile(path.join(root, p.src), 'utf8');
  const h1 = raw.match(/^# (.+)$/m);
  const body = raw
    .replace(/^# .+\n+/m, '')
    .replace(/\]\(([^)\s]+)\)/g, (_, href) => `](${rewriteLink(href, p.src)})`);
  const title = p.title ?? (h1 ? h1[1].replace(/`/g, '') : p.slug);
  const description = firstParagraph(body) || `${title} in semii, the scaffolding framework for Go APIs.`;
  const file = path.join(out, `${p.slug}.md`);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `---\ntitle: ${yaml(title)}\ndescription: ${yaml(description)}\nsection: ${yaml(p.section)}\norder: ${p.order}\nsource: ${yaml(p.src)}\n---\n\n${body.trim()}\n`);
}

// Changelog, without its H1 (the page renders its own).
const changelog = (await readFile(path.join(root, 'CHANGELOG.md'), 'utf8')).replace(/^# .+\n+/m, '');
await mkdir('src/data', { recursive: true });
await writeFile('src/data/changelog.md', changelog);

// Logo files.
for (const f of ['logo.png', 'icon.png', 'social-preview.png']) {
  await copyFile(path.join(root, 'docs/assets', f), path.join('public', f));
}

console.log(`synced ${pages.length} docs pages, the changelog and the logo from ${root}`);
