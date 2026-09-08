import { readFile, writeFile, mkdir, appendFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const baseline = JSON.parse(await readFile(new URL('../docs/site-baseline.json', import.meta.url), 'utf8'));
const origin = baseline.canonicalOrigin;
const report = {
  checkedAt: new Date().toISOString(),
  origin,
  scope: 'Public availability and discoverability checks, not Google indexing or Core Web Vitals.',
  pages: [],
  assets: [],
  checks: [],
  errors: [],
};
const sameOrigin = (raw) => {
  const u = new URL(raw, origin);
  assert.equal(u.origin, origin, 'Unexpected origin');
  assert(!u.username && !u.password);
  return u;
};
async function request(raw) {
  const u = sameOrigin(raw);
  let last;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(u, {
        signal: AbortSignal.timeout(20000),
        redirect: 'manual',
        headers: { 'User-Agent': 'ChartsAI-HealthCheck/1.0' },
      });
      if (r.status >= 500 && attempt === 0) continue;
      assert.equal(r.status, 200, `${u.pathname}: HTTP ${r.status}`);
      return r;
    } catch (e) {
      last = e;
    }
  }
  throw last;
}
async function check(name, fn) {
  try {
    await fn();
    report.checks.push({ name, passed: true });
  } catch (e) {
    report.checks.push({ name, passed: false });
    report.errors.push(`${name}: ${e.message}`);
  }
}
async function pool(items, fn) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (queue.length) {
        const item = queue.shift();
        try {
          await fn(item);
        } catch (e) {
          report.errors.push(`${item}: ${e.message}`);
        }
      }
    }),
  );
}
const locations = (xml) =>
  [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replaceAll('&amp;', '&'));
let urls = [];
await check('Sitemap index and children', async () => {
  const r = await request('/sitemap-index.xml');
  assert((r.headers.get('content-type') || '').includes('xml'));
  const index = await r.text();
  assert(index.includes('<sitemapindex'));
  const children = locations(index);
  assert(children.length > 0 && children.length <= 20);
  for (const child of children) {
    const r = await request(child);
    const xml = await r.text();
    assert(xml.includes('<urlset'));
    urls.push(...locations(xml));
  }
  assert(urls.length > 0 && urls.length <= 2000);
  assert.equal(new Set(urls).size, urls.length);
  for (const url of urls) {
    sameOrigin(url);
    assert(!new URL(url).search && !url.includes('/404'));
  }
  for (const url of baseline.urls)
    assert(urls.includes(url), `Previously published route absent from sitemap: ${url}`);
});
const assets = new Set(
  ['radar', 'dot'].flatMap((kind) =>
    ['editorial', 'ocean', 'night'].map((theme) => `/previews/${kind}-${theme}.svg`),
  ),
);
await pool(urls, async (url) => {
  const r = await request(url);
  assert(!(r.headers.get('x-robots-tag') || '').includes('noindex'));
  const html = await r.text();
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, 'Expected one H1');
  assert(html.includes(`<link rel="canonical" href="${url}"`), 'Canonical mismatch');
  assert(/<meta name="description" content="[^"]+"/.test(html), 'Description missing');
  assert(!/<meta name="robots" content="[^"]*noindex/.test(html), 'Unexpected noindex');
  for (const m of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs))
    assert(Array.isArray(JSON.parse(m[1])['@graph']));
  for (const [, path] of html.matchAll(/(?:href|src)="(\/(?:examples|charts|datasets)\/assets\/[^"?#]+)"/g))
    assets.add(path);
  report.pages.push({ url, status: 200 });
});
await pool(assets, async (path) => {
  const r = await request(path),
    bytes = Buffer.from(await r.arrayBuffer());
  assert(bytes.length > 20, 'Empty artifact');
  if (path.endsWith('.png')) {
    assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
    assert(bytes.readUInt32BE(16) > 0 && bytes.readUInt32BE(20) > 0);
  }
  if (path.endsWith('.svg')) assert(bytes.toString().includes('<svg'));
  if (path.endsWith('.json')) JSON.parse(bytes.toString());
  if (path.endsWith('.csv')) assert(bytes.toString().split(/\r?\n/).length > 1);
  report.assets.push({ path, status: 200, bytes: bytes.length });
});
await check('Apex redirects to canonical', async () => {
  const r = await fetch('https://chartsai.com/', { redirect: 'manual', signal: AbortSignal.timeout(20000) });
  assert([301, 308].includes(r.status));
  assert.equal(r.headers.get('location'), origin + '/');
});
await check('Robots advertises the live sitemap', async () => {
  const text = await (await request('/robots.txt')).text();
  assert(text.includes(`Sitemap: ${origin}/sitemap-index.xml`));
  assert(!/^Disallow:\s*\/\s*$/m.test(text));
});
await check('Source archive is downloadable', async () => {
  const bytes = Buffer.from(await (await request('/downloads/chartsai-source.zip')).arrayBuffer());
  assert.equal(bytes.subarray(0, 2).toString(), 'PK');
});
report.summary = {
  sitemapUrls: urls.length,
  pagesChecked: report.pages.length,
  assetsChecked: report.assets.length,
  errors: report.errors.length,
};
await mkdir('artifacts/production-health', { recursive: true });
await writeFile('artifacts/production-health/report.json', JSON.stringify(report, null, 2));
const summary = `# ChartsAI production health\n\nChecked ${report.checkedAt}.\n\n- ${report.pages.length}/${urls.length} sitemap pages passed.\n- ${report.assets.length}/${assets.size} linked artifacts passed.\n- ${report.errors.length} errors.\n\n${report.errors.map((e) => `- ${e}`).join('\n')}\n\nThese are availability checks. Search indexing, visitor analytics and field performance require their own reports.\n`;
await writeFile('artifacts/production-health/report.md', summary);
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
console.log(JSON.stringify(report.summary));
if (report.errors.length) process.exitCode = 1;
