import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) await walk(p);
    else if (p.endsWith('.html')) files.push(p);
  }
}
await walk('dist');
const titles = new Set();
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert(title && !titles.has(title), `Missing or duplicate title: ${file}`);
  titles.add(title);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `One H1 required: ${file}`);
  assert.match(html, /<meta name="description" content="[^"]+"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/www.chartsai.com\/[^"?]*"/);
  for (const match of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs))
    assert(JSON.parse(match[1])['@graph'].length >= 3);
  for (const [, href] of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
    if (href.startsWith('//')) continue;
    const target = join('dist', decodeURIComponent(href), href.endsWith('/') ? 'index.html' : '');
    try {
      await stat(target);
    } catch {
      throw new Error(`Broken local resource in ${file}: ${href}`);
    }
  }
}
const sitemap = await readFile('dist/sitemap-0.xml', 'utf8');
assert(!sitemap.includes('/404'));
for (const route of [
  'line-graph-maker/',
  'dot-plot-maker/',
  'radar-chart-maker/',
  'printables/habit-tracker/',
])
  assert(sitemap.includes(route));
console.log(
  `Checked ${files.length} static pages: unique titles, headings, descriptions, canonicals, schema, local resources and tool sitemap entries.`,
);

const showcaseAssets = (await readdir('dist/examples/assets')).filter((name) => name.endsWith('.svg'));
assert.equal(showcaseAssets.length, 20, 'The curated release contains 20 example charts');
const gallery = await readFile('dist/examples/index.html', 'utf8');
for (const file of showcaseAssets) {
  const slug = file.slice(0, -4),
    route = `/examples/${slug}/`,
    url = `https://www.chartsai.com${route}`;
  const html = await readFile(`dist${route}index.html`, 'utf8');
  assert(html.includes(`rel="canonical" href="${url}"`), `Example canonical: ${slug}`);
  assert(sitemap.includes(url), `Example sitemap: ${slug}`);
  assert(gallery.includes(`href="${route}"`), `Example discoverable from library: ${slug}`);
  assert(html.includes(`?showcase=${slug}#editor`), `Exact editor handoff: ${slug}`);
  assert(html.includes('id="data"') && html.includes('<table>'), `Accessible data: ${slug}`);
  const graph = JSON.parse(html.match(/type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)[1])['@graph'];
  assert(
    graph.some((item) => item['@type'] === 'Dataset' && item.distribution.contentUrl.endsWith(`${slug}.csv`)),
    `Dataset schema: ${slug}`,
  );
  assert(
    graph.some((item) => item['@type'] === 'Article'),
    `Article schema: ${slug}`,
  );
  for (const format of ['svg', 'png', 'csv', 'json'])
    assert(html.includes(`/examples/assets/${slug}.${format}`), `Download ${format}: ${slug}`);
  assert(
    html.includes(`property="og:image" content="https://www.chartsai.com/examples/assets/${slug}.png"`),
    `Original social chart: ${slug}`,
  );
}
for (const slug of ['line-graphs', 'dot-plots', 'radar-charts'])
  assert(sitemap.includes(`/examples/${slug}/`));
console.log(
  'Checked all 20 example resources: original assets, exact editor links, dataset schema, accessible tables, social images and sitemap membership.',
);
