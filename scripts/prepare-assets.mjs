import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { zipSync } from 'fflate';
import { dotPresets, radarPresets, linePresets } from '../src/lib/presets.ts';
import { showcaseSpecs, showcaseTable } from '../src/lib/showcase-specs.ts';
import { chartFrames, createChartOption } from '../src/lib/chart-options.ts';
import { radarExample } from '../src/lib/chart-presets.ts';
import { renderChartSvg } from '../src/lib/echarts.ts';

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
const chart = renderChartSvg({ ...radarExample('products'), theme: 'night' }, 570, 430);
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f8f9f6"/><rect x="54" y="54" width="36" height="36" rx="10" fill="#202522"/><path d="M64 80v-9m8 9V63m8 17V68" stroke="#d3ed9c" stroke-width="3" stroke-linecap="round"/><text x="103" y="82" font-family="Arial" font-size="28" font-weight="700" fill="#202522">chartsai.</text><text x="54" y="232" font-family="Arial" font-size="66" font-weight="700" fill="#202522">Your data.</text><text x="54" y="313" font-family="Arial" font-size="66" font-weight="700" fill="#202522">Ready to</text><rect x="54" y="381" width="211" height="16" fill="#d3ed9c"/><text x="54" y="394" font-family="Arial" font-size="66" font-weight="700" fill="#202522">share.</text><text x="57" y="461" font-family="Arial" font-size="19" fill="#606961">Free chart makers &amp; printables.</text><text x="57" y="552" font-family="Arial" font-size="15" fill="#606961">Built by SupaMakers · No signup or watermark</text></svg>`;
await sharp(Buffer.from(og))
  .composite([{ input: Buffer.from(chart), left: 582, top: 108 }])
  .png()
  .toFile('public/og.png');

// Explicit allowlist: research notes, environment files and build artifacts never enter the public source archive.
const archive = {};
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (path === 'public/downloads' || path === 'public/examples/assets') continue;
    if (entry.isDirectory()) await collect(path);
    else if (entry.isFile()) archive[`chartsai/${path}`] = new Uint8Array(await readFile(path));
  }
}
for (const directory of ['src', 'public', 'scripts', 'tests', 'docs']) await collect(directory);
for (const path of [
  'README.md',
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
  `Prepared 9 presets, 20 showcase asset sets, social image and source archive (${Object.keys(archive).length} files).`,
);
