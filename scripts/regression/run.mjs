// Kiểm tra hồi quy: node run.mjs <distDir> <outDir> <port>
// Chụp 28 trang × 2 khổ (1280/375) + 15 kiểm tra chức năng, ghi results.json. Xem skill fix-bug/update-deps.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const [distDir, outDir, port = '4400'] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain', '.wasm': 'application/wasm', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.pf_meta': 'application/octet-stream' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(distDir, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) {
    res.writeHead(404, { 'content-type': TYPES['.html'] });
    return res.end(fs.readFileSync(path.join(distDir, '404.html')));
  }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  res.end(fs.readFileSync(f));
}).listen(+port);
const BASE = `http://localhost:${port}`;

const PAGES = [
  '/', '/an-uong/', '/an-uong/thieu-canxi-nen-an-gi/', '/an-uong/nhom/thieu-canxi/',
  '/kien-thuc-ve-thuoc/', '/kien-thuc-ve-thuoc/dung-khang-sinh-dung-cach/',
  '/thuc-pham-chuc-nang/', '/thuc-pham-chuc-nang/nhom/vitamin-khoang-chat/',
  '/thuc-pham-chuc-nang/pregnacare-max/', '/thuc-pham-chuc-nang/com-vi-sinh-lacto-biomin-gold-hop-20-goi/',
  '/thuc-pham-chuc-nang/alive-probiotics-men-vi-sinh-30-goi/',
  '/cham-soc-ca-nhan/', '/cham-soc-ca-nhan/cetaphil-baby-gentle-wash-shampoo/', '/duoc-my-pham/', '/thiet-bi-y-te/',
  '/gio-hang/', '/tai-khoan/', '/gioi-thieu/', '/tim-kiem/?q=vitamin',
  '/tra-cuu-thuoc/', '/tra-cuu-duoc-chat/', '/tra-cuu-duoc-lieu/', '/tra-cuu-don-hang/',
  '/admin/don-hang/', '/admin/tin-nhan/', '/admin/binh-luan/', '/admin/san-pham/', '/khong-ton-tai/',
];
const WIDTHS = [{ w: 1280, h: 900, name: 'desktop' }, { w: 375, h: 812, name: 'mobile' }];
const results = { pages: {}, checks: {} };

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: 'new', args: ['--hide-scrollbars'],
});

async function newPage(vp) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: vp.w, height: vp.h });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e.message).slice(0, 200)));
  await page.setRequestInterception(true);
  page.on('request', (r) => {
    // Không tạo tài khoản ẩn danh thật trên Supabase trong lúc test
    if (r.url().includes('/auth/v1/signup')) return r.abort();
    r.continue();
  });
  return { ctx, page, errors };
}
const slug = (u) => (u.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'home');
const freeze = `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}`;
async function scrollAll(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 800));
}

for (const vp of WIDTHS) {
  for (const u of PAGES) {
    const { ctx, page, errors } = await newPage(vp);
    const resp = await page.goto(BASE + u, { waitUntil: 'networkidle0', timeout: 60000 }).catch((e) => ({ status: () => 'ERR ' + e.message }));
    await page.addStyleTag({ content: freeze });
    await scrollAll(page);
    const info = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector('h1')?.textContent.trim().slice(0, 80) ?? null,
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      brokenImgs: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map((i) => i.getAttribute('src')).slice(0, 5),
      links: document.querySelectorAll('a').length,
    }));
    await page.screenshot({ path: path.join(outDir, `${vp.name}_${slug(u)}.png`), fullPage: true });
    results.pages[`${vp.name} ${u}`] = { status: resp.status(), ...info, errors };
    await ctx.close();
  }
}

async function check(name, vp, fn) {
  const { ctx, page, errors } = await newPage(vp);
  try { results.checks[`${vp.name} ${name}`] = { ok: true, ...(await fn(page)), errors }; }
  catch (e) { results.checks[`${vp.name} ${name}`] = { ok: false, error: String(e.message).slice(0, 300), errors }; }
  await ctx.close();
}
const visible = (sel) => `(() => { const e = document.querySelector('${sel}'); if (!e) return false; const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && r.right > 0 && r.left < innerWidth; })()`;

for (const vp of WIDTHS) {
  await check('search-suggest', vp, async (page) => {
    await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
    const input = await page.evaluateHandle(() => [...document.querySelectorAll('input[name="q"]')].find((i) => i.getBoundingClientRect().width > 0));
    await input.click(); await input.type('canxi', { delay: 40 });
    await page.waitForFunction(() => document.querySelectorAll('#searchSuggest .search-suggest-product').length > 0, { timeout: 20000 });
    const n = await page.evaluate(() => document.querySelectorAll('#searchSuggest .search-suggest-product').length);
    await page.screenshot({ path: path.join(outDir, `${vp.name}__check_suggest.png`) });
    return { suggestions: n };
  });
  await check('search-page', vp, async (page) => {
    await page.goto(BASE + '/tim-kiem/?q=vitamin', { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => document.querySelectorAll('.search-result').length > 0, { timeout: 20000 });
    const r = await page.evaluate(() => ({ results: document.querySelectorAll('.search-result').length, filterInputs: document.querySelectorAll('input[type="checkbox"]').length }));
    // đổi sang Bài viết
    await page.evaluate(() => { const el = [...document.querySelectorAll('input[type=radio], .search-tabs button, [role=tab]')].find((e) => (e.value || e.textContent || '').includes('Bài viết')); el?.click(); });
    await new Promise((res) => setTimeout(res, 2500));
    r.postResults = await page.evaluate(() => document.querySelectorAll('.search-result').length);
    return r;
  });
  await check('add-to-cart+cart-page', vp, async (page) => {
    await page.goto(BASE + '/thuc-pham-chuc-nang/pregnacare-max/', { waitUntil: 'networkidle0' });
    const btn = await page.evaluateHandle(() => [...document.querySelectorAll('[data-add-to-cart]')].find((b) => b.getBoundingClientRect().width > 0 && !/mua ngay/i.test(b.textContent)));
    await btn.click();
    await new Promise((r) => setTimeout(r, 1500));
    const badge = await page.evaluate(() => [...document.querySelectorAll('.cart-badge')].map((b) => b.textContent.trim()).join(','));
    await page.goto(BASE + '/gio-hang/', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));
    const cart = await page.evaluate(() => ({ items: document.querySelectorAll('#cart-list > *').length, text: document.querySelector('.checkout-summary')?.innerText.replace(/\s+/g, ' ').slice(0, 300) }));
    await page.screenshot({ path: path.join(outDir, `${vp.name}__check_cart.png`), fullPage: true });
    return { badge, ...cart };
  });
  await check('sticky-buy-bar', vp, async (page) => {
    await page.goto(BASE + '/thuc-pham-chuc-nang/pregnacare-max/', { waitUntil: 'networkidle0' });
    const before = await page.evaluate(visible('#stickyBuyBar'));
    await page.evaluate(async () => {
      const a = document.querySelector('.product-info .actions');
      while (a.getBoundingClientRect().bottom > -200) { window.scrollBy(0, 300); await new Promise((r) => setTimeout(r, 120)); }
    });
    await new Promise((r) => setTimeout(r, 800));
    return { before, after: await page.evaluate(visible('#stickyBuyBar')) };
  });
  await check('chat-panel', vp, async (page) => {
    await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
    await page.click('#faqChatToggle'); await new Promise((r) => setTimeout(r, 1000));
    return { open: await page.evaluate(visible('#faqChatPanel')) };
  });
}
await check('mega-menu-hover', WIDTHS[0], async (page) => {
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
  const items = await page.$$('.site-nav .has-sub');
  const out = [];
  for (const it of items) {
    await it.hover(); await new Promise((r) => setTimeout(r, 300));
    out.push(await it.evaluate((e) => { const m = e.querySelector('.mega-menu, .submenu'); if (!m) return 'none'; const r = m.getBoundingClientRect(); return r.height > 0 && getComputedStyle(m).visibility !== 'hidden'; }));
  }
  await page.screenshot({ path: path.join(outDir, `desktop__check_mega.png`) });
  return { menus: out };
});
await check('account-modal', WIDTHS[0], async (page) => {
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await page.click('#account-trigger'); await new Promise((r) => setTimeout(r, 600));
  return { open: await page.evaluate(visible('#account-modal')) };
});
await check('mobile-drawer', WIDTHS[1], async (page) => {
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await page.click('#mobile-menu-btn'); await new Promise((r) => setTimeout(r, 600));
  const open = await page.evaluate(visible('#mobile-drawer'));
  await page.screenshot({ path: path.join(outDir, `mobile__check_drawer.png`) });
  await page.click('#mobile-drawer-account'); await new Promise((r) => setTimeout(r, 600));
  return { open, accountModal: await page.evaluate(visible('#account-modal')) };
});
await check('static-files', WIDTHS[0], async (page) => {
  const get = async (p) => { const r = await fetch(BASE + p); return { status: r.status, len: (await r.text()).length }; };
  const sm = await (await fetch(BASE + '/sitemap-0.xml')).text();
  const pj = await (await fetch(BASE + '/san-pham.json')).json();
  return { sitemapUrls: (sm.match(/<loc>/g) || []).length, products: Object.keys(pj.products ?? pj).length, robots: await get('/robots.txt'), index: await get('/sitemap-index.xml'), pagefind: await get('/pagefind/pagefind.js') };
});

fs.writeFileSync(path.join(outDir, 'results.json'), JSON.stringify(results, null, 2));
await browser.close(); server.close();
console.log('done');
