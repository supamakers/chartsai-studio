import {editorialKinds,editorialOption,publicationFrames,publicationHtml} from '../src/lib/editorial.ts';
import {editorialExample} from '../src/data/editorial-examples.ts';
import { packIds, initialWorksheet, worksheetPages, worksheetCsv } from '../src/lib/number-line-worksheets.ts';
import { buildMath, defaults, mathKinds, mathWorksheetSvg, mathCsv } from '../src/lib/math-tools.ts';
import { coordinateExamples, defaultPlane, parsePoints, planeSvg, pointsCsv, worksheetSvg } from '../src/lib/coordinate-plane.ts';
import { jsPDF } from 'jspdf';
import {datasets,datasetSpec} from '../src/data/datasets.ts';
import {parseText} from '../src/lib/data.ts';
import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { zipSync } from 'fflate';
import { dotPresets, radarPresets, linePresets } from '../src/lib/presets.ts';
import { showcaseSpecs, showcaseTable } from '../src/lib/showcase-specs.ts';
import { chartFrames, chartThemes, createChartOption } from '../src/lib/chart-options.ts';
import { dotExample, radarExample } from '../src/lib/chart-presets.ts';
import { statPresets } from '../src/lib/stat-presets.ts';
import { statOption } from '../src/lib/statistics.ts';
import { renderOptionSvg, renderChartSvg } from '../src/lib/echarts.ts';

// Homepage previews use the same native ECharts renderer without loading its runtime.
await mkdir('public/previews', { recursive: true });
for (const [kind, spec] of Object.entries({ radar: radarExample('products'), dot: dotExample('scores') })) {
  for (const theme of Object.keys(chartThemes)) {
    await writeFile(`public/previews/${kind}-${theme}.svg`, renderChartSvg({ ...spec, theme }));
  }
}
await mkdir('public/samples', { recursive: true });
await mkdir('public/downloads', { recursive: true });
const csv = (rows) =>
  rows.map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\r\n');
for (const p of dotPresets)
  await writeFile(`public/samples/dot-${p.id}.csv`, csv([[p.label], ...p.values.map((v) => [v])]));
for (const p of radarPresets)
  await writeFile(
    `public/samples/radar-${p.id}.csv`,
    csv([['Dimension', ...p.series], ...p.axes.map((a, i) => [a, ...p.scores[i]])]),
  );
for (const p of linePresets)
  await writeFile(
    `public/samples/line-${p.id}.csv`,
    csv([[p.xLabel, ...p.series], ...p.labels.map((label, i) => [label, ...p.values[i]])]),
  );
await mkdir('public/examples/assets', { recursive: true });
for (const [slug, spec] of Object.entries(showcaseSpecs)) {
  const { width, height } = chartFrames[spec.frame];
  const svg = renderChartSvg(spec, width, height);
  const path = `public/examples/assets/${slug}`;
  await writeFile(`${path}.svg`, svg);
  await sharp(Buffer.from(svg)).png().toFile(`${path}.png`);
  await writeFile(`${path}.csv`, csv(showcaseTable(spec)));
  await writeFile(`${path}.json`, JSON.stringify(createChartOption(spec, width, height), null, 2));
}
await mkdir('public/charts/assets', { recursive: true });
for (const [id,spec] of Object.entries(statPresets)) {
 const {width,height}=chartFrames[spec.frame];
 const option=statOption(spec,width,height),svg=renderOptionSvg(option,width,height),path=`public/charts/assets/${id}`;
 await writeFile(`${path}.svg`,svg);
 await sharp(Buffer.from(svg)).png().toFile(`${path}.png`);
 await writeFile(`${path}.csv`,csv(spec.table));
 await writeFile(`${path}.json`,JSON.stringify(option,null,2));
}
for(const d of datasets){
 const table=parseText(await readFile(`public/datasets/assets/${d.id}-chart.csv`,'utf8'));
 const spec=datasetSpec(d.id,table),option=statOption(spec),svg=renderOptionSvg(option);
 const path=`public/datasets/assets/${d.id}`;
 await writeFile(`${path}.svg`,svg);await sharp(Buffer.from(svg)).png().toFile(`${path}.png`);
 await writeFile(`${path}.json`,JSON.stringify(option,null,2));
 await writeFile(`${path}-manifest.json`,JSON.stringify(d,null,2));
}
const chart = renderChartSvg({ ...radarExample('products'), theme: 'night' }, 570, 430);
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f8f9f6"/><rect x="54" y="54" width="36" height="36" rx="10" fill="#202522"/><path d="M64 80v-9m8 9V63m8 17V68" stroke="#d3ed9c" stroke-width="3" stroke-linecap="round"/><text x="103" y="82" font-family="Arial" font-size="28" font-weight="700" fill="#202522">chartsai.</text><text x="54" y="232" font-family="Arial" font-size="66" font-weight="700" fill="#202522">Your data.</text><text x="54" y="313" font-family="Arial" font-size="66" font-weight="700" fill="#202522">Ready to</text><rect x="54" y="381" width="211" height="16" fill="#d3ed9c"/><text x="54" y="394" font-family="Arial" font-size="66" font-weight="700" fill="#202522">share.</text><text x="57" y="461" font-family="Arial" font-size="19" fill="#606961">Free chart makers &amp; printables.</text><text x="57" y="552" font-family="Arial" font-size="15" fill="#606961">Built by SupaMakers · No signup or watermark</text></svg>`;
await sharp(Buffer.from(og))
  .composite([{ input: Buffer.from(chart), left: 582, top: 108 }])
  .png()
  .toFile('public/og.png');

// Coordinate assets share the exact grid and worksheet renderer with the editor.
await mkdir('public/coordinate/assets', { recursive: true });
const cp = parsePoints(coordinateExamples.quadrants.raw);
const cpSvg = planeSvg(defaultPlane, cp, true);
await writeFile('public/coordinate/assets/quadrants.svg', cpSvg);
await sharp(Buffer.from(cpSvg)).png().toFile('public/coordinate/assets/quadrants.png');
await writeFile('public/coordinate/assets/quadrants.csv', pointsCsv(cp));
for (const paper of ['a4', 'letter']) {
  for (const name of ['four-quadrants', 'first-quadrant', 'triangle']) {
    const triangle = name === 'triangle';
    const plane = name === 'four-quadrants' ? defaultPlane : { ...defaultPlane, xmin: 0, ymin: 0, connect: triangle };
    const points = triangle ? parsePoints(coordinateExamples.triangle.raw) : [];
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: paper, compress: true });
    for (const [i, answer] of (triangle ? [false, true] : [false]).entries()) {
      if (i) doc.addPage();
      const markup = worksheetSvg(plane, points, triangle ? 'plot' : 'blank', paper, triangle ? 'Plot a triangle' : 'Coordinate plane', answer);
      const png = await sharp(Buffer.from(markup)).resize({ width: 2400 }).png().toBuffer();
      doc.addImage(png, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
    }
    doc.setProperties({ title: 'Coordinate plane', creator: 'ChartsAI by SupaMakers' });
    await writeFile(`public/coordinate/assets/${name}-${paper}.pdf`, Buffer.from(doc.output('arraybuffer')));
  }
}

await mkdir('public/math/assets', {recursive:true});
for (const kind of mathKinds) {
  const result=buildMath(kind,defaults[kind],renderOptionSvg);
  await writeFile(`public/math/assets/${kind}.svg`,result.svg);
  await sharp(Buffer.from(result.svg)).png().toFile(`public/math/assets/${kind}.png`);
  await writeFile(`public/math/assets/${kind}.csv`,mathCsv(result));
  for(const paper of ['a4','letter']) {
    const doc=new jsPDF({orientation:'portrait',unit:'mm',format:paper,compress:true});
    for(const [n,answer] of [false,true].entries()) {
      if(n)doc.addPage();
      const svg=mathWorksheetSvg(result,paper,answer);
      const png=await sharp(Buffer.from(svg)).resize({width:2400}).png().toBuffer();
      doc.addImage(png,'PNG',0,0,doc.internal.pageSize.getWidth(),doc.internal.pageSize.getHeight());
    }
    doc.setProperties({title:result.title,creator:'ChartsAI by SupaMakers'});
    await writeFile(`public/math/assets/${kind}-${paper}.pdf`,Buffer.from(doc.output('arraybuffer')));
  }
}

await mkdir('public/worksheets/assets', {recursive:true});
for (const pack of packIds) {
  const settings={...initialWorksheet,pack};
  await writeFile(`public/worksheets/assets/${pack}.svg`,worksheetPages(settings,'a4',false)[0].svg);
  await writeFile(`public/worksheets/assets/${pack}.csv`,worksheetCsv(settings));
  for(const paper of ['a4','letter']) {
    const doc=new jsPDF({orientation:'portrait',unit:'mm',format:paper,compress:true});
    for(const [index,page] of worksheetPages(settings,paper,true).entries()) {
      if(index) doc.addPage();
      const png=await sharp(Buffer.from(page.svg)).resize({width:2400}).png().toBuffer();
      doc.addImage(png,'PNG',0,0,doc.internal.pageSize.getWidth(),doc.internal.pageSize.getHeight());
    }
    doc.setProperties({title:`Number line worksheets: ${pack}`,creator:'ChartsAI by SupaMakers'});
    await writeFile(`public/worksheets/assets/${pack}-${paper}.pdf`,Buffer.from(doc.output('arraybuffer')));
  }
}

await mkdir('public/editorial/assets',{recursive:true});
for(const kind of editorialKinds){
  const project=editorialExample(kind),{width,height}=publicationFrames[project.frame];
  const svg=renderOptionSvg(editorialOption(project,width,height),width,height),path=`public/editorial/assets/${kind}`;
  await writeFile(`${path}.svg`,svg);
  const png=await sharp(Buffer.from(svg)).png().toBuffer();await writeFile(`${path}.png`,png);
  await writeFile(`${path}.csv`,csv(project.table));
  await writeFile(`${path}.json`,JSON.stringify(project,null,2));
  await writeFile(`${path}.html`,publicationHtml(project,svg));
  const doc=new jsPDF({orientation:width>=height?'landscape':'portrait',unit:'pt',format:[width*.75,height*.75],compress:true});
  doc.addImage(png,'PNG',0,0,width*.75,height*.75);doc.setProperties({title:project.title,creator:'ChartsAI by SupaMakers'});
  await writeFile(`${path}.pdf`,Buffer.from(doc.output('arraybuffer')));
}

// Explicit allowlist: research notes, environment files and build artifacts never enter the public source archive.
const archive = {};
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (path === 'public/editorial/assets' || path === 'public/worksheets/assets' || path === 'public/math/assets' || path === 'public/coordinate/assets' || path === 'public/previews' || path === 'public/downloads' || path === 'public/examples/assets' || path === 'public/charts/assets') continue;
    if (directory === 'public/datasets/assets' && /\.(svg|png|json)$/.test(path)) continue;
    if (entry.isDirectory()) await collect(path);
    else if (entry.isFile()) archive[`chartsai/${path}`] = new Uint8Array(await readFile(path));
  }
}
for (const directory of ['src', 'public', 'scripts', 'tests', 'docs', '.github/workflows', '.agents/skills/chartsai-chart-quality']) await collect(directory);
for (const path of [
  'README.md',
  'PRODUCT.md',
  'DESIGN.md',
  '.prettierrc.json',
  'AGENTS.md',
  'AGENT.md',
  'LICENSE',
  'THIRD_PARTY_NOTICES.md',
  'package.json',
  'package-lock.json',
  'astro.config.mjs',
  'vercel.json',
  '.vercelignore',
  'tsconfig.json',
  'playwright.config.ts',
  'vitest.config.ts',
  '.gitignore',
]) {
  // Vercel CLI omits .gitignore from source uploads. The downloadable checkout
  // still needs a safe, portable ignore file; all actual source files are required.
  const contents = await readFile(path).catch((error) => {
    if (path !== '.gitignore' || error.code !== 'ENOENT') throw error;
    return Buffer.from(
      'node_modules/\ndist/\n.astro/\n.env\n.env.*\n.vercel/\nartifacts/\npublic/downloads/\n',
    );
  });
  archive[`chartsai/${path}`] = new Uint8Array(contents);
}
await writeFile('public/downloads/chartsai-source.zip', zipSync(archive, { level: 6 }));
console.log(
  `Prepared 9 presets, 50 showcase and 5 public-dataset asset sets, social image and source archive (${Object.keys(archive).length} files).`,
);
