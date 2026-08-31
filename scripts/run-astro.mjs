import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const releasePattern = /^v[0-9]+\.[0-9]+\.[0-9]+$/;
const releasesUrl = 'https://updates.thesqlabs.com/gateway/releases';
const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const templatePath = fileURLToPath(new URL('../templates/install/gateway.env.example', import.meta.url));
const generatedPath = fileURLToPath(new URL('../public/install/gateway.env.example', import.meta.url));

async function resolveLatestStableVersion() {
  const configuredVersion = process.env.GATEWAY_DOCS_RELEASE_VERSION?.trim();
  if (configuredVersion) {
    if (!releasePattern.test(configuredVersion)) {
      throw new Error('GATEWAY_DOCS_RELEASE_VERSION must use the stable vX.Y.Z format');
    }
    return configuredVersion;
  }

  const response = await fetch(releasesUrl, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) {
    throw new Error(`Could not load Gateway releases: HTTP ${response.status}`);
  }

  const releases = await response.json();
  if (!Array.isArray(releases)) {
    throw new Error('Gateway releases endpoint returned an unexpected response');
  }

  const publishedStableTags = new Set(
    releases.filter((release) => release?.prerelease === false).map((release) => release?.tag_name)
  );
  const latest = releases
    .filter(
      (release) =>
        release?.prerelease === false &&
        releasePattern.test(release?.tag_name ?? '') &&
        publishedStableTags.has(`${release.tag_name}-relay`)
    )
    .sort((left, right) => Date.parse(right.published_at ?? '') - Date.parse(left.published_at ?? ''))[0];

  if (!latest) {
    throw new Error('Gateway releases endpoint did not return a stable vX.Y.Z release with a matching Relay');
  }
  return latest.tag_name;
}

async function generateManualInstallEnvironment(version) {
  const template = await readFile(templatePath, 'utf8');
  if (!template.includes('__GATEWAY_VERSION__')) {
    throw new Error('Manual installation environment template is missing the version placeholder');
  }

  await mkdir(new URL('../public/install/', import.meta.url), { recursive: true });
  await writeFile(generatedPath, template.replaceAll('__GATEWAY_VERSION__', version), 'utf8');
}

function runAstro(command, version) {
  const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
  const child = spawn(pnpm, ['exec', 'astro', command], {
    cwd: projectRoot,
    env: { ...process.env, PUBLIC_GATEWAY_VERSION: version },
    stdio: 'inherit',
  });

  return new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (signal) reject(new Error(`Astro exited after signal ${signal}`));
      else resolve(code ?? 1);
    });
  });
}

const command = process.argv[2];
if (command !== 'build' && command !== 'dev') {
  throw new Error('Usage: node scripts/run-astro.mjs <build|dev>');
}

const version = await resolveLatestStableVersion();
await generateManualInstallEnvironment(version);
console.log(`Using Gateway ${version} in manual installation documentation`);
process.exitCode = await runAstro(command, version);
