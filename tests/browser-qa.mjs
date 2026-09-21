import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const consoleErrors = [];
const pageErrors = [];
const failedResponses = [];
page.on('console', message => { if (message.type() === 'error') consoleErrors.push(`${message.text()} ${message.location().url || ''}`.trim()); });
page.on('pageerror', error => pageErrors.push(error.message));
page.on('response', response => { if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`); });

await fs.mkdir('.qa', { recursive: true });
await page.goto(`${baseURL}/#/`, { waitUntil: 'networkidle' });
await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
await page.reload({ waitUntil: 'networkidle' });
await page.locator('h1').waitFor();
await page.screenshot({ path: '.qa/public-desktop.png', fullPage: true });

const publicOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
await page.locator('[data-public-property-search] input[name="q"]').fill('D-12');
await page.locator('[data-public-property-search]').evaluate(form => form.requestSubmit());
await page.waitForURL(/#\/properties/);
await page.locator('.property-card').first().waitFor();

await page.goto(`${baseURL}/#/login`, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /Super Admin/ }).click();
await page.waitForURL(/#\/app\/dashboard/);
await page.getByRole('heading', { name: /Good (morning|afternoon|evening)/ }).waitFor();
await page.screenshot({ path: '.qa/dashboard-desktop.png', fullPage: true });

await page.goto(`${baseURL}/#/app/properties`, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Add property' }).click();
const dialog = page.getByRole('dialog');
await dialog.getByLabel('Property title *').fill('QA Test Plot in D-12/4');
await dialog.getByLabel('Sector *').fill('D-12/4');
await dialog.getByLabel('Size *').fill('10 Marla');
await dialog.getByLabel('Owner name *').fill('QA Demo Owner');
await dialog.getByLabel('Owner phone *').fill('03001234567');
await dialog.getByRole('button', { name: 'Add property' }).click();
await page.getByText('QA Test Plot in D-12/4').waitFor();
await page.reload({ waitUntil: 'networkidle' });
await page.getByText('QA Test Plot in D-12/4').waitFor();

await page.goto(`${baseURL}/#/app/leads?view=pipeline`, { waitUntil: 'networkidle' });
const firstStage = page.locator('[data-stage-select]').first();
await firstStage.selectOption('Contacted');
await page.getByText('Lead moved to Contacted.').waitFor();

await page.keyboard.press('/');
await page.locator('#global-search-input').fill('D-12');
await page.locator('.command-results a').first().waitFor();
await page.keyboard.press('Escape');

await page.goto(`${baseURL}/#/app/dashboard`, { waitUntil: 'networkidle' });
const axe = await new AxeBuilder({ page }).analyze();

const brokenRoutes = [];
const brokenImages = [];
const routes = [
  '/', '/properties', '/services', '/about', '/projects', '/contact',
  '/app/dashboard', '/app/properties', '/app/leads', '/app/clients', '/app/agents', '/app/visits', '/app/deals', '/app/rentals', '/app/commissions', '/app/projects', '/app/documents', '/app/reports', '/app/settings',
];
for (const route of routes) {
  await page.goto(`${baseURL}/#${route}`, { waitUntil: 'networkidle' });
  if (await page.locator('.fatal-error').count()) brokenRoutes.push(route);
  const sources = [...new Set(await page.locator('img').evaluateAll(images => images.map(image => image.getAttribute('src')).filter(Boolean)))];
  const missing = [];
  for (const source of sources) {
    const response = await page.request.get(new URL(source, baseURL).href);
    if (!response.ok()) missing.push(source);
  }
  if (missing.length) brokenImages.push({ route, sources: missing });
}

await page.setViewportSize({ width: 390, height: 844 });
await page.locator('#toast-region').evaluate(node => { node.innerHTML = ''; });
await page.goto(`${baseURL}/#/`, { waitUntil: 'networkidle' });
await page.screenshot({ path: '.qa/public-mobile.png', fullPage: true });
const mobilePublicOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
const mobilePublicMetrics = await page.evaluate(() => ({ innerWidth: window.innerWidth, clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
await page.goto(`${baseURL}/#/app/dashboard`, { waitUntil: 'networkidle' });
await page.screenshot({ path: '.qa/dashboard-mobile.png', fullPage: true });
const mobileAppOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);

const report = {
  consoleErrors,
  pageErrors,
  failedResponses,
  brokenRoutes,
  brokenImages,
  overflow: { publicDesktop: publicOverflow, publicMobile: mobilePublicOverflow, appMobile: mobileAppOverflow },
  mobilePublicMetrics,
  accessibility: axe.violations.map(item => ({ id: item.id, impact: item.impact, description: item.description, nodes: item.nodes.length, details: item.nodes.slice(0, 6).map(node => ({ target: node.target, html: node.html, failureSummary: node.failureSummary })) })),
};
await fs.writeFile('.qa/report.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();

if (consoleErrors.length || pageErrors.length || failedResponses.length || brokenRoutes.length || brokenImages.length || publicOverflow || mobilePublicOverflow || mobileAppOverflow || axe.violations.some(item => ['critical', 'serious'].includes(item.impact))) {
  process.exitCode = 1;
}
