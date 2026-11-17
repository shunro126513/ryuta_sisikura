// 静的HTML生成(SSG)。dist/ にルートごとの index.html を書き出し、検索・共有(OG)に対応する。
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const root = path.resolve('.');
const dist = path.join(root, 'dist');
const { render, routeHead, allRoutes } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href);
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const SITE = (process.env.SITE_URL || process.env.VITE_SITE_URL || '').replace(/\/$/, '');
const BASE = (process.env.BASE_PATH || '/');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const abs = (p) => (SITE ? SITE : '') + p;
const ogImage = abs(BASE + 'og.jpg');

function tags(h, extra = '') {
  const url = abs(BASE.replace(/\/$/, '') + h.path);
  return [
    `<title>${esc(h.title)}</title>`,
    `<meta name="description" content="${esc(h.description)}" />`,
    h.noindex ? '<meta name="robots" content="noindex" />' : '',
    SITE && !h.noindex ? `<link rel="canonical" href="${url}" />` : '',
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="ja_JP" />`,
    `<meta property="og:title" content="${esc(h.title)}" />`,
    `<meta property="og:description" content="${esc(h.description)}" />`,
    SITE ? `<meta property="og:url" content="${url}" />` : '',
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    extra,
  ].filter(Boolean).join('\n    ');
}
function write(file, html) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, html); }
const routes = allRoutes();
for (const r of routes) {
  const app = render(BASE.replace(/\/$/, '') + r);
  const h = routeHead(r);
  const html = template.replace('<!--head-tags-->', tags(h)).replace('<!--app-html-->', app);
  write(path.join(dist, r === '/' ? 'index.html' : r.slice(1), r === '/' ? '' : 'index.html'), html);
}
// 404
const nf = routeHead('/__404__');
write(path.join(dist, '404.html'), template.replace('<!--head-tags-->', tags(nf)).replace('<!--app-html-->', render(BASE.replace(/\/$/, '') + '/__404__')));
// robots / sitemap
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n${SITE ? `Sitemap: ${SITE}${BASE}sitemap.xml\n` : ''}`);
if (SITE) fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${SITE}${BASE.replace(/\/$/, '')}${r}</loc></url>`).join('\n')}\n</urlset>\n`);
// 静的ファイル: public/ からは画像以外をコピー、画像はリンク(ディスク節約)
for (const f of fs.readdirSync(path.join(root, 'public'))) {
  const src = path.join(root, 'public', f), dst = path.join(dist, f);
  if (fs.existsSync(dst)) fs.rmSync(dst, { recursive: true, force: true });
  if (f === 'images') fs.symlinkSync(src, dst); else fs.cpSync(src, dst, { recursive: true });
}
console.log(`prerendered ${routes.length} pages + 404`);
