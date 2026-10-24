// Copies what an extension ships besides its own code: the Bumeter UI (@bumeter/ui's dist) and the
// `bum` binary given in BUM_BINARY into bin/<BUM_PLATFORM>/. PRODUCT=<name> does it for
// products/<name>/ instead of Bumeter (the repository root); those products show no UI, so only `bum`.
// The release workflows fetch one `bum` per platform with scripts/fetch-bum.sh and run this once for each.
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const product = process.env.PRODUCT ?? '';
const ext = product ? join(root, 'products', product) : root;
if (!existsSync(join(ext, 'package.json'))) {
  console.error(`no product '${product}': products/${product}/package.json is missing`);
  process.exit(1);
}

if (!product) {
  const ui = join(root, 'node_modules', '@bumeter', 'ui', 'dist');
  if (!existsSync(join(ui, 'index.html'))) {
    console.error('node_modules/@bumeter/ui/dist is missing: run `npm install` first');
    process.exit(1);
  }
  rmSync(join(ext, 'media', 'ui'), { recursive: true, force: true });
  cpSync(ui, join(ext, 'media', 'ui'), { recursive: true });
}

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
  console.log(`bundled ${bum} as ${product ? `products/${product}/` : ''}bin/${platform}/${exe}`);
} else if (process.env.BUM_BINARY) {
  console.error(`BUM_BINARY=${bum} does not exist`);
  process.exit(1);
} else {
  console.warn(`no BUM_BINARY: the extension will look for \`bum\` on PATH`);
}
