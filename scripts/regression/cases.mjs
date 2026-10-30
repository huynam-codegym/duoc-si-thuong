// Chạy các test case tự động trong docs/test-cases.md: node cases.mjs <distDir> <outDir> <port> [--only=ORD,CART] [--no-live]
// T = chạy trên bản build ở máy, Supabase được GIẢ LẬP (không ghi dữ liệu thật).
// L = gọi máy chủ thật, chỉ đọc hoặc gửi dữ liệu bị từ chối TRƯỚC bước lưu (không tạo dữ liệu).
// Kết quả: <outDir>/report.md + results.json. Mỗi case PASS/FAIL kèm chi tiết.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';

const args = process.argv.slice(2);
const [distDir, outDir, port = '4410'] = args.filter((a) => !a.startsWith('--'));
const only = (args.find((a) => a.startsWith('--only=')) ?? '').slice(7).split(',').filter(Boolean);
const noLive = args.includes('--no-live');
fs.mkdirSync(outDir, { recursive: true });
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '../..');

// Khóa anon/URL Supabase (không phải bí mật, nhưng không in ra báo cáo)
const env = Object.fromEntries(
  fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]),
);
const SB_URL = env.PUBLIC_SUPABASE_URL;
const SB_KEY = env.PUBLIC_SUPABASE_ANON_KEY;
const LIVE_SITE = 'https://duocsithuong.com';

// ---------- máy chủ tĩnh cho dist ----------
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain', '.wasm': 'application/wasm', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
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

// ---------- dữ liệu từ bản build ----------
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const allFiles = walk(distDir);
const htmlFiles = allFiles.filter((f) => f.endsWith('.html'));
const routeOf = (f) => '/' + path.relative(distDir, f).replace(/\\/g, '/').replace(/index\.html$/, '').replace(/\.html$/, '');
const pages = htmlFiles.map((f) => ({ file: f, route: routeOf(f), html: fs.readFileSync(f, 'utf8') }));
const catalog = JSON.parse(fs.readFileSync(path.join(distDir, 'san-pham.json'), 'utf8'));
const DEPARTMENTS = ['thuc-pham-chuc-nang', 'duoc-my-pham', 'cham-soc-ca-nhan', 'thiet-bi-y-te'];
const productPages = pages.filter((p) => {
  const parts = p.route.split('/').filter(Boolean);
  return parts.length === 2 && DEPARTMENTS.includes(parts[0]) && parts[1] !== 'nhom';
});
const postPages = pages.filter((p) => {
  const parts = p.route.split('/').filter(Boolean);
  return parts.length === 2 && ['an-uong', 'kien-thuc-ve-thuoc'].includes(parts[0]) && parts[1] !== 'nhom';
});
const productSlug = (p) => p.route.split('/').filter(Boolean)[1];
const onSale = Object.entries(catalog).find(([, v]) => v.originalPrice && v.originalPrice > v.price);
const cheap = Object.entries(catalog).filter(([, v]) => v.price && v.price < 200000).sort((a, b) => a[1].price - b[1].price)[0];
const pageOf = (slug) => productPages.find((p) => productSlug(p) === slug).route;

// ---------- trình duyệt ----------
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: 'new',
  args: ['--hide-scrollbars'],
});
const VP = { desktop: { width: 1280, height: 900 }, mobile: { width: 375, height: 812 } };
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'GET,POST,PATCH,DELETE,OPTIONS' };

/** Mở trang mới với Supabase giả lập. `mock(url, req)` trả {status, body} hoặc undefined (dùng mặc định). */
async function open(vpName, { mock, storage } = {}) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport(VP[vpName]);
  const errors = [];
  const calls = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e.message).slice(0, 200)));
  await page.setRequestInterception(true);
  page.on('request', (r) => {
    const u = r.url();
    if (u.startsWith(SB_URL)) {
      if (r.method() === 'OPTIONS') return r.respond({ status: 204, headers: CORS });
      calls.push({ url: u.slice(SB_URL.length), method: r.method(), body: r.postData() });
      const m = mock?.(u.slice(SB_URL.length), r);
      if (m) return r.respond({ status: m.status ?? 200, headers: { ...CORS, 'content-type': 'application/json' }, body: JSON.stringify(m.body) });
      if (u.includes('/auth/v1/')) return r.respond({ status: 400, headers: { ...CORS, 'content-type': 'application/json' }, body: '{"error":"mock"}' });
      return r.respond({ status: 200, headers: { ...CORS, 'content-type': 'application/json' }, body: '[]' });
    }
    // Không gọi ra ngoài trong test T (ảnh QR, Turnstile, font...)
    if (!u.startsWith(BASE) && !u.startsWith('data:')) return r.respond({ status: 204, headers: CORS, body: '' });
    r.continue();
  });
  if (storage) {
    await page.evaluateOnNewDocument((s) => { for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, storage);
  }
  return { ctx, page, errors, calls, close: () => ctx.close() };
}
const go = (page, route) => page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 60000 });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isVisible = (page, sel) => page.evaluate((s) => {
  const e = document.querySelector(s);
  if (!e) return false;
  const r = e.getBoundingClientRect();
  const cs = getComputedStyle(e);
  return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && r.right > 0 && r.left < innerWidth;
}, sel);
async function scrollAll(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); }
    window.scrollTo(0, 0);
  });
  await sleep(600);
}
const cartStorage = (items) => ({ 'duocsithuong-cart': JSON.stringify(items) });
const cartItem = (slug, qty = 1) => ({ id: slug, name: catalog[slug].name, price: catalog[slug].price, originalPrice: catalog[slug].originalPrice ?? undefined, unit: 'Hộp', image: '', qty });
const vndNum = (s) => Number(String(s).replace(/\D/g, ''));

// ---------- khung chạy case ----------
const results = [];
async function tc(id, title, fn) {
  if (only.length && !only.some((o) => id.startsWith(o))) return;
  const live = /^(API|FN)-/.test(id) || ['SEC-01', 'SEC-02', 'SEC-03', 'SEC-06', 'LK-05', 'ORD-11'].includes(id);
  if (live && noLive) return;
  const t0 = Date.now();
  let status = 'PASS', detail = '';
  try {
    const out = await fn();
    if (out && out.fail) { status = 'FAIL'; detail = out.fail; }
    else detail = out?.info ?? '';
  } catch (e) {
    status = 'FAIL';
    detail = 'Lỗi khi chạy: ' + String(e.message).slice(0, 300);
  }
  results.push({ id, title, status, detail, ms: Date.now() - t0 });
  console.log(`${status} ${id} ${title}${detail ? ' — ' + detail : ''}`);
}
/** Gom các lỗi lại: trả {fail} nếu có, {info} nếu không. */
const verdict = (problems, info = '') => (problems.length ? { fail: problems.slice(0, 12).join(' | ') + (problems.length > 12 ? ` (+${problems.length - 12})` : '') } : { info });

// ========== 1. UI ==========
await tc('UI-01', 'Mọi trang trả 200, trang lạ ra 404 tiếng Việt', async () => {
  const bad = [];
  for (const p of pages) {
    if (p.route === '/404') continue; // trang lỗi, vốn trả 404
    const r = await fetch(BASE + p.route);
    if (r.status !== 200) bad.push(`${p.route} ${r.status}`);
  }
  const r404 = await fetch(BASE + '/khong-ton-tai-abc/');
  const t = await r404.text();
  if (r404.status !== 404 || !/không tìm thấy/i.test(t)) bad.push('404 sai');
  return verdict(bad, `${pages.length} trang`);
});

const SAMPLE = ['/', '/an-uong/', postPages[0]?.route, '/kien-thuc-ve-thuoc/', '/thuc-pham-chuc-nang/', '/thuc-pham-chuc-nang/nhom/vitamin-khoang-chat/',
  ...productPages.slice(0, 4).map((p) => p.route), '/cham-soc-ca-nhan/', '/duoc-my-pham/', '/thiet-bi-y-te/', '/gio-hang/', '/tai-khoan/', '/gioi-thieu/',
  '/tim-kiem/?q=vitamin', '/tra-cuu-thuoc/', '/tra-cuu-don-hang/', '/chinh-sach-bao-mat/', '/admin/don-hang/', '/admin/tin-nhan/', '/admin/binh-luan/', '/admin/san-pham/', '/khong-ton-tai/'].filter(Boolean);
const browserChecks = { overflow: [], errors: [], broken: [] };
for (const vp of ['desktop', 'mobile']) {
  if (only.length && !only.some((o) => 'UI-02 UI-03 UI-04'.includes(o))) break;
  for (const route of SAMPLE) {
    const { page, errors, close } = await open(vp);
    await go(page, route).catch((e) => errors.push('GOTO ' + e.message));
    await scrollAll(page);
    const info = await page.evaluate(() => ({
      ovf: document.documentElement.scrollWidth - innerWidth,
      broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src') && !i.src.includes('vietqr')).map((i) => i.getAttribute('src')),
    }));
    if (info.ovf > 0) browserChecks.overflow.push(`${vp} ${route} +${info.ovf}px`);
    for (const e of errors) if (!/Failed to load resource/.test(e)) browserChecks.errors.push(`${vp} ${route}: ${e}`);
    for (const b of info.broken) browserChecks.broken.push(`${vp} ${route}: ${b}`);
    await close();
  }
}
await tc('UI-02', 'Không tràn ngang (1280/375, trang mẫu)', async () => verdict(browserChecks.overflow, `${SAMPLE.length} trang × 2 khổ`));
await tc('UI-03', 'Không có lỗi JavaScript', async () => verdict(browserChecks.errors));
await tc('UI-04', 'Không có ảnh vỡ', async () => verdict(browserChecks.broken));

await tc('UI-05', 'Đủ h1/title/description/canonical/lang', async () => {
  const bad = [];
  for (const p of pages) {
    if (p.route === '/404') continue;
    const h1 = (p.html.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) bad.push(`${p.route} có ${h1} h1`);
    if (!/<title>[^<]+<\/title>/.test(p.html)) bad.push(`${p.route} thiếu title`);
    if (!/<meta name="description" content="[^"]+"/.test(p.html)) bad.push(`${p.route} thiếu description`);
    if (!/<link rel="canonical" href="https:\/\/duocsithuong\.com/.test(p.html)) bad.push(`${p.route} thiếu canonical`);
    if (!/<html lang="vi"/.test(p.html)) bad.push(`${p.route} thiếu lang`);
  }
  return verdict(bad);
});
await tc('UI-06', 'Meta CSP, referrer, chống nhúng trang', async () => {
  const bad = pages.filter((p) => !p.html.includes("object-src 'none'") || !/<meta name="referrer"/.test(p.html) || !/top\s*!==\s*self|self\s*!==\s*top|window\.top/.test(p.html)).map((p) => p.route);
  return verdict(bad);
});
await tc('UI-07', 'Chân trang có miễn trừ, Chính sách bảo mật, Tra cứu đơn', async () => {
  const bad = pages.filter((p) => !/chỉ mang tính chất tham khảo/.test(p.html) || !p.html.includes('/chinh-sach-bao-mat/') || !p.html.includes('/tra-cuu-don-hang/')).map((p) => p.route);
  return verdict(bad);
});
await tc('UI-08', 'Liên kết nội bộ không gãy', async () => {
  const bad = new Set();
  const exists = (u) => {
    const clean = decodeURIComponent(u.split(/[?#]/)[0]);
    let f = path.join(distDir, clean);
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    return fs.existsSync(f);
  };
  for (const p of pages) {
    for (const m of p.html.matchAll(/\s(?:href|src)="(\/[^"]*)"/g)) {
      const u = m[1];
      if (u.startsWith('//')) continue;
      if (!exists(u)) bad.add(`${p.route} → ${u}`);
    }
  }
  return verdict([...bad]);
});
await tc('UI-09', 'Ảnh có alt', async () => {
  const bad = [];
  for (const p of pages) {
    for (const m of p.html.matchAll(/<img\b[^>]*>/g)) {
      const tag = m[0];
      if (/\shidden[\s>=]/.test(tag) || /aria-hidden="true"/.test(tag)) continue;
      // alt rỗng (viết `alt` không có giá trị) là hợp lệ cho ảnh trang trí
      if (!/\salt(=|\s|>)/.test(tag)) bad.push(`${p.route}: ${tag.slice(0, 80)}`);
    }
  }
  return verdict(bad);
});
await tc('UI-10', 'Cỡ chữ gốc 18px', async () => {
  const { page, close } = await open('desktop');
  await go(page, '/');
  const fs_ = await page.evaluate(() => getComputedStyle(document.documentElement).fontSize);
  await close();
  return fs_ === '18px' ? { info: fs_ } : { fail: `font-size gốc ${fs_}` };
});

// ========== 2. NAV ==========
await tc('NAV-01', 'Rê chuột mở menu con của từng mục', async () => {
  const { page, close } = await open('desktop');
  await go(page, '/');
  const items = await page.$$('.site-nav .has-sub');
  const bad = [];
  for (const [i, it] of items.entries()) {
    await it.hover(); await sleep(300);
    const ok = await it.evaluate((e) => { const m = e.querySelector('.mega-menu, .submenu'); if (!m) return false; const r = m.getBoundingClientRect(); return r.height > 0 && getComputedStyle(m).visibility !== 'hidden'; });
    if (!ok) bad.push(`mục ${i + 1}`);
  }
  await close();
  return verdict(bad, `${items.length} mục`);
});
await tc('NAV-02', 'Ngăn kéo điện thoại mở và Esc đóng', async () => {
  const { page, close } = await open('mobile');
  await go(page, '/');
  await page.click('#mobile-menu-btn'); await sleep(500);
  const opened = await isVisible(page, '#mobile-drawer');
  await page.keyboard.press('Escape'); await sleep(500);
  const closed = !(await isVisible(page, '#mobile-drawer .mobile-drawer-panel'));
  await close();
  return opened && closed ? {} : { fail: `mở=${opened} đóng=${closed}` };
});
await tc('NAV-03', 'Khối Đăng nhập trong ngăn kéo mở khung đăng nhập', async () => {
  const { page, close } = await open('mobile');
  await go(page, '/');
  await page.click('#mobile-menu-btn'); await sleep(500);
  await page.click('#mobile-drawer-account'); await sleep(500);
  const ok = await isVisible(page, '#account-modal');
  await close();
  return ok ? {} : { fail: 'khung đăng nhập không hiện' };
});
await tc('NAV-04', 'Ngăn kéo có Tra cứu đơn hàng', async () => {
  const html = pages.find((p) => p.route === '/').html;
  return /class="mobile-drawer-lookup"[^>]*href="\/tra-cuu-don-hang\/"|href="\/tra-cuu-don-hang\/"[^>]*class="mobile-drawer-lookup"/.test(html) ? {} : { fail: 'không thấy .mobile-drawer-lookup trỏ /tra-cuu-don-hang/' };
});
await tc('NAV-05', 'Nút Về đầu trang', async () => {
  const bad = [];
  const { page, close } = await open('desktop');
  await go(page, '/');
  if (await isVisible(page, '#backToTop')) bad.push('1280: hiện ngay lúc đầu');
  await page.evaluate(() => window.scrollTo(0, 1500)); await sleep(600);
  if (!(await isVisible(page, '#backToTop'))) bad.push('1280: không hiện sau khi cuộn');
  else {
    await page.click('#backToTop'); await sleep(1500);
    const y = await page.evaluate(() => scrollY);
    if (y > 5) bad.push(`1280: bấm xong scrollY=${y}`);
  }
  await close();
  const m = await open('mobile');
  await go(m.page, '/');
  await m.page.evaluate(() => window.scrollTo(0, 1500)); await sleep(600);
  if (await isVisible(m.page, '#backToTop')) bad.push('375: vẫn hiện');
  await m.close();
  return verdict(bad);
});
await tc('NAV-06', 'Nút 3 gạch / menu ngang đúng khổ', async () => {
  const bad = [];
  const d = await open('desktop'); await go(d.page, '/');
  if (await isVisible(d.page, '#mobile-menu-btn')) bad.push('1280 có nút 3 gạch');
  if (!(await isVisible(d.page, '.site-nav'))) bad.push('1280 không có menu ngang');
  await d.close();
  const m = await open('mobile'); await go(m.page, '/');
  if (!(await isVisible(m.page, '#mobile-menu-btn'))) bad.push('375 không có nút 3 gạch');
  if (await isVisible(m.page, '.site-nav')) bad.push('375 có menu ngang');
  await m.close();
  return verdict(bad);
});
await tc('NAV-07', 'Trang nhóm con: nhóm cha ở menu trái tự mở', async () => {
  const html = pages.find((p) => p.route === '/thuc-pham-chuc-nang/nhom/canxi-vitamin-d/')?.html ?? '';
  return /class="shop-parent open"|class="shop-parent[^"]*\bopen\b/.test(html) ? {} : { fail: 'không thấy .shop-parent.open' };
});

// ========== 3. SRC ==========
async function typeHeaderSearch(page, text) {
  const input = await page.evaluateHandle(() => [...document.querySelectorAll('input[name="q"]')].find((i) => i.getBoundingClientRect().width > 0));
  await input.click({ clickCount: 3 });
  await input.type(text, { delay: 30 });
  return input;
}
for (const vp of ['desktop', 'mobile']) {
  await tc(`SRC-01 ${vp}`, 'Gợi ý sản phẩm có ảnh + giá', async () => {
    const { page, close } = await open(vp);
    await go(page, '/');
    await typeHeaderSearch(page, 'canxi');
    await page.waitForFunction(() => document.querySelectorAll('#searchSuggest .search-suggest-product').length > 0, { timeout: 20000 });
    const r = await page.evaluate(() => {
      const rows = [...document.querySelectorAll('#searchSuggest .search-suggest-product')];
      return { n: rows.length, noImg: rows.filter((r) => !r.querySelector('img')).length, noPrice: rows.filter((r) => !r.querySelector('.search-suggest-price')).length, all: !!document.querySelector('#searchSuggest .search-suggest-all') };
    });
    await close();
    const bad = [];
    if (r.n > 6) bad.push(`${r.n} dòng (>6)`);
    if (r.noImg) bad.push(`${r.noImg} dòng thiếu ảnh`);
    if (r.noPrice) bad.push(`${r.noPrice} dòng thiếu giá`);
    if (!r.all) bad.push('thiếu dòng Xem tất cả');
    return verdict(bad, `${r.n} gợi ý`);
  });
}
await tc('SRC-02', 'Lượt tìm đầu tiên sau khi tải trang có kết quả', async () => {
  const bad = [];
  for (let round = 0; round < 3; round++) {
    const { page, close } = await open('desktop');
    await go(page, '/');
    await typeHeaderSearch(page, 'vitamin');
    const ok = await page.waitForFunction(() => document.querySelectorAll('#searchSuggest .search-suggest-product').length > 0, { timeout: 15000 }).then(() => true, () => false);
    if (!ok) bad.push(`lần ${round + 1}: 0 gợi ý`);
    await close();
  }
  return verdict(bad, '3 lần tải trang mới');
});
await tc('SRC-03', 'Trang tìm kiếm, đổi Sản phẩm/Bài viết', async () => {
  const { page, close } = await open('desktop');
  await go(page, '/tim-kiem/?q=vitamin');
  await page.waitForFunction(() => document.querySelectorAll('.search-result').length > 0, { timeout: 20000 });
  const before = await page.evaluate(() => [...document.querySelectorAll('.search-result a')].map((a) => a.getAttribute('href')).join('|'));
  await page.evaluate(() => { const el = [...document.querySelectorAll('input[name="content-type"]')].find((e) => !e.checked); el?.click(); });
  await page.waitForFunction((b) => [...document.querySelectorAll('.search-result a')].map((a) => a.getAttribute('href')).join('|') !== b, { timeout: 15000 }, before).catch(() => {});
  const after = await page.evaluate(() => ({ n: document.querySelectorAll('.search-result').length, posts: [...document.querySelectorAll('.search-result a')].filter((a) => /^\/(an-uong|kien-thuc-ve-thuoc)\//.test(a.getAttribute('href'))).length }));
  await close();
  return after.n > 0 && after.posts === after.n ? { info: `${after.n} bài viết` } : { fail: `sau khi đổi: ${after.n} kết quả, ${after.posts} là bài viết` };
});
await tc('SRC-04', 'Sắp xếp giá thấp tăng dần', async () => {
  const { page, close } = await open('desktop');
  await go(page, '/tim-kiem/?q=vitamin');
  await page.waitForFunction(() => document.querySelectorAll('.search-result').length > 0, { timeout: 20000 });
  await page.click('#searchSort [data-sort="asc"]');
  await sleep(2500);
  const prices = await page.evaluate(() => [...document.querySelectorAll('.search-result .search-result-price')].map((e) => Number(e.childNodes[0]?.textContent.replace(/\D/g, '') || e.textContent.replace(/\D/g, ''))));
  await close();
  const bad = [];
  for (let i = 1; i < prices.length; i++) if (prices[i] < prices[i - 1]) bad.push(`vị trí ${i}: ${prices[i - 1]} > ${prices[i]}`);
  return prices.length < 2 ? { fail: `chỉ ${prices.length} giá` } : verdict(bad, `${prices.length} giá`);
});
await tc('SRC-05', 'Gõ không dấu "khang sinh"', async () => {
  const { page, close } = await open('desktop');
  await go(page, '/tim-kiem/?q=khang%20sinh');
  await page.evaluate(() => { const el = [...document.querySelectorAll('input[name="content-type"]')].find((e) => !e.checked); el?.click(); });
  const ok = await page.waitForFunction(() => [...document.querySelectorAll('.search-result')].some((e) => /kháng sinh/i.test(e.textContent)), { timeout: 20000 }).then(() => true, () => false);
  await close();
  return ok ? {} : { fail: 'không có kết quả chứa "kháng sinh"' };
});
await tc('SRC-06', 'Lịch sử tìm kiếm', async () => {
  const { page, close } = await open('desktop');
  await go(page, '/tim-kiem/?q=canxi');
  await sleep(500);
  const input = await page.evaluateHandle(() => [...document.querySelectorAll('input[name="q"]')].find((i) => i.getBoundingClientRect().width > 0));
  await input.evaluate((i) => { i.value = ''; });
  await input.click(); await sleep(400);
  const has = await page.evaluate(() => [...document.querySelectorAll('.search-suggest-history-item')].some((a) => a.textContent.includes('canxi')));
  let removed = false;
  if (has) {
    await page.click('.search-suggest-remove'); await sleep(400);
    removed = !(await page.evaluate(() => [...document.querySelectorAll('.search-suggest-history-item')].some((a) => a.textContent.includes('canxi'))));
  }
  await close();
  return has && removed ? {} : { fail: `hiện=${has} xóa được=${removed}` };
});
await tc('SRC-07', 'Từ khóa không có kết quả', async () => {
  const { page, errors, close } = await open('desktop');
  await go(page, '/tim-kiem/?q=zzzqqqxx');
  const ok = await page.waitForFunction(() => { const e = document.getElementById('searchEmpty'); return e && !e.hidden; }, { timeout: 20000 }).then(() => true, () => false);
  await close();
  return ok && !errors.some((e) => e.startsWith('PAGEERROR')) ? {} : { fail: `thông báo trống=${ok}, lỗi=${errors.join(';')}` };
});

// ========== 4. PRD ==========
await tc('PRD-01', 'Trang sản phẩm có breadcrumb, giá, nút mua, cảnh báo', async () => {
  const bad = [];
  for (const p of productPages) {
    if (!p.html.includes('class="breadcrumb"')) bad.push(`${p.route} thiếu breadcrumb`);
    if (!/class="product-price product-price-lg"/.test(p.html)) bad.push(`${p.route} thiếu giá`);
    if ((p.html.match(/data-add-to-cart/g) || []).length < 2) bad.push(`${p.route} thiếu nút mua`);
    if (!p.html.includes('class="product-notice"')) bad.push(`${p.route} thiếu cảnh báo`);
  }
  return verdict(bad, `${productPages.length} sản phẩm`);
});
await tc('PRD-02', 'Nhãn "-X%" đúng', async () => {
  const bad = [];
  let n = 0;
  for (const p of productPages) {
    const c = catalog[productSlug(p)];
    if (!c?.originalPrice || c.originalPrice <= c.price) continue;
    n++;
    const want = Math.round((1 - c.price / c.originalPrice) * 100);
    const m = p.html.match(/class="sale-badge"[^>]*>\s*-(\d+)%/);
    if (!m || Number(m[1]) !== want) bad.push(`${productSlug(p)}: hiện ${m?.[1]}% cần ${want}%`);
  }
  return verdict(bad, `${n} sản phẩm khuyến mãi`);
});
await tc('PRD-03', 'JSON-LD offers khớp bảng giá', async () => {
  const bad = [];
  for (const p of productPages) {
    const blocks = [...p.html.matchAll(/<script type="application\/ld\+json">([^<]*)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const prod = blocks.find((b) => b['@type'] === 'Product');
    const c = catalog[productSlug(p)];
    if (!prod) { bad.push(`${p.route} thiếu Product`); continue; }
    if (c.price) {
      if (prod.offers?.price !== c.price) bad.push(`${productSlug(p)} offers.price=${prod.offers?.price} cần ${c.price}`);
      if (prod.offers?.priceCurrency !== 'VND') bad.push(`${productSlug(p)} tiền tệ`);
      if ('availability' in (prod.offers ?? {})) bad.push(`${productSlug(p)} có availability`);
    } else if (prod.offers) bad.push(`${productSlug(p)} không có giá mà có offers`);
  }
  return verdict(bad);
});
for (const vp of ['desktop', 'mobile']) {
  await tc(`PRD-04 ${vp}`, 'Thanh mua hàng dính', async () => {
    const bad = [];
    // Lấy 3 sản phẩm: đầu, giữa và trang có HTML dài nhất (bảng thành phần dài)
    const longest = [...productPages].sort((a, b) => b.html.length - a.html.length)[0];
    for (const p of [productPages[0], productPages[Math.floor(productPages.length / 2)], longest]) {
      const { page, close } = await open(vp);
      await go(page, p.route); await sleep(800);
      if (await isVisible(page, '#stickyBuyBar')) bad.push(`${productSlug(p)}: hiện ngay lúc tải`);
      await page.evaluate(async () => {
        const a = document.querySelector('.product-info .actions');
        while (a.getBoundingClientRect().bottom > -200) { window.scrollBy(0, 300); await new Promise((r) => setTimeout(r, 100)); }
      });
      await sleep(700);
      if (!(await isVisible(page, '#stickyBuyBar'))) bad.push(`${productSlug(p)}: không hiện sau khi cuộn`);
      await close();
    }
    return verdict(bad);
  });
}
await tc('PRD-05', 'Sản phẩm liên quan ≤8, không có chính nó', async () => {
  const bad = [];
  for (const p of productPages) {
    const sec = p.html.split('class="related-products"')[1];
    if (!sec) continue;
    const part = sec.split('</section>')[0];
    const links = [...new Set([...part.matchAll(/href="(\/[^"]+\/[^"]+\/)"/g)].map((m) => m[1]).filter((h) => !h.includes('/nhom/')))];
    if (links.length > 8) bad.push(`${productSlug(p)}: ${links.length}`);
    if (links.includes(p.route)) bad.push(`${productSlug(p)}: có chính nó`);
  }
  return verdict(bad);
});
await tc('PRD-06', 'Sản phẩm nháp không lọt ra ngoài', async () => {
  const dir = path.join(ROOT, 'src/content/products');
  const drafts = fs.readdirSync(dir).filter((f) => /^draft:\s*true/m.test(fs.readFileSync(path.join(dir, f), 'utf8'))).map((f) => f.replace(/\.md$/, ''));
  const sitemap = fs.readFileSync(path.join(distDir, 'sitemap-0.xml'), 'utf8');
  const bad = [];
  for (const d of drafts) {
    if (catalog[d]) bad.push(`${d} trong san-pham.json`);
    if (productPages.some((p) => productSlug(p) === d)) bad.push(`${d} có trang`);
    if (sitemap.includes(`/${d}/`)) bad.push(`${d} trong sitemap`);
  }
  return verdict(bad, `${drafts.length} sản phẩm nháp`);
});
await tc('PRD-07', 'san-pham.json khớp trang sản phẩm', async () => {
  const bad = [];
  const slugs = productPages.map(productSlug);
  for (const s of slugs) if (!catalog[s]) bad.push(`${s} thiếu trong json`);
  for (const s of Object.keys(catalog)) if (!slugs.includes(s)) bad.push(`${s} trong json nhưng không có trang`);
  for (const p of productPages) {
    const c = catalog[productSlug(p)];
    const m = p.html.match(/class="product-price product-price-lg"[^>]*>([^<]+)</);
    if (c?.price && vndNum(m?.[1]) !== c.price) bad.push(`${productSlug(p)}: trang ${m?.[1]} json ${c.price}`);
  }
  return verdict(bad, `${slugs.length} sản phẩm`);
});
await tc('PRD-08', 'Nhãn xuất xứ và "-X%" không chồng nhau, không đè ảnh (375px)', async () => {
  const { page, close } = await open('mobile');
  await go(page, '/thuc-pham-chuc-nang/');
  await scrollAll(page);
  const bad = await page.evaluate(() => {
    const out = [];
    for (const card of document.querySelectorAll('.product-card')) {
      const o = card.querySelector('.origin-badge')?.getBoundingClientRect();
      const s = card.querySelector('.sale-badge-card')?.getBoundingClientRect();
      const img = card.querySelector('.product-thumb')?.getBoundingClientRect();
      const name = card.querySelector('a[href]')?.getAttribute('href');
      if (o && s && o.right > s.left && o.bottom > s.top && s.bottom > o.top) out.push(`${name}: 2 nhãn chồng nhau`);
      for (const b of [o, s]) if (b && img && b.bottom > img.top + 1) out.push(`${name}: nhãn đè ảnh`);
    }
    return out;
  });
  await close();
  return verdict([...new Set(bad)]);
});
await tc('PRD-09', 'Không có chữ cấm trong nội dung sản phẩm/bài viết', async () => {
  const banned = [/chữa khỏi/i, /thần dược/i, /100% hiệu quả/i, /không (có )?tác dụng phụ/i, /khỏi bệnh/i];
  const bad = [];
  for (const dir of ['src/content/products', 'src/content/posts']) {
    for (const f of fs.readdirSync(path.join(ROOT, dir))) {
      const text = fs.readFileSync(path.join(ROOT, dir, f), 'utf8');
      if (/^draft:\s*true/m.test(text)) continue;
      for (const re of banned) {
        for (const line of text.split('\n')) {
          if (re.test(line) && !/không (thay thế|phải là)|không hứa|không có nghĩa|cảnh giác|tránh/i.test(line)) bad.push(`${f}: "${line.trim().slice(0, 90)}"`);
        }
      }
    }
  }
  return verdict(bad);
});
await tc('PRD-10', 'Chưa có đánh giá: hiện thông báo, ẩn dòng tóm tắt sao', async () => {
  const { page, close } = await open('desktop');
  await go(page, productPages[0].route); await sleep(800);
  const r = await page.evaluate(() => ({ empty: !document.getElementById('reviewsEmpty')?.hidden, summary: !document.querySelector('.rating-summary-line')?.hidden }));
  await close();
  return r.empty && !r.summary ? {} : { fail: `thông báo trống=${r.empty} dòng tóm tắt hiện=${r.summary}` };
});
await tc('PRD-11', 'Viết đánh giá khi chưa đăng nhập mở khung đăng nhập', async () => {
  const { page, close } = await open('desktop');
  await go(page, productPages[0].route); await sleep(800);
  await page.evaluate(() => document.getElementById('reviewsOpenFormBtn').scrollIntoView());
  await page.click('#reviewsOpenFormBtn'); await sleep(800);
  const ok = await isVisible(page, '#account-modal');
  await close();
  return ok ? {} : { fail: 'khung đăng nhập không mở' };
});

// ========== 5. CART ==========
await tc('CART-01', 'Thêm vào giỏ ở trang sản phẩm', async () => {
  const { page, close } = await open('desktop');
  const route = pageOf(cheap[0]);
  await go(page, route);
  const btn = await page.evaluateHandle(() => [...document.querySelectorAll('[data-add-to-cart]')].find((b) => b.getBoundingClientRect().width > 0 && !/mua ngay/i.test(b.textContent)));
  await btn.click(); await sleep(1500);
  const badge = await page.evaluate(() => [...document.querySelectorAll('.cart-badge')].map((b) => b.textContent.trim()).filter(Boolean)[0]);
  await go(page, '/gio-hang/'); await sleep(600);
  const names = await page.evaluate(() => [...document.querySelectorAll('#cart-list .cart-name')].map((e) => e.textContent));
  await close();
  return badge === '1' && names.length === 1 ? {} : { fail: `số trên giỏ=${badge}, dòng trong giỏ=${names.length}` };
});
await tc('CART-02', 'Giỏ trống có liên kết tra cứu', async () => {
  const { page, close } = await open('mobile');
  await go(page, '/gio-hang/');
  const r = await page.evaluate(() => ({ empty: !document.getElementById('cart-empty').hidden, form: !document.getElementById('order-form').hidden, link: !!document.querySelector('.cart-empty-lookup a[href="/tra-cuu-don-hang/"]') }));
  await close();
  return r.empty && !r.form && r.link ? {} : { fail: JSON.stringify(r) };
});
async function summaryOf(items, vp = 'desktop') {
  const { page, close } = await open(vp, { storage: cartStorage(items) });
  await go(page, '/gio-hang/'); await sleep(500);
  const s = await page.evaluate(() => ({
    total: document.getElementById('cart-total').textContent,
    ship: document.getElementById('cart-shipping').textContent,
    original: document.getElementById('cart-original-total').textContent,
    discountShown: !document.getElementById('cart-discount-row').hidden,
    discount: document.getElementById('cart-discount').textContent,
    voucher: document.querySelector('.checkout-summary')?.innerText.match(/voucher\s*([^\n]+)/i)?.[1]?.trim(),
  }));
  return { s, page, close };
}
await tc('CART-03', 'Dưới 350.000đ: ship 20.000đ', async () => {
  const { s, close } = await summaryOf([cartItem(cheap[0], 1)]);
  await close();
  const p = catalog[cheap[0]].price;
  return vndNum(s.ship) === 20000 && vndNum(s.total) === p + 20000 ? { info: `${p} + 20000` } : { fail: JSON.stringify(s) };
});
await tc('CART-04', 'Từ 350.000đ: miễn phí ship', async () => {
  const qty = Math.ceil(350000 / catalog[cheap[0]].price);
  const { s, close } = await summaryOf([cartItem(cheap[0], qty)]);
  await close();
  return /miễn phí/i.test(s.ship) && vndNum(s.total) === catalog[cheap[0]].price * qty ? {} : { fail: JSON.stringify(s) };
});
await tc('CART-05', 'Giảm giá trực tiếp và voucher', async () => {
  const [slug, c] = onSale;
  const { s, close } = await summaryOf([cartItem(slug, 2)]);
  await close();
  const want = (c.originalPrice - c.price) * 2;
  const bad = [];
  if (!s.discountShown || vndNum(s.discount) !== want) bad.push(`giảm trực tiếp ${s.discount} cần ${want}`);
  if (vndNum(s.original) !== c.originalPrice * 2) bad.push(`tổng giá gốc ${s.original}`);
  if (!s.voucher || vndNum(s.voucher) !== 0) bad.push(`voucher "${s.voucher}"`);
  return verdict(bad);
});
await tc('CART-06', 'Không vượt quá 20', async () => {
  const { page, close } = await open('desktop', { storage: cartStorage([cartItem(cheap[0], 19)]) });
  await go(page, '/gio-hang/');
  for (let i = 0; i < 3; i++) { await page.click('#cart-list button[data-action="inc"]'); await sleep(150); }
  const v = await page.$eval('#cart-list input[type=number]', (i) => i.value);
  await page.$eval('#cart-list input[type=number]', (i) => { i.value = '99'; i.dispatchEvent(new Event('change', { bubbles: true })); });
  await sleep(300);
  const v2 = await page.$eval('#cart-list input[type=number]', (i) => i.value);
  await close();
  return v === '20' && v2 === '20' ? {} : { fail: `bấm + = ${v}, gõ 99 = ${v2}` };
});
await tc('CART-07', 'Xóa sản phẩm', async () => {
  const { page, close } = await open('desktop', { storage: cartStorage([cartItem(cheap[0], 1), cartItem(onSale[0], 1)]) });
  await go(page, '/gio-hang/');
  await page.click('#cart-list button[data-action="remove"]'); await sleep(300);
  const n1 = await page.$$eval('#cart-list .cart-item', (e) => e.length);
  await page.click('#cart-list button[data-action="remove"]'); await sleep(300);
  const empty = await page.evaluate(() => !document.getElementById('cart-empty').hidden);
  await close();
  return n1 === 1 && empty ? {} : { fail: `còn ${n1} dòng, trống=${empty}` };
});
await tc('CART-08', 'Khung QR chuyển khoản', async () => {
  const { page, close } = await open('desktop', { storage: cartStorage([cartItem(cheap[0], 1)]) });
  await go(page, '/gio-hang/');
  const hiddenBefore = await page.evaluate(() => document.getElementById('bank-qr-box').hidden);
  await page.click('input[name="payment_method"][value="bank"]'); await sleep(300);
  const r = await page.evaluate(() => ({ hidden: document.getElementById('bank-qr-box').hidden, src: document.getElementById('bank-qr-img').src, code: document.getElementById('bank-qr-order-id').textContent }));
  await page.click('input[name="payment_method"][value="cod"]'); await sleep(200);
  const hiddenAfter = await page.evaluate(() => document.getElementById('bank-qr-box').hidden);
  await close();
  const want = catalog[cheap[0]].price + 20000;
  const amount = new URL(r.src).searchParams.get('amount');
  const info = new URL(r.src).searchParams.get('addInfo');
  const bad = [];
  if (!hiddenBefore) bad.push('hiện sẵn khi chưa chọn');
  if (r.hidden) bad.push('không hiện khi chọn chuyển khoản');
  if (Number(amount) !== want) bad.push(`amount=${amount} cần ${want}`);
  if (!info?.includes(r.code.replace('#', ''))) bad.push('nội dung CK thiếu mã đơn');
  if (!hiddenAfter) bad.push('không ẩn khi đổi sang tiền mặt');
  return verdict(bad);
});

// ========== 6. ORD ==========
const GOOD = { orderer_name: 'Nguyễn Văn Test', orderer_phone: '0912345678', orderer_email: 'test@gmail.com', recipient_name: 'Trần Thị Nhận', recipient_phone: '0987654321', address: '1 Đường Thử, Hà Nội' };
async function fillForm(page, values, consent = true) {
  await page.evaluate((v, c) => {
    const f = document.getElementById('order-form');
    for (const [k, val] of Object.entries(v)) { const i = f.querySelector(`[name="${k}"]`); i.value = val; }
    f.querySelector('[name="consent"]').checked = c;
  }, values, consent);
}
const submit = (page) => page.evaluate(() => document.querySelector('#order-form button[type="submit"]').click());
const fieldErrors = (page) => page.evaluate(() => Object.fromEntries([...document.querySelectorAll('#order-form .field-error.is-visible')].map((e) => [e.dataset.for, e.textContent])));

for (const vp of ['desktop', 'mobile']) {
  await tc(`ORD-01 ${vp}`, 'Để trống: lỗi tiếng Việt ở mọi ô bắt buộc, không gọi máy chủ', async () => {
    const { page, calls, close } = await open(vp, { storage: cartStorage([cartItem(cheap[0])]) });
    await go(page, '/gio-hang/');
    let dialog = false;
    page.on('dialog', () => { dialog = true; });
    await submit(page); await sleep(500);
    const errs = await fieldErrors(page);
    const tooltip = await page.evaluate(() => [...document.querySelectorAll('#order-form input')].some((i) => i.validationMessage && /please|fill/i.test(i.validationMessage) && document.activeElement === i && false));
    await close();
    const need = ['orderer_name', 'orderer_phone', 'orderer_email', 'recipient_name', 'recipient_phone', 'address', 'consent'];
    const bad = need.filter((n) => !errs[n]).map((n) => `thiếu lỗi ${n}`);
    for (const [k, v] of Object.entries(errs)) if (/[a-z]{4,}\s[a-z]{4,}/.test(v) && !/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(v)) bad.push(`${k} không phải tiếng Việt: ${v}`);
    if (calls.some((c) => c.url.includes('/functions/'))) bad.push('đã gọi máy chủ');
    if (dialog || tooltip) bad.push('có hộp thoại trình duyệt');
    return verdict(bad);
  });
}
await tc('ORD-02', 'SĐT sai', async () => {
  const bad = [];
  for (const phone of ['123', 'abcdefghij', '09123']) {
    const { page, close } = await open('desktop', { storage: cartStorage([cartItem(cheap[0])]) });
    await go(page, '/gio-hang/');
    await fillForm(page, { ...GOOD, orderer_phone: phone });
    await submit(page); await sleep(300);
    const e = (await fieldErrors(page)).orderer_phone;
    if (!/SĐT chưa đúng/.test(e ?? '')) bad.push(`${phone}: "${e}"`);
    await close();
  }
  return verdict(bad);
});
await tc('ORD-03', 'Email sai báo đúng câu', async () => {
  const cases = [
    ['', 'Vui lòng nhập email.'], ['abc@gmail', 'Email chưa đúng'], ['te..n@gmail.com', 'Email chưa đúng'], ['thương@gmail.com', 'Email chưa đúng'],
    ['ten@gmail.con', 'Có phải là @gmail.com?'], ['ten@-abc.com', 'Email chưa đúng'], ['a b@gmail.com', 'Email'], ['.ten@gmail.com', 'Email chưa đúng'],
  ];
  const bad = [];
  const { page, close } = await open('desktop', { storage: cartStorage([cartItem(cheap[0])]) });
  await go(page, '/gio-hang/');
  for (const [email, want] of cases) {
    await fillForm(page, { ...GOOD, orderer_email: email });
    await submit(page); await sleep(250);
    const e = (await fieldErrors(page)).orderer_email ?? '';
    if (!e.includes(want)) bad.push(`"${email}": "${e}"`);
  }
  await close();
  return verdict(bad, `${cases.length} email`);
});
const successMock = (store) => (u, r) => {
  if (u.includes('/functions/v1/send-order-email')) { store.body = JSON.parse(r.postData()); return { body: { ok: true, customerEmailSent: true } }; }
};
await tc('ORD-04', 'Email viết hoa được chuyển về chữ thường', async () => {
  const store = {};
  const { page, close } = await open('desktop', { storage: cartStorage([cartItem(cheap[0])]), mock: successMock(store) });
  await go(page, '/gio-hang/');
  await fillForm(page, { ...GOOD, orderer_email: '  Ten@Gmail.COM ' });
  await submit(page); await sleep(1200);
  await close();
  return store.body?.ordererEmail === 'ten@gmail.com' ? {} : { fail: `gửi lên "${store.body?.ordererEmail}"` };
});
for (const vp of ['desktop', 'mobile']) {
  await tc(`ORD-05 ${vp}`, 'Báo lỗi không làm lệch bố cục', async () => {
    const { page, close } = await open(vp, { storage: cartStorage([cartItem(cheap[0])]) });
    await go(page, '/gio-hang/');
    const pos = () => page.evaluate(() => [...document.querySelectorAll('#order-form input:not([type=hidden]):not([name=_gotcha]), #order-form textarea')].map((i) => Math.round(i.getBoundingClientRect().top + scrollY)));
    const before = await pos();
    // Chiều cao chỗ báo lỗi lúc CHƯA có lỗi (chỗ đã dành sẵn)
    const baseHeights = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('#order-form .field-error')].map((e) => [e.dataset.for, e.getBoundingClientRect().height])));
    await fillForm(page, { ...GOOD, orderer_email: 'ten@gmail.con', orderer_phone: '123', address: '' }, false);
    await submit(page); await sleep(800);
    const after = await pos();
    // Câu lỗi nào cao hơn chỗ dành sẵn (xuống 2 dòng) là nguyên nhân làm lệch bố cục
    const wrappedNow = () => page.evaluate((base) => [...document.querySelectorAll('#order-form .field-error.is-visible')]
      .filter((e) => e.getBoundingClientRect().height > base[e.dataset.for] + 1)
      .map((e) => `${e.dataset.for} xuống dòng: "${e.textContent}"`), baseHeights);
    const wrapped = await wrappedNow();
    // Kịch bản 2: để trống mọi ô
    await fillForm(page, { orderer_name: '', orderer_phone: '', orderer_email: '', recipient_name: '', recipient_phone: '', address: '' }, false);
    await submit(page); await sleep(800);
    const after2 = await pos();
    wrapped.push(...(await wrappedNow()));
    await close();
    const diff = before.map((b, i) => after[i] - b).filter((d) => d !== 0);
    const diff2 = before.map((b, i) => after2[i] - b).filter((d) => d !== 0);
    return verdict([diff.length && `sai định dạng: lệch ${diff.join(',')}px`, diff2.length && `để trống: lệch ${diff2.join(',')}px`, ...new Set(wrapped)].filter(Boolean));
  });
}
await tc('ORD-06', 'Gõ lại thì lỗi biến mất', async () => {
  const { page, close } = await open('desktop', { storage: cartStorage([cartItem(cheap[0])]) });
  await go(page, '/gio-hang/');
  await submit(page); await sleep(300);
  await page.type('#order-form [name="orderer_name"]', 'A');
  const e = (await fieldErrors(page)).orderer_name;
  await close();
  return e ? { fail: `vẫn còn "${e}"` } : {};
});
for (const vp of ['desktop', 'mobile']) {
  await tc(`ORD-07 ${vp}`, 'Đặt hàng thành công (giả lập)', async () => {
    const store = {};
    const { page, close } = await open(vp, { storage: cartStorage([cartItem(cheap[0])]), mock: successMock(store) });
    await go(page, '/gio-hang/');
    await fillForm(page, GOOD);
    await submit(page); await sleep(1500);
    const r = await page.evaluate(() => ({
      shown: !document.getElementById('order-result').hidden,
      text: document.getElementById('order-result').innerText,
      link: document.querySelector('#order-result a')?.getAttribute('href'),
      cart: localStorage.getItem('duocsithuong-cart'),
      ovf: document.documentElement.scrollWidth - innerWidth,
    }));
    await close();
    const bad = [];
    if (!r.shown) bad.push('không hiện thông báo');
    if (!r.text.includes(store.body?.orderId ?? '???')) bad.push('thiếu mã đơn');
    if (!r.text.includes('test@gmail.com')) bad.push('không nhắc email');
    if (r.link !== `/tra-cuu-don-hang/?ma=${store.body?.orderId}`) bad.push(`liên kết tra cứu ${r.link}`);
    if (r.cart && r.cart !== '[]') bad.push('giỏ chưa xóa');
    if (r.ovf > 0) bad.push(`tràn ${r.ovf}px`);
    return verdict(bad);
  });
}
await tc('ORD-08', 'Máy chủ từ chối: hiện lý do + Zalo, giữ giỏ', async () => {
  const { page, close } = await open('desktop', {
    storage: cartStorage([cartItem(cheap[0])]),
    mock: (u) => (u.includes('/functions/v1/send-order-email') ? { status: 429, body: { error: 'Bạn đã gửi quá nhiều đơn.' } } : undefined),
  });
  await go(page, '/gio-hang/');
  await fillForm(page, GOOD);
  await submit(page); await sleep(1500);
  const r = await page.evaluate(() => {
    const e = document.querySelector('#order-form .order-error');
    return { shown: !e.hidden, text: e.textContent, zalo: e.querySelector('a')?.getAttribute('href'), cart: JSON.parse(localStorage.getItem('duocsithuong-cart') || '[]').length };
  });
  await close();
  const bad = [];
  if (!r.shown) bad.push('không hiện lỗi');
  if (!r.text.includes('quá nhiều đơn')) bad.push(`không hiện lý do: ${r.text}`);
  if (!r.zalo?.includes('zalo.me')) bad.push('thiếu Zalo');
  if (r.cart !== 1) bad.push('giỏ bị xóa');
  return verdict(bad);
});
await tc('ORD-09', 'Dữ liệu gửi lên máy chủ', async () => {
  const store = {};
  const { page, close } = await open('desktop', { storage: cartStorage([cartItem(cheap[0], 2)]), mock: successMock(store) });
  await go(page, '/gio-hang/');
  await page.click('input[name="payment_method"][value="bank"]');
  const code = (await page.$eval('#bank-qr-order-id', (e) => e.textContent)).replace('#', '');
  await fillForm(page, GOOD);
  await submit(page); await sleep(1200);
  await close();
  const b = store.body ?? {};
  const bad = [];
  if (b.orderId !== code) bad.push(`orderId ${b.orderId} khác mã QR ${code}`);
  if (b.paymentMethod !== 'bank') bad.push('paymentMethod');
  if (b.items?.[0]?.id !== cheap[0] || b.items?.[0]?.qty !== 2) bad.push('items');
  if (b.ordererEmail !== 'test@gmail.com') bad.push('email');
  return verdict(bad);
});
await tc('ORD-10', 'Ô ẩn chống bot', async () => {
  const { page, close } = await open('desktop', { storage: cartStorage([cartItem(cheap[0])]) });
  await go(page, '/gio-hang/');
  const r = await page.evaluate(() => { const i = document.querySelector('[name="_gotcha"]'); if (!i) return 'không có'; const rect = i.getBoundingClientRect(); const s = getComputedStyle(i.closest('label') ?? i); return rect.width > 1 && s.display !== 'none' && s.visibility !== 'hidden' && rect.left >= 0 ? 'đang hiện' : 'ok'; });
  await close();
  return r === 'ok' ? {} : { fail: r };
});
await tc('ORD-11', 'Site thật có ô Turnstile', async () => {
  const html = await (await fetch(LIVE_SITE + '/gio-hang/')).text();
  return /class="cf-turnstile/.test(html) && html.includes('challenges.cloudflare.com/turnstile') ? {} : { fail: 'không thấy Turnstile' };
});

// ========== 7. API (máy chủ thật) ==========
const fnCall = (name, body, headers = {}) =>
  fetch(`${SB_URL}/functions/v1/${name}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', apikey: SB_KEY, authorization: `Bearer ${SB_KEY}`, origin: LIVE_SITE, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  }).then(async (r) => ({ status: r.status, json: await r.json().catch(() => ({})), headers: r.headers }));
const ORDER = {
  orderId: 'TESTCASE' + Date.now().toString(36).toUpperCase(),
  items: [{ id: cheap[0], name: 'x', qty: 1, price: 1 }],
  ordererName: 'Test Case', ordererPhone: '0912345678', ordererEmail: 'test@gmail.com',
  name: 'Test Case', phone: '0912345678', address: 'Địa chỉ thử', note: '', hideProductName: false, paymentMethod: 'cod',
};
const expect = async (body, status, re) => {
  const r = await fnCall('send-order-email', body);
  if (r.status !== status) return `cần ${status}, nhận ${r.status} ${JSON.stringify(r.json).slice(0, 120)}`;
  if (re && !re.test(r.json.error ?? '')) return `thông báo "${r.json.error}"`;
  return null;
};
await tc('API-01', 'Body không phải JSON → 400', async () => verdict([await expect('{not json', 400)].filter(Boolean)));
await tc('API-02', 'Email sai → 400', async () => {
  const bad = [];
  for (const e of ['', 'abc@gmail', 'te..n@gmail.com', 'thương@gmail.com', 'ten@gmail.con']) {
    const p = await expect({ ...ORDER, ordererEmail: e }, 400, /email|Có phải/i);
    if (p) bad.push(`"${e}": ${p}`);
  }
  return verdict(bad);
});
await tc('API-03', 'SĐT sai → 400', async () => verdict([await expect({ ...ORDER, phone: '12' }, 400, /Số điện thoại/)].filter(Boolean)));
await tc('API-04', 'Sản phẩm không có trong bảng giá → 400', async () => verdict([await expect({ ...ORDER, items: [{ id: 'khong-co-san-pham-nay', qty: 1 }] }, 400)].filter(Boolean)));
await tc('API-05', 'Số lượng 0 / 21 → 400', async () => verdict([await expect({ ...ORDER, items: [{ id: cheap[0], qty: 0 }] }, 400), await expect({ ...ORDER, items: [{ id: cheap[0], qty: 21 }] }, 400)].filter(Boolean)));
await tc('API-06', 'Hình thức thanh toán lạ → 400', async () => verdict([await expect({ ...ORDER, paymentMethod: 'bitcoin' }, 400)].filter(Boolean)));
await tc('API-07', 'Không có mã Turnstile → 403', async () => verdict([await expect(ORDER, 403, /robot/)].filter(Boolean)));
await tc('API-08', 'Mã đơn có ký tự lạ → 400', async () => verdict([await expect({ ...ORDER, orderId: '<script>' }, 400)].filter(Boolean)));

// ========== 8. FN ==========
await tc('FN-01', 'notify-order-status từ chối khi không có quyền', async () => {
  const bad = [];
  const body = { orderId: '00000000-0000-0000-0000-000000000000' };
  const noAuth = await fetch(`${SB_URL}/functions/v1/notify-order-status`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  if (noAuth.status !== 401) bad.push(`không đăng nhập: ${noAuth.status}`);
  const anon = await fnCall('notify-order-status', body);
  if (anon.status !== 401 && anon.status !== 403) bad.push(`khóa anon: ${anon.status}`);
  const fake = await fnCall('notify-order-status', body, { authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4In0.abc' });
  if (fake.status !== 401) bad.push(`JWT giả: ${fake.status}`);
  return verdict(bad);
});
await tc('FN-02', 'manage-product từ chối khi không có quyền', async () => {
  const bad = [];
  const noAuth = await fetch(`${SB_URL}/functions/v1/manage-product`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"action":"list"}' });
  if (noAuth.status !== 401) bad.push(`không đăng nhập: ${noAuth.status}`);
  const anon = await fnCall('manage-product', { action: 'list' });
  if (anon.status !== 401 && anon.status !== 403) bad.push(`khóa anon: ${anon.status}`);
  return verdict(bad);
});
await tc('FN-03', 'notify-chat-message với hội thoại không tồn tại', async () => {
  const r = await fnCall('notify-chat-message', { conversationId: '00000000-0000-0000-0000-000000000000' });
  return r.status >= 500 ? { fail: `${r.status} ${JSON.stringify(r.json).slice(0, 120)}` } : { info: `${r.status} ${JSON.stringify(r.json).slice(0, 80)}` };
});

// ========== 9. LK ==========
await tc('LK-01', 'Điền sẵn mã đơn từ ?ma=', async () => {
  const { page, close } = await open('mobile');
  await go(page, '/tra-cuu-don-hang/?ma=ABC123');
  const v = await page.$eval('#lookupCode', (i) => i.value);
  await close();
  return v === 'ABC123' ? {} : { fail: `"${v}"` };
});
await tc('LK-02', 'Bấm tra cứu khi trống', async () => {
  const { page, calls, close } = await open('desktop');
  await go(page, '/tra-cuu-don-hang/');
  await page.click('#lookupBtn'); await sleep(400);
  const e = await page.evaluate(() => { const x = document.getElementById('lookupError'); return x.hidden ? '' : x.textContent; });
  await close();
  return e.includes('Vui lòng nhập') && !calls.some((c) => c.url.includes('lookup_order')) ? {} : { fail: `"${e}"` };
});
for (const vp of ['desktop', 'mobile']) {
  await tc(`LK-03 ${vp}`, 'Hiện đơn, chữ khách nhập không chạy HTML', async () => {
    const order = { order_code: 'ABC123', created_at: '2026-10-29T03:00:00Z', customer_name: '<img src=x onerror="window.__xss=1">Khách', status: 'dang_giao', status_updated_at: '2026-10-29T05:00:00Z', items: [{ name: '<b>SP</b>', qty: 2, price: 100000 }], shipping: 20000, total: 200000, payment_method: 'cod' };
    const { page, close } = await open(vp, { mock: (u) => (u.includes('/rpc/lookup_order') ? { body: [order] } : undefined) });
    await go(page, '/tra-cuu-don-hang/?ma=ABC123');
    await page.type('#lookupPhone', '0912345678');
    await page.click('#lookupBtn'); await sleep(800);
    const r = await page.evaluate(() => ({ shown: !document.getElementById('lookupResult').hidden, current: document.querySelector('.lookup-steps li.current')?.textContent, done: document.querySelectorAll('.lookup-steps li.done').length, xss: window.__xss, text: document.getElementById('lookupResult').innerText, ovf: document.documentElement.scrollWidth - innerWidth }));
    await close();
    const bad = [];
    if (!r.shown) bad.push('không hiện');
    if (r.done !== 2 || !/giao/i.test(r.current ?? '')) bad.push(`bước hiện tại "${r.current}", đã xong ${r.done}`);
    if (r.xss) bad.push('CHẠY ĐƯỢC HTML CỦA KHÁCH');
    if (!r.text.includes('220.000')) bad.push('thành tiền chưa cộng ship');
    if (r.ovf > 0) bad.push(`tràn ${r.ovf}px`);
    return verdict(bad);
  });
}
await tc('LK-04', 'Không tìm thấy', async () => {
  const { page, close } = await open('desktop');
  await go(page, '/tra-cuu-don-hang/?ma=ABC123');
  await page.type('#lookupPhone', '0912345678');
  await page.click('#lookupBtn'); await sleep(800);
  const e = await page.evaluate(() => { const x = document.getElementById('lookupError'); return x.hidden ? '' : x.textContent; });
  await close();
  return /Không tìm thấy/.test(e) ? {} : { fail: `"${e}"` };
});
await tc('LK-05', 'lookup_order thật với dữ liệu bịa trả rỗng', async () => {
  const r = await fetch(`${SB_URL}/rest/v1/rpc/lookup_order`, { method: 'POST', headers: { apikey: SB_KEY, authorization: `Bearer ${SB_KEY}`, 'content-type': 'application/json' }, body: JSON.stringify({ p_code: 'KHONGCO123456', p_phone: '0900000000' }) });
  const j = await r.json();
  return r.status === 200 && Array.isArray(j) && j.length === 0 ? {} : { fail: `${r.status} ${JSON.stringify(j).slice(0, 100)}` };
});

// ========== 10. ACC ==========
await tc('ACC-01', '/tai-khoan/ khi chưa đăng nhập', async () => {
  const bad = [];
  for (const vp of ['desktop', 'mobile']) {
    const { page, close } = await open(vp);
    await go(page, '/tai-khoan/'); await sleep(800);
    const r = await page.evaluate(() => {
      const w = (s) => document.querySelector(s)?.getBoundingClientRect().width ?? 0;
      return { google: !!document.getElementById('google-login-btn'), auth: !document.getElementById('auth-box').hidden, privacy: !!document.querySelector('.account-privacy-note a[href="/chinh-sach-bao-mat/"]'), email: w('#login-form input[name=email]'), pass: w('#login-form input[name=password]') };
    });
    await close();
    if (!r.google || !r.auth) bad.push(`${vp}: thiếu khung đăng nhập`);
    if (!r.privacy) bad.push(`${vp}: thiếu dòng chính sách`);
    if (Math.abs(r.email - r.pass) > 2) bad.push(`${vp}: ô mật khẩu ${r.pass}px khác ô email ${r.email}px`);
  }
  return verdict(bad);
});
await tc('ACC-02', 'Khung đăng nhập nổi', async () => {
  const { page, close } = await open('desktop');
  await go(page, '/');
  await page.click('#account-trigger'); await sleep(500);
  const r = await page.evaluate(() => ({ privacy: !!document.querySelector('#account-modal .account-privacy-note a'), lookup: !!document.querySelector('#account-modal .account-modal-lookup a[href*="tra-cuu-don-hang"]') }));
  const opened = await isVisible(page, '#account-modal');
  await page.keyboard.press('Escape'); await sleep(400);
  const closed = !(await isVisible(page, '#account-modal'));
  await close();
  return verdict([!opened && 'không mở', !r.privacy && 'thiếu chính sách', !r.lookup && 'thiếu tra cứu đơn', !closed && 'Esc không đóng'].filter(Boolean));
});
await tc('ACC-03', 'Phiên ẩn danh không coi là đã đăng nhập', async () => {
  const ref = new URL(SB_URL).hostname.split('.')[0];
  const fakeUser = { id: '11111111-1111-1111-1111-111111111111', aud: 'authenticated', role: 'authenticated', is_anonymous: true, email: '', app_metadata: {}, user_metadata: {} };
  const session = { access_token: 'x.eyJzdWIiOiIxIn0.x', refresh_token: 'r', token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user: fakeUser };
  const { page, close } = await open('desktop', { storage: { [`sb-${ref}-auth-token`]: JSON.stringify(session) }, mock: (u) => (u.includes('/auth/v1/user') ? { body: fakeUser } : undefined) });
  await go(page, '/'); await sleep(800);
  const label = await page.evaluate(() => document.getElementById('account-label')?.textContent.trim());
  await go(page, '/tai-khoan/'); await sleep(800);
  const authShown = await page.evaluate(() => !document.getElementById('auth-box').hidden);
  await close();
  return /tài khoản|đăng nhập/i.test(label ?? '') && authShown ? { info: `nhãn "${label}"` } : { fail: `nhãn "${label}", hiện khung đăng nhập=${authShown}` };
});

// ========== 11. CHAT ==========
for (const vp of ['desktop', 'mobile']) {
  await tc(`CHAT-01/02 ${vp}`, 'Khung chat mở/đóng, đủ nút, không tràn', async () => {
    const { page, close } = await open(vp);
    await go(page, '/');
    await page.click('#faqChatToggle'); await sleep(800);
    const r = await page.evaluate(() => {
      const send = document.querySelector('#faqChatForm button[type="submit"]')?.getBoundingClientRect();
      return { input: !!document.getElementById('faqChatInput'), attach: !!document.getElementById('faqChatAttachBtn'), mic: !!document.getElementById('faqChatMicBtn'), zalo: !!document.querySelector('#faqChatPanel a[href*="zalo.me"]'), sendIn: send ? send.right <= innerWidth && send.left >= 0 : false, ovf: document.documentElement.scrollWidth - innerWidth };
    });
    const opened = await isVisible(page, '#faqChatPanel');
    await page.click('#faqChatClose'); await sleep(500);
    const closed = !(await isVisible(page, '#faqChatPanel'));
    await close();
    const bad = [];
    if (!opened) bad.push('không mở');
    for (const k of ['input', 'attach', 'mic', 'zalo', 'sendIn']) if (!r[k]) bad.push(`thiếu/lệch ${k}`);
    if (r.ovf > 0) bad.push(`tràn ${r.ovf}px`);
    if (!closed) bad.push('không đóng');
    return verdict(bad);
  });
}

// ========== 12. ADM ==========
await tc('ADM-01', 'Trang quản trị khi chưa đăng nhập', async () => {
  const bad = [];
  for (const route of ['/admin/don-hang/', '/admin/tin-nhan/', '/admin/binh-luan/', '/admin/san-pham/']) {
    const html = pages.find((p) => p.route === route)?.html ?? '';
    if (!/<meta name="robots" content="noindex/.test(html)) bad.push(`${route} thiếu noindex`);
    const { page, calls, close } = await open('desktop');
    await go(page, route); await sleep(1000);
    const text = await page.evaluate(() => document.querySelector('main')?.innerText ?? document.body.innerText);
    await close();
    if (!/đăng nhập/i.test(text)) bad.push(`${route} không nhắc đăng nhập`);
    if (/0912|@gmail\.com/.test(text)) bad.push(`${route} có dữ liệu khách`);
    void calls;
  }
  return verdict(bad);
});
await tc('ADM-02', 'HTML /admin/san-pham/ không chứa sản phẩm nháp', async () => {
  const html = pages.find((p) => p.route === '/admin/san-pham/').html;
  const dir = path.join(ROOT, 'src/content/products');
  const leaked = fs.readdirSync(dir).filter((f) => /^draft:\s*true/m.test(fs.readFileSync(path.join(dir, f), 'utf8'))).map((f) => f.replace(/\.md$/, '')).filter((s) => html.includes(s));
  return verdict(leaked.map((s) => `lộ ${s}`));
});

// ========== 13. SEO ==========
await tc('SEO-01', 'Sitemap', async () => {
  const sm = fs.readFileSync(path.join(distDir, 'sitemap-0.xml'), 'utf8');
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const bad = [];
  for (const p of productPages) if (!locs.includes(p.route)) bad.push(`thiếu ${p.route}`);
  for (const l of locs) {
    if (/^\/(admin|gio-hang|tai-khoan)\//.test(l)) bad.push(`có ${l}`);
    const pg = pages.find((p) => p.route === l);
    if (pg && /<meta name="robots" content="noindex/.test(pg.html)) bad.push(`trang noindex trong sitemap: ${l}`);
  }
  return verdict(bad, `${locs.length} URL`);
});
await tc('SEO-02', 'robots.txt', async () => {
  const t = fs.readFileSync(path.join(distDir, 'robots.txt'), 'utf8');
  return /Sitemap: https:\/\/duocsithuong\.com\/sitemap-index\.xml/.test(t) ? {} : { fail: t.slice(0, 200) };
});
await tc('SEO-03', 'Bài viết: ngày, nguồn, miễn trừ; bản xem thử có noindex', async () => {
  const bad = [];
  for (const p of postPages) {
    const html = p.html;
    if (!/Đăng ngày [0-9]/.test(html) || !/Cập nhật [0-9]/.test(html)) bad.push(`${p.route} thiếu ngày đăng/cập nhật`);
    if (!/[Nn]guồn tham khảo/.test(html)) bad.push(`${p.route} thiếu nguồn`);
    if (!/chỉ mang tính chất tham khảo/.test(html.split('<footer')[0])) bad.push(`${p.route} thiếu miễn trừ trong bài`);
    const preview = /Bản xem thử/.test(html);
    if (preview && !/<meta name="robots" content="noindex/.test(html)) bad.push(`${p.route} bản xem thử thiếu noindex`);
  }
  return verdict(bad, `${postPages.length} bài`);
});
await tc('SEO-04', 'Chính sách bảo mật có ngày, không noindex', async () => {
  const html = pages.find((p) => p.route === '/chinh-sach-bao-mat/').html;
  return /Ngày đăng:/.test(html) && /Cập nhật lần cuối:/.test(html) && !/content="noindex/.test(html) ? {} : { fail: 'thiếu ngày hoặc có noindex' };
});
await tc('SEO-05', 'og:image tuyệt đối', async () => {
  const bad = pages.filter((p) => p.route !== '/404' && !/<meta property="og:image" content="https:\/\//.test(p.html)).map((p) => p.route);
  return verdict(bad);
});

// ========== 14. SEC ==========
const rest = (pathq, init = {}) => fetch(`${SB_URL}/rest/v1/${pathq}`, { ...init, headers: { apikey: SB_KEY, authorization: `Bearer ${SB_KEY}`, 'content-type': 'application/json', ...(init.headers ?? {}) } });
await tc('SEC-01', 'Khóa anon không đọc được bảng riêng tư', async () => {
  const bad = [];
  for (const t of ['orders', 'profiles', 'conversations', 'messages', 'order_rate_log', 'zalo_oa_tokens']) {
    const r = await rest(`${t}?select=*&limit=1`);
    const j = await r.json().catch(() => null);
    if (r.status === 200 && Array.isArray(j) && j.length > 0) bad.push(`${t}: ĐỌC ĐƯỢC DỮ LIỆU`);
  }
  return verdict(bad);
});
await tc('SEC-02', 'Khóa anon không ghi được đánh giá/đơn', async () => {
  const bad = [];
  const rv = await rest('product_reviews', { method: 'POST', body: JSON.stringify({ product_slug: cheap[0], user_id: '11111111-1111-1111-1111-111111111111', rating: 5, body: 'test', author_name: 'Dược Sĩ Thương' }), headers: { prefer: 'return=minimal' } });
  if (rv.status < 400) bad.push(`product_reviews: ${rv.status}`);
  const od = await rest('orders', { method: 'POST', body: JSON.stringify({ customer_name: 'x', phone: '0912345678', address: 'x', items: [] }), headers: { prefer: 'return=minimal' } });
  if (od.status < 400) bad.push(`orders: ${od.status}`);
  return verdict(bad);
});
await tc('SEC-03', 'Khóa anon không liệt kê được tệp chat', async () => {
  const r = await fetch(`${SB_URL}/storage/v1/object/list/chat-attachments`, { method: 'POST', headers: { apikey: SB_KEY, authorization: `Bearer ${SB_KEY}`, 'content-type': 'application/json' }, body: JSON.stringify({ prefix: '', limit: 5 }) });
  const j = await r.json().catch(() => null);
  return r.status === 200 && Array.isArray(j) && j.length > 0 ? { fail: `liệt kê được ${j.length} mục` } : { info: `${r.status}` };
});
await tc('SEC-04', 'dist/ không có khóa bí mật, source map', async () => {
  const bad = [];
  for (const f of allFiles) {
    if (f.endsWith('.map')) bad.push(`source map ${path.relative(distDir, f)}`);
    if (!/\.(html|js|mjs|css|json|txt|xml)$/.test(f)) continue;
    const t = fs.readFileSync(f, 'utf8');
    if (/\bre_[A-Za-z0-9]{8,}_[A-Za-z0-9]{8,}/.test(t)) bad.push(`khóa Resend? ${path.relative(distDir, f)}`);
    if (/ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}/.test(t)) bad.push(`token GitHub ${path.relative(distDir, f)}`);
    for (const m of t.matchAll(/eyJ[A-Za-z0-9_-]{10,}\.(eyJ[A-Za-z0-9_-]{10,})\.[A-Za-z0-9_-]{10,}/g)) {
      try { if (JSON.parse(Buffer.from(m[1], 'base64url').toString()).role === 'service_role') bad.push(`JWT service_role ${path.relative(distDir, f)}`); } catch { /* bỏ qua */ }
    }
  }
  return verdict(bad);
});
await tc('SEC-05', 'npm audit 0 lỗ hổng', async () => {
  let out;
  try { out = execSync('npm audit --json', { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch (e) { out = e.stdout; }
  const v = JSON.parse(out).metadata.vulnerabilities;
  return v.total === 0 ? {} : { fail: JSON.stringify(v) };
});
await tc('SEC-06', 'Site thật: HTTPS, tệp nhạy cảm 404', async () => {
  const bad = [];
  const h = await fetch('http://duocsithuong.com/', { redirect: 'manual' });
  if (![301, 302, 307, 308].includes(h.status) || !h.headers.get('location')?.startsWith('https://')) bad.push(`http → ${h.status} ${h.headers.get('location')}`);
  for (const p of ['/.env', '/.git/config', '/docs/supabase-schema.sql', '/supabase/functions/send-order-email/index.ts', '/package.json']) {
    const r = await fetch(LIVE_SITE + p);
    if (r.status !== 404) bad.push(`${p}: ${r.status}`);
  }
  return verdict(bad);
});

// ---------- báo cáo ----------
await browser.close();
server.close();
const pass = results.filter((r) => r.status === 'PASS').length;
const fail = results.filter((r) => r.status === 'FAIL');
const lines = [
  `# Kết quả chạy test case`,
  ``,
  `- Thời điểm: ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
  `- Tổng: ${results.length} · PASS ${pass} · FAIL ${fail.length}`,
  ``,
  `| Mã | Nội dung | Kết quả | Chi tiết |`,
  `| --- | --- | --- | --- |`,
  ...results.map((r) => `| ${r.id} | ${r.title} | ${r.status === 'PASS' ? 'PASS' : '**FAIL**'} | ${String(r.detail).replace(/\|/g, '\\|').replace(/\n/g, ' ')} |`),
];
fs.writeFileSync(path.join(outDir, 'report.md'), lines.join('\n') + '\n');
fs.writeFileSync(path.join(outDir, 'results.json'), JSON.stringify(results, null, 2));
console.log(`\nTổng ${results.length}: PASS ${pass}, FAIL ${fail.length}`);
process.exit(fail.length ? 1 : 0);
