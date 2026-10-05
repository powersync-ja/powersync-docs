#!/usr/bin/env node
/**
 * Snippet-aware link check.
 *
 * Runs `mintlify broken-links --check-anchors --check-snippets`, then re-validates
 * every reported `#anchor` against the headings of the target page *including*
 * headings that come from snippets the page imports. The Mintlify checker only
 * reads page files, so a page whose body lives in a snippet (for example the pages
 * shared between the Sync Streams and Sync Rules sections, see snippets/sync-shared/)
 * would otherwise fail for every inbound anchor link.
 *
 * Reported links without a fragment, and anchors that still cannot be found, are
 * printed in the Mintlify format and make the script exit with status 1.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const nodeMajor = Number(process.versions.node.split('.')[0]);
if (nodeMajor < 20 || nodeMajor > 24) {
  console.error(
    `The Mintlify CLI supports Node 20.17 to 24, but this is Node ${process.versions.node}.\n` +
      'Run `nvm use` (the repo pins Node 24 in .nvmrc) or prefix the command with ' +
      'PATH="/opt/homebrew/opt/node@24/bin:$PATH".',
  );
  process.exit(1);
}

const root = process.cwd();
const localBin = path.join(root, 'node_modules', '.bin', 'mintlify');
const bin = existsSync(localBin) ? localBin : 'mintlify';

const run = spawnSync(bin, ['broken-links', '--check-anchors', '--check-snippets'], {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
});
if (run.error) {
  console.error(`Could not run ${bin}: ${run.error.message}`);
  process.exit(1);
}

const output = ((run.stdout ?? '') + (run.stderr ?? ''))
  .replace(/\x1B\[[0-9;?]*[A-Za-z]/g, '')
  .replace(/\r/g, '');

// Parse blocks of "<file>\n ⎿  <link>\n ⎿  <link>".
const flagged = [];
let currentFile = null;
for (const rawLine of output.split('\n')) {
  const line = rawLine.trim();
  if (!line) continue;
  if (/checking for broken links/.test(line)) continue;
  if (/^found \d+ broken link/.test(line)) continue;
  if (/^success/i.test(line)) continue;
  const link = line.match(/^⎿\s*(\S.*)$/);
  if (link) {
    if (currentFile) flagged.push({ file: currentFile, link: link[1].trim() });
    continue;
  }
  currentFile = line;
}

if (run.status === 0 && flagged.length === 0) {
  console.log('success no broken links found');
  process.exit(0);
}
if (flagged.length === 0) {
  // Non-zero exit without a parsable report: show what Mintlify printed.
  console.log(output.trim());
  process.exit(run.status ?? 1);
}

function pageFile(urlPath) {
  const p = urlPath.replace(/^\//, '').replace(/\/$/, '');
  for (const candidate of [`${p}.mdx`, `${p}.md`, `${p}/index.mdx`, `${p}/index.md`]) {
    if (existsSync(path.join(root, candidate))) return candidate;
  }
  return null;
}

function snippetFile(spec) {
  const rel = spec.startsWith('/') ? spec.slice(1) : path.posix.join('snippets', spec);
  return existsSync(path.join(root, rel)) ? rel : null;
}

// Page source plus the source of every snippet it imports, recursively.
function collectSource(file, seen = new Set()) {
  if (seen.has(file)) return '';
  seen.add(file);
  const src = readFileSync(path.join(root, file), 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '');
  let out = src;
  for (const m of src.matchAll(/^import\s+\w+\s+from\s+['"]([^'"]+)['"]/gm)) {
    const f = snippetFile(m[1]);
    if (f) out += `\n${collectSource(f, seen)}`;
  }
  for (const m of src.matchAll(/<Snippet\s+file=["']([^"']+)["']/g)) {
    const f = snippetFile(m[1]);
    if (f) out += `\n${collectSource(f, seen)}`;
  }
  return out;
}

// Mintlify slugs: inline JSX, backticks, emphasis, and punctuation such as
// parentheses are dropped; underscores are kept; spaces become hyphens. Several
// candidates are produced so that the check stays lenient about edge cases the
// Mintlify checker has already accepted elsewhere.
function slugCandidates(text) {
  const base = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*]/g, '')
    .trim()
    .toLowerCase();
  const strict = base.replace(/[^a-z0-9\s_-]/g, '').trim().replace(/\s+/g, '-');
  const keepPunctuation = base.replace(/[^a-z0-9\s_/:-]/g, '').trim().replace(/\s+/g, '-');
  return new Set([strict, keepPunctuation, strict.replace(/-+/g, '-'), keepPunctuation.replace(/-+/g, '-')]);
}

const anchorCache = new Map();
function anchorsFor(file) {
  if (anchorCache.has(file)) return anchorCache.get(file);
  const src = collectSource(file).replace(/```[\s\S]*?```/g, '');
  const anchors = new Set();
  for (const m of src.matchAll(/^#{1,6}\s+(.+?)\s*$/gm)) {
    let heading = m[1];
    const explicit = heading.match(/\{#([^}]+)\}\s*$/);
    if (explicit) {
      anchors.add(explicit[1]);
      heading = heading.replace(/\{#[^}]+\}\s*$/, '');
    }
    for (const slug of slugCandidates(heading)) anchors.add(slug);
  }
  for (const m of src.matchAll(/<Accordion\b[^>]*\btitle=["']([^"']+)["']/g)) {
    for (const slug of slugCandidates(m[1])) anchors.add(slug);
  }
  for (const m of src.matchAll(/\bid=["']([^"']+)["']/g)) anchors.add(m[1]);
  for (const m of src.matchAll(/<(?:ResponseField|ParamField)\b[^>]*\bname=["']([^"']+)["']/g)) {
    anchors.add(`param-${m[1].replace(/_/g, '-')}`);
  }
  anchorCache.set(file, anchors);
  return anchors;
}

const unresolved = [];
for (const item of flagged) {
  const hash = item.link.indexOf('#');
  if (hash < 0) {
    unresolved.push(item); // a path problem, not an anchor problem
    continue;
  }
  const target = item.link.slice(0, hash).split('?')[0];
  let anchor = item.link.slice(hash + 1);
  try {
    anchor = decodeURIComponent(anchor);
  } catch {
    // keep the raw fragment
  }
  const file = target === '' ? item.file : pageFile(target);
  if (!file) {
    unresolved.push(item);
    continue;
  }
  const anchors = anchorsFor(file);
  const withoutSuffix = anchor.replace(/-\d+$/, '');
  if (anchors.has(anchor) || (withoutSuffix !== anchor && anchors.has(withoutSuffix))) continue;
  unresolved.push(item);
}

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
if (unresolved.length === 0) {
  console.log(`success no broken links found (${plural(flagged.length, 'anchor')} resolved through imported snippets)`);
  process.exit(0);
}

const byFile = new Map();
for (const item of unresolved) {
  if (!byFile.has(item.file)) byFile.set(item.file, []);
  byFile.get(item.file).push(item.link);
}
console.log(`found ${plural(unresolved.length, 'broken link')} in ${plural(byFile.size, 'file')}\n`);
for (const [file, links] of byFile) {
  console.log(file);
  for (const link of links) console.log(` ⎿  ${link}`);
  console.log();
}
process.exit(1);
