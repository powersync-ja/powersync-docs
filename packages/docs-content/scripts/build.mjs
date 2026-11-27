// Builds dist/ for @powersync/docs-content from the docs' own snippet and image files.
// The MDX and PNG files in the repository are the source of truth; this script only derives from them.
// When a source file moves, update SOURCES below. That is the only place that names source paths.
//
// Modules are written as .mjs, not .js: Mintlify loads every .js file in the repository as a custom script on every
// page, and .mintignore does not stop that.

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(packageDir, '../..');
const distDir = join(packageDir, 'dist');

const INSTANCE_URL_PLACEHOLDER = '[Your PowerSync instance URL or self-hosted endpoint]';

const ALL_SDKS = ['javascript', 'typescript', 'react-native', 'dart', 'kotlin', 'swift', 'dotnet', 'rust'];
const SUPABASE_SDKS = ['javascript', 'typescript', 'react-native', 'dart', 'kotlin', 'swift', 'dotnet'];

// Snippets that set up the client's connection. Each kind is published at `<kind>/<group>/<sdk>`.
// Snippets in a group with `requiresPlaceholder` connect to the instance URL placeholder, which consumers replace with
// the PowerSync instance URL. Supabase snippets read the URL from app config instead.
const SNIPPET_KINDS = {
  // An authenticator and a download-only connect.
  authenticators: {
    dir: 'snippets/client-connection/authenticators',
    groups: {
      custom: { sdks: ALL_SDKS, requiresPlaceholder: true },
      supabase: { sdks: SUPABASE_SDKS, requiresPlaceholder: false }
    }
  },
  // A mutation uploader and a connect for downloads and uploads.
  uploaders: {
    dir: 'snippets/client-connection/uploaders',
    groups: {
      'reference-write-endpoint': { sdks: ALL_SDKS, requiresPlaceholder: true },
      supabase: { sdks: SUPABASE_SDKS, requiresPlaceholder: false }
    }
  }
};

const SOURCES = {
  prompts: {
    'existing-api': 'snippets/write-path/existing-api-prompt.mdx',
    'build-your-own-backend': 'snippets/write-path/build-your-own-backend-prompt.mdx'
  },
  images: {
    dir: 'images/handling-writes',
    files: {
      'write-path-overview': 'write-path-overview.png',
      'reference-write-implementation': 'reference-write-implementation.png',
      'supabase-edge-function': 'supabase-edge-function.png'
    }
  }
};

const errors = [];

function fail(source, message) {
  errors.push(`${source}: ${message}`);
}

function readSource(path) {
  const absolute = join(repoRoot, path);
  if (!existsSync(absolute)) {
    fail(path, 'expected source file is missing');
    return null;
  }
  const text = readFileSync(absolute, 'utf8');
  if (text.includes('\r')) {
    fail(path, 'contains CR characters; use LF line endings');
    return null;
  }
  return text;
}

const FENCE = /^(`{3,})(.*)$/;

// Returns the body of the one top-level fenced code block in `text`, without its fence lines.
// With `allowIntro`, prose may come before the block (prompts); otherwise the file must be only the block (authenticators and uploaders).
// Shorter fences inside the block are part of its body, as in CommonMark.
function extractFencedBlock(text, path, { allowIntro }) {
  const lines = text.split('\n');
  const openIndex = lines.findIndex((line) => FENCE.test(line));
  if (openIndex === -1) {
    fail(path, 'has no fenced code block');
    return null;
  }
  if (!allowIntro && lines.slice(0, openIndex).some((line) => line.trim() !== '')) {
    fail(path, 'has content before the fenced code block; a snippet file must be exactly one fenced code block');
    return null;
  }

  const ticks = FENCE.exec(lines[openIndex])[1].length;
  const closer = new RegExp(`^\`{${ticks},}\\s*$`);
  const closeIndex = lines.findIndex((line, index) => index > openIndex && closer.test(line));
  if (closeIndex === -1) {
    fail(path, 'has an unclosed fenced code block');
    return null;
  }
  if (lines.slice(closeIndex + 1).some((line) => line.trim() !== '')) {
    fail(path, 'has content after the fenced code block; expected exactly one fenced code block');
    return null;
  }

  const body = lines.slice(openIndex + 1, closeIndex);
  if (!allowIntro && body.some((line) => FENCE.test(line))) {
    fail(path, 'has more than one fenced code block');
    return null;
  }
  return body.join('\n') + '\n';
}

function writeStringModule(outPath, source, content) {
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(
    `${outPath}.mjs`,
    `// Generated from ${source} by @powersync/docs-content. Edit the source file, not this one.\n` +
      `export default ${JSON.stringify(content)};\n`
  );
  writeFileSync(`${outPath}.d.mts`, 'declare const content: string;\nexport default content;\n');
}

// Collect sources before writing anything, so a failed build leaves no partial dist/.
const snippets = { authenticators: [], uploaders: [] };
for (const [kind, { dir, groups }] of Object.entries(SNIPPET_KINDS)) {
  for (const [group, { sdks, requiresPlaceholder }] of Object.entries(groups)) {
    const groupDir = `${dir}/${group}`;
    if (existsSync(join(repoRoot, groupDir))) {
      for (const file of readdirSync(join(repoRoot, groupDir))) {
        if (file.endsWith('.mdx') && !sdks.includes(file.slice(0, -'.mdx'.length))) {
          fail(`${groupDir}/${file}`, 'is not in the build source list; add it to SNIPPET_KINDS in scripts/build.mjs');
        }
      }
    }
    for (const sdk of sdks) {
      const path = `${groupDir}/${sdk}.mdx`;
      const text = readSource(path);
      if (text === null) continue;
      const code = extractFencedBlock(text, path, { allowIntro: false });
      if (code === null) continue;
      if (requiresPlaceholder && !code.includes(INSTANCE_URL_PLACEHOLDER)) {
        fail(path, `does not contain the instance URL placeholder ${INSTANCE_URL_PLACEHOLDER}`);
        continue;
      }
      snippets[kind].push({ id: `${group}/${sdk}`, source: path, content: code });
    }
  }
}

const prompts = [];
for (const [id, path] of Object.entries(SOURCES.prompts)) {
  const text = readSource(path);
  if (text === null) continue;
  const prompt = extractFencedBlock(text, path, { allowIntro: true });
  if (prompt === null) continue;
  prompts.push({ id, source: path, content: prompt });
}

const images = [];
for (const [id, file] of Object.entries(SOURCES.images.files)) {
  const path = `${SOURCES.images.dir}/${file}`;
  if (!existsSync(join(repoRoot, path))) {
    fail(path, 'expected source file is missing');
    continue;
  }
  images.push({ id, source: path, file });
}

if (errors.length > 0) {
  console.error(`@powersync/docs-content build failed:\n${errors.map((error) => `  - ${error}`).join('\n')}`);
  process.exit(1);
}

rmSync(distDir, { recursive: true, force: true });

for (const [kind, items] of Object.entries(snippets)) {
  for (const { id, source, content } of items) {
    writeStringModule(join(distDir, kind, id), source, content);
  }
}
for (const { id, source, content } of prompts) {
  writeStringModule(join(distDir, 'prompts', id), source, content);
}
mkdirSync(join(distDir, 'images'), { recursive: true });
for (const { source, file } of images) {
  copyFileSync(join(repoRoot, source), join(distDir, 'images', file));
}

const list = (items) => items.map(({ id }) => JSON.stringify(id)).join(', ');
const union = (items) => items.map(({ id }) => JSON.stringify(id)).join(' | ');

writeFileSync(
  join(distDir, 'index.mjs'),
  `// Generated by @powersync/docs-content.\n` +
    `export const AUTHENTICATOR_IDS = [${list(snippets.authenticators)}];\n` +
    `export const UPLOADER_IDS = [${list(snippets.uploaders)}];\n` +
    `export const PROMPT_IDS = [${list(prompts)}];\n` +
    `export const IMAGE_IDS = [${list(images)}];\n` +
    `export const INSTANCE_URL_PLACEHOLDER = ${JSON.stringify(INSTANCE_URL_PLACEHOLDER)};\n`
);
writeFileSync(
  join(distDir, 'index.d.mts'),
  `/** An authenticator snippet, with a download-only connect. Import its code from \`@powersync/docs-content/authenticators/<id>\`. */\n` +
    `export type AuthenticatorId = ${union(snippets.authenticators)};\n` +
    `/** A mutation uploader snippet, with a connect for downloads and uploads. Import its code from \`@powersync/docs-content/uploaders/<id>\`. */\n` +
    `export type UploaderId = ${union(snippets.uploaders)};\n` +
    `/** An agent prompt. Import its text from \`@powersync/docs-content/prompts/<id>\`. */\n` +
    `export type PromptId = ${union(prompts)};\n` +
    `/** A diagram. Import the file from \`@powersync/docs-content/images/<id>.png\`. */\n` +
    `export type ImageId = ${union(images)};\n` +
    `export declare const AUTHENTICATOR_IDS: readonly AuthenticatorId[];\n` +
    `export declare const UPLOADER_IDS: readonly UploaderId[];\n` +
    `export declare const PROMPT_IDS: readonly PromptId[];\n` +
    `export declare const IMAGE_IDS: readonly ImageId[];\n` +
    `/** Text in the custom authenticator and reference write endpoint uploader snippets that consumers replace with the PowerSync instance URL. */\n` +
    `export declare const INSTANCE_URL_PLACEHOLDER: ${JSON.stringify(INSTANCE_URL_PLACEHOLDER)};\n`
);

copyFileSync(join(repoRoot, 'LICENSE'), join(packageDir, 'LICENSE'));

console.log(
  `@powersync/docs-content: built ${snippets.authenticators.length} authenticators, ${snippets.uploaders.length} uploaders, ` +
    `${prompts.length} prompts, ${images.length} images ` +
    `into ${relative(repoRoot, distDir)}/`
);
