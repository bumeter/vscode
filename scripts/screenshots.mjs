// Screenshots for the README, on demo data only:
// - the Overview, Conversations and Skills views: the bundled UI (media/ui) outside VS Code uses its own mock data;
// - the status bar and Explorer marks: the real texts (kit renderStatus, src/decorations wording) drawn like VS Code.
//   CHROME=/path/to/chrome node scripts/screenshots.mjs
// Writes media/screenshots/*.png. Fonts (codicons, emoji) come from jsDelivr and Google Fonts.
import { execFile } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';
import { createServer } from 'node:http';
import Module, { createRequire } from 'node:module';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ui = join(root, 'media', 'ui');
const out = join(root, 'media', 'screenshots');
const chrome = process.env.CHROME;
if (!chrome) {
  console.error('set CHROME to a Chrome or chrome-headless-shell binary');
  process.exit(1);
}

// status.js needs `vscode` only for the StatusBar class; renderStatus is pure.
const load = Module._load;
Module._load = function (request, ...rest) { return request === 'vscode' ? {} : load.call(this, request, ...rest); };
const require = createRequire(import.meta.url);
const { renderStatus } = require('@bumeter/vscode-kit/status');

const FONTS = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@vscode/codicons/dist/codicon.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=block">`;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff': 'font/woff', '.woff2': 'font/woff2' };
const pages = {};

// The status bar and the Explorer, drawn like VS Code's dark theme.
const now = Math.floor(Date.now() / 1000);
const limits = { five_hour: { used_percentage: 62, resets_at: now + 80 * 60 }, seven_day: { used_percentage: 41, resets_at: now + 3 * 86_400 + 4 * 3600 }, stale: false, blocked: null,
  forecast_five_hour: { hits_at: null, at_risk: false }, forecast_seven_day: { hits_at: null, at_risk: false } };
const project = { latest: { session_id: 's', ts: new Date((now - 60) * 1000).toISOString(), context: 312_000 }, context_threshold: 400_000 };
const view = renderStatus(limits, project, '~/work/my-app', 'en', now, { id: 'x', name: 'Bumeter', click: '', fallback: '', noLimits: '',
  links: [{ label: 'Open Overview', command: '' }, { label: 'Refresh', command: '' }] });
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const icons = (s) => esc(s).replace(/\$\((\w[\w-]*)\)/g, '<i class="codicon codicon-$1"></i>');
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`(.+?)`/g, '<code>$1</code>').replace(/\[(.+?)\]\(.*?\)/g, '<a>$1</a>')
  .split(/\n{2,}/).filter((p) => p.trim()).map((p) => `<p>${p.trim()}</p>`).join('');
// [name, depth, folder?, reads, edits]
const files = [['my-app', 0, true], ['src', 1, true], ['api', 2, true], ['client.ts', 3, false, 12, 0], ['routes.ts', 3, false, 4, 2], ['auth', 2, true],
  ['session.ts', 3, false, 9, 0], ['login.tsx', 3, false], ['app.tsx', 2, false, 3, 1], ['package.json', 1, false, 6, 0], ['README.md', 1, false], ['tsconfig.json', 1, false]];
const mark = (reads, edits) => (reads ? { badge: reads < 10 ? `${reads}×` : String(reads), color: edits === 0 ? 'error' : 'warning' } : null);
const explorer = files.map(([name, depth, folder, reads, edits]) => {
  const m = mark(reads, edits);
  return `<div class="f ${m ? m.color : ''}" style="padding-left:${8 + depth * 14}px"><i class="codicon codicon-${folder ? 'chevron-down' : 'blank'}"></i><span>${name}</span>${m ? `<b>${m.badge}</b>` : ''}</div>`;
}).join('');
pages['editor.html'] = `<!DOCTYPE html><html><head><meta charset="utf-8">${FONTS}<style>
body{margin:0;height:100vh;display:grid;grid-template-rows:1fr 22px;background:#1f1f1f;color:#ccc;font:13px -apple-system,"Segoe UI",Ubuntu,sans-serif,"Noto Color Emoji"}
.main{display:grid;grid-template-columns:260px 1fr;min-height:0}.side{background:#181818;border-right:1px solid #2b2b2b;padding-top:6px}
.side h4{margin:4px 12px 8px;font-size:11px;letter-spacing:.06em;color:#9d9d9d;font-weight:600}
.f{display:flex;align-items:center;gap:4px;height:22px;padding-right:12px}.f span{flex:1}.f b{font-weight:600}.f.error{color:#f88070}.f.warning{color:#cca700}.f .codicon{font-size:14px}
.f.sel{background:#04395e}
.ftip{position:absolute;left:252px;top:96px;background:#202020;border:1px solid #454545;border-radius:4px;padding:4px 8px;box-shadow:0 2px 8px #0000005c}
.code{padding:14px 20px;font:13px Consolas,"DejaVu Sans Mono",monospace;color:#9cdcfe;line-height:1.6;white-space:pre}.code .k{color:#c586c0}.code .s{color:#ce9178}.code .c{color:#6a9955}
.bar{background:#181818;border-top:1px solid #2b2b2b;display:flex;align-items:center;justify-content:space-between;padding:0 6px;font-size:12px}
.bar>div{display:flex}.item{padding:0 6px;display:inline-flex;align-items:center;gap:3px;height:22px;white-space:pre}.item .codicon{font-size:14px}.item.hover{background:#ffffff1f}
.tip{position:absolute;right:60px;bottom:30px;width:430px;background:#202020;border:1px solid #454545;border-radius:4px;box-shadow:0 2px 8px #0000005c;padding:10px 12px;line-height:1.5}
.tip p{margin:0 0 8px}.tip p:last-child{margin:0}.tip a{color:#4daafc}.tip code{font-family:Consolas,"DejaVu Sans Mono",monospace;color:#ffb27a}
</style></head><body><div class="main"><div class="side"><h4>EXPLORER</h4>${explorer}</div>
<div class="code"><span class="k">import</span> { createClient } <span class="k">from</span> <span class="s">'./api/client'</span>;
<span class="k">import</span> { getSession } <span class="k">from</span> <span class="s">'./auth/session'</span>;

<span class="c">// Read 12 times by agents this week, never edited:</span>
<span class="c">// worth a short summary in CLAUDE.md.</span>
<span class="k">export async function</span> main() {
  <span class="k">const</span> session = <span class="k">await</span> getSession();
  <span class="k">return</span> createClient(session);
}</div></div>
<div class="ftip">Bumeter: Read 12 times by agents in 7 days, never edited</div>
<div class="tip">${md(view.tooltip)}</div>
<div class="bar"><div><span class="item"><i class="codicon codicon-git-branch"></i> main</span><span class="item"><i class="codicon codicon-error"></i> 0 <i class="codicon codicon-warning"></i> 0</span></div>
<div><span class="item">Ln 7, Col 3</span><span class="item">UTF-8</span><span class="item">TypeScript</span>${(view.items ?? [{ text: view.text }]).map((s) => `<span class="item hover">${icons(s.text)}</span>`).join('')}<span class="item"><i class="codicon codicon-bell"></i></span></div></div></body></html>`;

// The UI names its font without a fallback list, so emoji get no font. Register Noto Color Emoji's faces
// under the UI's font name too: the browser picks them by unicode-range.
// The UI's font has no emoji: add Noto Color Emoji after it, only for symbols and emoji (it also has digits).
// Asked as Chrome: small woff2 subsets instead of one 25 MB ttf.
const emoji = (await (await fetch('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=block',
  { headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } })).text())
  .replace(/unicode-range: ([^;]+);/g, (_, r) => `unicode-range: ${r.split(',').map((x) => x.trim()).filter((x) => parseInt(x.slice(2), 16) >= 0x2300).join(', ') || 'U+E000'};`)
  + `:root{--font:"Be Vietnam Pro",-apple-system,BlinkMacSystemFont,system-ui,sans-serif,"Noto Color Emoji"}`;

const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const name = url.pathname.slice(1) || 'index.html';
  if (pages[name]) { res.writeHead(200, { 'content-type': 'text/html' }); res.end(pages[name]); return; }
  const file = normalize(join(ui, name));
  if (!file.startsWith(ui)) { res.writeHead(403); res.end(); return; }
  try {
    let body = readFileSync(file);
    if (name === 'index.html') body = body.toString().replace('</head>', `<style>${emoji}</style></head>`);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

mkdirSync(out, { recursive: true });
const shots = [
  ['overview', 'index.html?view=overview&theme=dark&lang=en', 1280, 900],
  ['conversations', 'index.html?view=conversations&theme=dark&lang=en&open=1', 1280, 760],
  ['skills', 'index.html?view=skills&theme=dark&lang=en', 1280, 760],
  ['overview-light', 'index.html?view=overview&theme=light&lang=en', 1280, 900],
  ['editor', 'editor.html', 1100, 420],
];
for (const [name, path, w, h] of shots) {
  // Async, so this process keeps serving the page while Chrome loads it.
  await new Promise((resolve, reject) => execFile(chrome, ['--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=2',
    '--virtual-time-budget=8000', `--window-size=${w},${h}`, `--screenshot=${join(out, `${name}.png`)}`, `${base}/${path}`], (e) => (e ? reject(e) : resolve())));
  console.log(`media/screenshots/${name}.png`);
}
server.close();
