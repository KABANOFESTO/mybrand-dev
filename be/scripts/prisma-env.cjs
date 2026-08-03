const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const args = process.argv.slice(2);
const tmpDir = path.resolve(process.cwd(), '.tmp');

fs.mkdirSync(tmpDir, { recursive: true });

const env = {
  ...process.env,
  TEMP: tmpDir,
  TMP: tmpDir,
  TMPDIR: tmpDir,
};

const prismaBin = path.resolve(
  process.cwd(),
  process.platform === 'win32'
    ? 'node_modules/.bin/prisma.cmd'
    : 'node_modules/.bin/prisma',
);

const result =
  process.platform === 'win32'
    ? spawnSync('cmd.exe', ['/d', '/s', '/c', prismaBin, ...args], {
        stdio: 'inherit',
        env,
        shell: false,
      })
    : spawnSync(prismaBin, args, {
        stdio: 'inherit',
        env,
        shell: false,
      });

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
