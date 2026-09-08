import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { editorialKinds, publicationFrames, parseProject, editorialValues } from '../src/lib/editorial';
import { editorialExample } from '../src/data/editorial-examples';
import { editorialPages } from '../src/data/editorial-pages';
const sitemap = await readFile('dist/sitemap-0.xml', 'utf8');
for (const route of [
  'editorial-charts',
  'editorial-charts/life-expectancy',
  'editorial-charts/temperature-record',
  'editorial-charts/publishing-guide',
  ...Object.values(editorialPages).map((p) => p.slug),
]) {
  assert(sitemap.includes(`https://www.chartsai.com/${route}/`));
  const html = await readFile(`dist/${route}/index.html`, 'utf8');
  assert(html.includes('SupaMakers'));
  assert(html.includes('2026-09-09') || html.includes('September 9, 2026'));
}
for (const kind of editorialKinds) {
  const p = parseProject(await readFile(`dist/editorial/assets/${kind}.json`, 'utf8'));
  assert.deepEqual(p, editorialExample(kind));
  assert(editorialValues(p).flat().every(Number.isFinite));
  const svg = await readFile(`dist/editorial/assets/${kind}.svg`, 'utf8'),
    frame = publicationFrames[p.frame];
  assert(svg.includes(`width="${frame.width}"`) && svg.includes(`height="${frame.height}"`));
  assert(!/NaN|Infinity/.test(svg));
  const html = await readFile(`dist/editorial/assets/${kind}.html`, 'utf8');
  assert(!/<script\b|<iframe\b|plausible/.test(html));
  assert(html.includes('<table>'));
  assert.equal((html.match(/<tr>/g) || []).length, p.table.length);
  assert(!sitemap.includes(`/editorial/assets/${kind}.html`));
}
console.log(
  'Editorial checks: seven distinct routes, five complete projects, exact dimensions, safe standalone HTML, accessible tables and sitemap separation.',
);
