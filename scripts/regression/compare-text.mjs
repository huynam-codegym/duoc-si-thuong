// So chữ hiển thị thật (innerText) của MỌI trang giữa 2 bản build, tìm chỗ chữ bị dính.
// node compare-text.mjs <dist-old> <dist-new>
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import puppeteer from 'puppeteer-core';
const [oldDir, newDir] = process.argv.slice(2);
const T = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const serve = (dir, port) => http.createServer((q, s) => { let f = path.join(dir, decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); if (!fs.existsSync(f)) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); s.end(fs.readFileSync(f)); }).listen(port);
const s1 = serve(oldDir, 4501), s2 = serve(newDir, 4502);
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? (['_astro', 'pagefind', 'videos'].includes(e.name) ? [] : walk(path.join(d, e.name))) : e.name === 'index.html' ? [path.join(d, e.name)] : []);
const urls = walk(oldDir).map((f) => '/' + path.relative(oldDir, path.dirname(f)).split(path.sep).join('/') + '/').map((u) => u.replace('//', '/'));
const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: 'new' });
const page = await b.newPage();
await page.setRequestInterception(true);
page.on('request', (r) => (/^http:\/\/localhost:450[12]/.test(r.url()) && ['document', 'stylesheet', 'script'].includes(r.resourceType()) ? r.continue() : r.abort()));
const get = async (base, u) => { await page.goto(base + u, { waitUntil: 'domcontentloaded' }); return page.evaluate(() => { document.querySelectorAll('details').forEach((d) => (d.open = true)); return document.body.innerText; }); };
const words = (t) => t.split(/\s+/).filter(Boolean);
const issues = new Map();
for (const u of urls) {
  const [a, c] = [words(await get('http://localhost:4501', u)), words(await get('http://localhost:4502', u))];
  if (a.join(' ') === c.join(' ')) continue;
  // word mới = ghép 2 word cũ liền nhau -> mất dấu cách
  let i = 0, j = 0;
  while (i < a.length && j < c.length) {
    if (a[i] === c[j]) { i++; j++; continue; }
    if (a[i] + a[i + 1] === c[j]) { const k = `${a[i]}␣${a[i + 1]}`; (issues.get(k) ?? issues.set(k, new Set()).get(k)).add(u); i += 2; j++; continue; }
    (issues.get('KHÁC: ' + a.slice(i, i + 4).join(' ') + ' => ' + c.slice(j, j + 4).join(' ')) ?? issues.set('KHÁC: ' + a.slice(i, i + 4).join(' ') + ' => ' + c.slice(j, j + 4).join(' '), new Set()).get('KHÁC: ' + a.slice(i, i + 4).join(' ') + ' => ' + c.slice(j, j + 4).join(' '))).add(u);
    break;
  }
}
console.log('Đã so', urls.length, 'trang');
for (const [k, v] of [...issues].sort((x, y) => y[1].size - x[1].size)) console.log(String(v.size).padStart(4), k, '|', [...v].slice(0, 3).join(' '));
await b.close(); s1.close(); s2.close();
