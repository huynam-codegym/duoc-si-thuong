// So cấu trúc HTML mọi trang giữa 2 bản build: node compare-html.mjs <dist-old> <dist-new>
import fs from 'node:fs'; import path from 'node:path';
const [oldDir, newDir] = process.argv.slice(2);
const KEEP = ['id', 'class', 'href', 'alt', 'role', 'aria-label', 'type', 'name', 'colspan', 'rowspan', 'width', 'height', 'loading'];
const toks = (h) => {
  h = h.replace(/&(#38|#x26|amp);/g, '&').replace(/&(#39|#x27|apos);/g, "'").replace(/&(#34|#x22|quot);/g, '"').replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, (m, t) => `<${t}>`);
  return [...h.matchAll(/<\/?([a-zA-Z0-9-]+)([^>]*)>/g)].map(([, tag, attrs]) => {
    const kv = [...attrs.matchAll(/([a-zA-Z:@-]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g)]
      .filter(([, k]) => KEEP.includes(k) || k.startsWith('data-'))
      .map(([, k, v = '']) => k + '=' + v.replace(/_astro\/[^"'\s]*/g, 'ASSET').replace(/astro-[a-z0-9]{6,8}/g, 'astro-H').replace(/\s+/g, ' '))
      .sort();
    return tag.toLowerCase() + (kv.length ? '[' + kv.join(' ') + ']' : '');
  });
};
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? (['_astro', 'pagefind'].includes(e.name) ? [] : walk(path.join(d, e.name))) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []);
const kinds = new Map(); let n = 0;
for (const f of walk(oldDir)) {
  const rel = path.relative(oldDir, f);
  const a = toks(fs.readFileSync(f, 'utf8')), b = toks(fs.readFileSync(path.join(newDir, rel), 'utf8'));
  let i = 0; while (i < a.length && a[i] === b[i]) i++;
  if (i === a.length && a.length === b.length) continue;
  n++;
  const key = `${a[i]}  =>  ${b[i]}`;
  (kinds.get(key) ?? kinds.set(key, []).get(key)).push(rel);
}
console.log('Trang khác cấu trúc:', n);
for (const [k, v] of [...kinds].sort((x, y) => y[1].length - x[1].length)) console.log(String(v.length).padStart(4), k.slice(0, 400), '|', v[0]);
