// Compile the actual TypeScript domain modules, then run Node's test runner.
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const web = fileURLToPath(new URL('../web/', import.meta.url));
const out = await mkdtemp(join(tmpdir(), 'ai-jobs-seo-tests-'));
try {
  const result = spawnSync(process.execPath, [resolve(web, 'node_modules/typescript/bin/tsc'),
    'lib/jobs.test.ts', 'lib/job-schema.test.ts', 'lib/job-quality.test.ts',
    '--outDir', out, '--rootDir', '.', '--module', 'commonjs', '--target', 'es2020',
    '--esModuleInterop', '--resolveJsonModule', '--skipLibCheck', '--strict'], { cwd: web, stdio: 'inherit' });
  if (result.status !== 0) process.exitCode = result.status || 1;
  else {
    const tests = spawnSync(process.execPath, ['--test', ...['jobs', 'job-schema', 'job-quality'].map((name) => join(out, 'lib', `${name}.test.js`))], { stdio: 'inherit' });
    process.exitCode = tests.status || (tests.error ? 1 : 0);
  }
} finally { await rm(out, { recursive: true, force: true }); }
