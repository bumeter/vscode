import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ext = join(__dirname, '..');
const run = (env: Record<string, string>) =>
  execFileSync('node', ['scripts/media.mjs'], { cwd: ext, env: { ...process.env, ...env }, encoding: 'utf8', stdio: 'pipe' });

describe('scripts/media.mjs', () => {
  it('copies @bumeter/ui from node_modules', () => {
    run({});
    expect(existsSync(join(ext, 'media', 'ui', 'index.html'))).toBe(true);
  });

  it('bundles BUM_BINARY under bin/<BUM_PLATFORM>/', () => {
    const dir = mkdtempSync(join(tmpdir(), 'bum-'));
    const bum = join(dir, 'bum.exe');
    writeFileSync(bum, 'x');
    run({ BUM_BINARY: bum, BUM_PLATFORM: 'win32-x64' });
    expect(existsSync(join(ext, 'bin', 'win32-x64', 'bum.exe'))).toBe(true);
    rmSync(dir, { recursive: true, force: true });
  });

  it('fails when BUM_BINARY does not exist', () => {
    expect(() => run({ BUM_BINARY: '/nope/bum', BUM_PLATFORM: 'linux-x64' })).toThrow();
  });
});
