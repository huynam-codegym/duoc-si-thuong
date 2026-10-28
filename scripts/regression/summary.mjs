// Tóm tắt results.json của run.mjs: node summary.mjs <outDir>
import fs from 'node:fs';
const r = JSON.parse(fs.readFileSync(process.argv[2] + '/results.json', 'utf8'));
for (const [k, v] of Object.entries(r.pages)) if (v.status !== 200 || v.overflowX > 0 || v.errors.length || v.brokenImgs.length) console.log(k, v.status, 'ovf', v.overflowX, v.brokenImgs, v.errors.slice(0, 3));
console.log(JSON.stringify(r.checks, null, 1));
