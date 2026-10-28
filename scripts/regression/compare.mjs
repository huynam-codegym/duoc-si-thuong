// So ảnh chụp 2 lần chạy run.mjs: node compare.mjs <thư mục ảnh cũ> <thư mục ảnh mới> <thư mục ảnh khác biệt>
// In ra từng ảnh: tỷ lệ điểm ảnh khác nhau, hoặc báo lệch kích thước (trang dài/ngắn hơn).
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const [oldDir, newDir, diffDir] = process.argv.slice(2);
fs.mkdirSync(diffDir, { recursive: true });
const rows = [];
for (const f of fs.readdirSync(oldDir).filter((x) => x.endsWith('.png'))) {
  const nf = path.join(newDir, f);
  if (!fs.existsSync(nf)) { rows.push([f, 'THIẾU ẢNH MỚI']); continue; }
  const a = PNG.sync.read(fs.readFileSync(path.join(oldDir, f)));
  const b = PNG.sync.read(fs.readFileSync(nf));
  if (a.width !== b.width || a.height !== b.height) { rows.push([f, `LỆCH KÍCH THƯỚC ${a.width}x${a.height} -> ${b.width}x${b.height}`]); continue; }
  const d = new PNG({ width: a.width, height: a.height });
  const n = pixelmatch(a.data, b.data, d.data, a.width, a.height, { threshold: 0.1 });
  const ratio = n / (a.width * a.height);
  if (n > 0) fs.writeFileSync(path.join(diffDir, f), PNG.sync.write(d));
  rows.push([f, n === 0 ? 'giống hệt' : `${(ratio * 100).toFixed(3)}% (${n} điểm ảnh)`]);
}
rows.sort((x, y) => (x[1] === 'giống hệt') - (y[1] === 'giống hệt'));
for (const [f, s] of rows) console.log(s.padEnd(38), f);
