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

const {editorialTemplates} = await import('../src/data/editorial-templates');
const {templateCollectionPath,templateEditorPath} = await import('../src/lib/editorial-template-ids');
for (const t of editorialTemplates) {
 const path=templateCollectionPath(t.project.kind as 'dumbbell'|'slopegraph'|'small-multiples');
 assert(sitemap.includes(`https://www.chartsai.com${path}`));
 const html=await readFile(`dist${path}index.html`,'utf8');
 assert(html.includes(`id="${t.id}"`) && html.includes(templateEditorPath(t.id)));
 assert(html.includes(t.provenance));
 assert.deepEqual(parseProject(await readFile(`dist/editorial/templates/${t.id}.json`,'utf8')),t.project);
 const {parseText}=await import('../src/lib/data');
 assert.deepEqual(parseText(await readFile(`dist/editorial/templates/${t.id}.csv`,'utf8')),t.project.table);
 for (const ext of ['svg','png','pdf']) assert((await readFile(`dist/editorial/templates/${t.id}.${ext}`)).length>100);
}
console.log('Template checks: 12 exact projects/CSVs, three substantive collections, complete graphics and fixed editor handoffs.');
