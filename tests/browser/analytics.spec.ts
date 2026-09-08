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
  await page.getByRole('button', { name: 'Timed experiment', exact: true }).click();
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
});
