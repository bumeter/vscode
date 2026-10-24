// Copies what the extension ships besides its own code: the Bumeter UI (@bumeter/ui's dist) and the
// `bum` binary given in BUM_BINARY into bin/<BUM_PLATFORM>/. The release workflow fetches one `bum`
// per platform with scripts/fetch-bum.sh and runs this once for each.
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ext = join(here, '..');

const ui = join(ext, 'node_modules', '@bumeter', 'ui', 'dist');
if (!existsSync(join(ui, 'index.html'))) {
  console.error('node_modules/@bumeter/ui/dist is missing: run `npm install` first');
  process.exit(1);
}
rmSync(join(ext, 'media', 'ui'), { recursive: true, force: true });
cpSync(ui, join(ext, 'media', 'ui'), { recursive: true });

const os = process.platform === 'win32' ? 'win32' : process.platform === 'darwin' ? 'darwin' : 'linux';
const platform = process.env.BUM_PLATFORM ?? `${os}-${process.arch}`;
const exe = platform.startsWith('win32') ? 'bum.exe' : 'bum';
const bum = process.env.BUM_BINARY ?? '';
// One platform per package: a `bum` left over from another build would ship in the wrong .vsix.
rmSync(join(ext, 'bin'), { recursive: true, force: true });
if (existsSync(bum)) {
  const dir = join(ext, 'bin', platform);
  mkdirSync(dir, { recursive: true });
  cpSync(bum, join(dir, exe));
  console.log(`bundled ${bum} as bin/${platform}/${exe}`);
} else if (process.env.BUM_BINARY) {
  console.error(`BUM_BINARY=${bum} does not exist`);
  process.exit(1);
} else {
  console.warn(`no BUM_BINARY: the extension will look for \`bum\` on PATH`);
}
