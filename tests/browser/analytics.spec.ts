import { test, expect } from '@playwright/test';

test('production analytics wires bounded events and canonical URLs while exports stay local', async ({
  page,
  request,
}) => {
  const received: Record<string, any>[] = [];
  await page.route('https://www.chartsai.com/**', async (route) => {
    const url = new URL(route.request().url());
    await route.fulfill({
      response: await request.get(`http://127.0.0.1:4321${url.pathname}`),
    });
  });
  await page.route('https://plausible.io/js/**', (route) =>
    route.fulfill({
      contentType: 'text/javascript',
      body: `
    (() => {
      const queued = window.plausible.q || [], options = window.plausible.o;
      window.plausible = (name, config = {}) => {
        const payload = options.transformRequest({n:name, u:config.url, p:config.props || {}, r:document.referrer});
        fetch('https://plausible.io/api/event', {method:'POST', body:JSON.stringify(payload)});
      };
      queued.forEach(args => window.plausible(...args));
    })();
  `,
    }),
  );
  await page.route('https://plausible.io/api/event', async (route) => {
    received.push(JSON.parse(route.request().postData()!));
    await route.fulfill({ status: 202, body: 'ok' });
  });
  await page.goto('https://www.chartsai.com/line-graph-maker/?title=SECRET');
  await expect(page.locator('[data-chart-ready="true"]')).toBeVisible();
  await page.getByRole('combobox', { name: 'Worked example', exact: true }).selectOption('experiment');
  await page.getByRole('button', { name: 'Design & details' }).click();
  await page.getByLabel('Chart title', { exact: true }).fill('CONFIDENTIAL customer name');
  await page.getByLabel('Download format').selectOption('svg');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download', exact: true }).click();
  await download;
  await expect.poll(() => received.some((event) => event.n === 'Chart Download')).toBe(true);
  expect(received.filter((event) => event.n === 'pageview')).toHaveLength(1);
  expect(received.find((event) => event.n === 'Chart Download')?.p).toEqual({
    tool: 'line-graph',
    format: 'svg',
  });
  expect(received.every((event) => event.u === 'https://www.chartsai.com/line-graph-maker/')).toBe(true);
  expect(JSON.stringify(received)).not.toMatch(/SECRET|CONFIDENTIAL|Sample A|Cooling/);
  await page.goto('https://www.chartsai.com/examples/dot-plot-fractions/?search=SECRET');
  const exampleDownload = page.waitForEvent('download');
  await page.locator('.example-downloads').getByRole('link', { name: 'CSV', exact: true }).click();
  await exampleDownload;
  await expect
    .poll(() =>
      received.some(
        (event) =>
          event.n === 'Chart Download' &&
          event.u === 'https://www.chartsai.com/examples/dot-plot-fractions/' &&
          event.p.tool === 'dot-plot' &&
          event.p.format === 'csv',
      ),
    )
    .toBe(true);
  await page.goto('https://www.chartsai.com/datasets/iris/?query=SECRET');
  const datasetDownload = page.waitForEvent('download');
  await page.getByRole('link', { name: /Full CSV/ }).click();
  await datasetDownload;
  await expect
    .poll(() =>
      received.some(
        (event) =>
          event.n === 'Chart Download' &&
          event.u === 'https://www.chartsai.com/datasets/iris/' &&
          event.p.tool === 'public-dataset' &&
          event.p.format === 'csv',
      ),
    )
    .toBe(true);
  expect(JSON.stringify(received)).not.toMatch(/SECRET|CONFIDENTIAL/);
});

test('editorial events measure imports, edits and exports without private content', async ({
  page,
  request,
}) => {
  const received: Record<string, any>[] = [];
  await page.route('https://www.chartsai.com/**', async (route) => {
    const url = new URL(route.request().url());
    await route.fulfill({ response: await request.get(`http://127.0.0.1:4321${url.pathname}`) });
  });
  await page.route('https://plausible.io/js/**', (route) =>
    route.fulfill({
      contentType: 'text/javascript',
      body: `(()=>{const q=window.plausible.q||[],o=window.plausible.o;window.plausible=(name,c={})=>{const p=o.transformRequest({n:name,u:c.url,p:c.props||{}});fetch('https://plausible.io/api/event',{method:'POST',body:JSON.stringify(p)});};q.forEach(a=>window.plausible(...a));})();`,
    }),
  );
  await page.route('https://plausible.io/api/event', async (route) => {
    received.push(JSON.parse(route.request().postData()!));
    await route.fulfill({ status: 202, body: 'ok' });
  });
  await page.goto('https://www.chartsai.com/dumbbell-chart-maker/?private=SECRET');
  await expect(page.locator('.publication-preview[data-chart-ready="true"]')).toBeVisible();
  await page.getByRole('button', { name: 'Paste data', exact: true }).click();
  await page.getByRole('button', { name: 'Close import', exact: true }).click();
  await page.getByRole('button', { name: 'Design & details', exact: true }).click();
  await page.getByLabel('Headline', { exact: true }).fill('CONFIDENTIAL private headline');
  await page.getByLabel('Headline', { exact: true }).press('Tab');
  await page.getByLabel('Publication download format').selectOption('html');
  const file = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download publication chart', exact: true }).click();
  await file;
  await expect.poll(() => received.some((e) => e.n === 'Chart Download')).toBe(true);
  expect(received.some((e) => e.n === 'Import Started')).toBe(true);
  expect(received.some((e) => e.n === 'Chart Edited')).toBe(true);
  expect(received.filter((e) => e.n === 'Import Started')).toHaveLength(1);
  expect(received.every((e) => e.u === 'https://www.chartsai.com/dumbbell-chart-maker/')).toBe(true);
  expect(JSON.stringify(received)).not.toMatch(/SECRET|CONFIDENTIAL|India|World Bank/);
});

test('template selections and subsequent downloads retain only a fixed template ID', async ({page,request})=>{
 const received:Record<string,any>[]=[];
 await page.route('https://www.chartsai.com/**',async route=>{const u=new URL(route.request().url());await route.fulfill({response:await request.get(`http://127.0.0.1:4321${u.pathname}`)});});
 await page.route('https://plausible.io/js/**',route=>route.fulfill({contentType:'text/javascript',body:`(()=>{const q=window.plausible.q||[],o=window.plausible.o;window.plausible=(name,c={})=>{const p=o.transformRequest({n:name,u:c.url,p:c.props||{}});fetch('https://plausible.io/api/event',{method:'POST',body:JSON.stringify(p)});};q.forEach(a=>window.plausible(...a));})();`}));
 await page.route('https://plausible.io/api/event',async route=>{received.push(JSON.parse(route.request().postData()!));await route.fulfill({status:202,body:'ok'});});
 await page.goto('https://www.chartsai.com/editorial-charts/dumbbell-examples/?private=SECRET');
 const svg=page.waitForEvent('download');await page.locator('#commute-gap').getByRole('link',{name:'SVG',exact:true}).click();await svg;
 await expect.poll(()=>received.some(e=>e.n==='Chart Download'&&e.p.template==='commute-gap'&&e.p.format==='svg')).toBe(true);
 await page.locator('#commute-gap').getByRole('link',{name:'Use this chart',exact:true}).click();await expect(page.locator('[data-chart-ready="true"]')).toBeVisible();
 await expect.poll(()=>received.filter(e=>e.n==='Template Selected').length).toBe(1);
 await page.getByRole('button',{name:'Edit values',exact:true}).click();await page.getByLabel('Publication CSV data').fill('PRIVATE category,Before,After\nSECRET row,1,2');await page.getByRole('button',{name:'Apply data',exact:true}).click();
 await page.getByLabel('Publication download format').selectOption('json');const d=page.waitForEvent('download');await page.getByRole('button',{name:'Download publication chart',exact:true}).click();await d;
 await expect.poll(()=>received.some(e=>e.n==='Chart Download'&&e.p.template==='commute-gap'&&e.p.format==='json')).toBe(true);
 expect(received.filter(e=>e.n==='Template Selected')).toHaveLength(1);
 expect(JSON.stringify(received)).not.toMatch(/PRIVATE|SECRET|private=|template=|Before|After/);
 expect(received.every(e=>!e.u.includes('?')&&!e.u.includes('#'))).toBe(true);
});
