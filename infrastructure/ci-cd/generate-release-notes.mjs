import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const [currentTag, releaseNotesPathArg] = process.argv.slice(2);

if (!currentTag) {
  console.error('Usage: node infrastructure/ci-cd/generate-release-notes.mjs <tag> [release-notes-path]');
  process.exit(1);
}

const currentFilePath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFilePath), '..', '..');
const changelogPath = path.join(repoRoot, 'CHANGELOG.md');
const releaseNotesPath = releaseNotesPathArg
  ? path.resolve(process.cwd(), releaseNotesPathArg)
  : path.join(repoRoot, 'release-notes.md');

function runGit(args) {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8'
  }).trim();
}

function getPreviousTag(tag) {
  try {
    return runGit(['describe', '--tags', '--abbrev=0', `${tag}^`]);
  } catch {
    return '';
  }
}

function getTagDate(tag) {
  return runGit(['log', '-1', '--format=%cs', tag]);
}

function getCommitSubjects(tag, previousTag) {
  const range = previousTag ? `${previousTag}..${tag}` : tag;
  const output = runGit(['log', '--pretty=format:%s|%h', range]);

  if (!output) {
    return [];
  }

  return output
    .split('\n')
    .map((line) => {
      const [subject, shortSha] = line.split('|');
      return { subject: subject.trim(), shortSha: shortSha.trim() };
    })
    .filter((entry) => entry.subject);
}

function classify(subject) {
  const normalized = subject.toLowerCase();

  if (normalized.startsWith('feat') || normalized.includes('feature')) {
    return 'Features';
  }

  if (normalized.startsWith('fix') || normalized.includes('bug')) {
    return 'Fixes';
  }

  if (normalized.startsWith('docs') || normalized.startsWith('doc')) {
    return 'Documentation';
  }

  return 'Other';
}

function buildSection(title, entries) {
  if (entries.length === 0) {
    return '';
  }

  const lines = entries.map((entry) => `- ${entry.subject} (${entry.shortSha})`);
  return `### ${title}\n\n${lines.join('\n')}`;
}

function buildReleaseNotes({ tag, date, previousTag, commits }) {
  const grouped = {
    Features: [],
    Fixes: [],
    Documentation: [],
    Other: []
  };

  commits.forEach((entry) => {
    grouped[classify(entry.subject)].push(entry);
  });

  const sections = [
    buildSection('Features', grouped.Features),
    buildSection('Fixes', grouped.Fixes),
    buildSection('Documentation', grouped.Documentation),
    buildSection('Other', grouped.Other)
  ].filter(Boolean);

  const compareLine = previousTag
    ? `Changes since \`${previousTag}\`.`
    : 'Initial tagged release.';

  return [
    `## ${tag} - ${date}`,
    '',
    compareLine,
    '',
    ...sections
  ].join('\n');
}

function updateChangelog(newSection) {
  const header = '# Changelog\n\nAll notable changes to this project are documented here.\n';

  if (!fs.existsSync(changelogPath)) {
    return `${header}\n${newSection}\n`;
  }

  const existing = fs.readFileSync(changelogPath, 'utf8');
  if (existing.includes(`## ${currentTag} - `)) {
    return existing;
  }

  return `${header}\n${newSection}\n\n${existing.replace(header, '').trim()}\n`;
}

const previousTag = getPreviousTag(currentTag);
const date = getTagDate(currentTag);
const commits = getCommitSubjects(currentTag, previousTag);
const releaseNotes = buildReleaseNotes({
  tag: currentTag,
  date,
  previousTag,
  commits
});

const changelog = updateChangelog(releaseNotes);

fs.writeFileSync(releaseNotesPath, `${releaseNotes}\n`, 'utf8');
fs.writeFileSync(changelogPath, changelog, 'utf8');

console.log(`Generated release notes for ${currentTag}`);
