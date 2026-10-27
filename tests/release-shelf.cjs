const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const cache = new Map();
function loadTs(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file);
  const module = { exports: {} }; cache.set(file, module.exports);
  const source = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  vm.runInNewContext(source, { module, exports: module.exports, require: spec => loadTs(path.resolve(path.dirname(file), spec + '.ts')) }, { filename: file });
  return module.exports;
}
const { normalizeSearch, releaseDate, parseShelf, selectReleases } = loadTs('src/utils/releaseShelf.ts');
const { RELEASES } = loadTs('src/data/site.ts');
const { ITUNES } = loadTs('src/data/itunes.ts');
const filters = { query: '', category: 'all', year: 'all', sort: 'new', savedOnly: false, saved: new Set() };
const catalogue = [
  { it: 1, title: 'Vivy', kind: '歌曲集', cats: ['anime'], date: '2021.06.30', tieup: '动画', credit: '神前暁' },
  { it: 2, title: 'Bright', kind: 'EP', cats: ['ep'], date: '2026.08.26', note: 'next release' },
  { it: 3, title: 'Action', kind: '数字单曲', cats: ['digital'], date: '2025.06.27' },
];
const details = { 1: { tracks: [{ title: 'My Code' }] }, 2: { date: '2026-08-26' } };
const choose = overrides => [...selectReleases(catalogue, details, { ...filters, ...overrides })].map(x => x.it);
test('search normalizes full width letters and whitespace', () => {
  assert.equal(normalizeSearch('  ＶＩＶＹ  '), 'vivy');
  assert.deepEqual(choose({ query: 'ＶＩＶＹ  code' }), [1]);
});
test('search includes track, tie-up and production credits', () => {
  assert.deepEqual(choose({ query: '神前暁 code 动画' }), [1]);
  assert.deepEqual(choose({ query: 'code absent' }), []);
});
test('category, year, keyword and saved-only filters compose', () => {
  assert.deepEqual(choose({ query: 'Vivy', category: 'anime', year: '2021', savedOnly: true, saved: new Set([1]) }), [1]);
  assert.deepEqual(choose({ category: 'anime', year: '2026' }), []);
  assert.deepEqual(choose({ savedOnly: true, saved: new Set([2]) }), [2]);
});
test('sorting does not mutate the original catalogue', () => {
  assert.deepEqual(choose({ sort: 'new' }), [2, 3, 1]);
  assert.deepEqual(choose({ sort: 'old' }), [1, 3, 2]);
  assert.deepEqual(choose({ sort: 'title' }), [3, 2, 1]);
  assert.deepEqual(catalogue.map(x => x.it), [1, 2, 3]);
});
test('missing iTunes dates fall back to the curated release date', () => {
  assert.equal(releaseDate(catalogue[0], details[1]), '2021-06-30');
});
test('saved IDs are validated, bounded and deduplicated', () => {
  const known = new Set([1, 2]);
  assert.deepEqual([...parseShelf('[1,1,2,3,"1",null,1.1,{}]', known)], [1, 2]);
  for (const raw of ['bad', '{}', 'null', ' '.repeat(20001), JSON.stringify(Array(1001).fill(1))]) assert.equal(parseShelf(raw, known).size, 0);
});
test('real catalogue keeps all 30 records and finds six Vivy-related releases', () => {
  assert.equal(RELEASES.length, 30);
  assert.equal(selectReleases(RELEASES, ITUNES, filters).length, 30);
  const matches = selectReleases(RELEASES, ITUNES, { ...filters, query: 'Vivy' });
  assert.equal(matches.length, 6);
  assert.ok(matches.some(release => release.title === 'Galaxy Anthem')); // Diva appears in the work's note.
});
test('empty saved collections remain empty and reset restores all works', () => {
  assert.equal(selectReleases(RELEASES, ITUNES, { ...filters, savedOnly: true }).length, 0);
  assert.equal(selectReleases(RELEASES, ITUNES, filters).length, 30);
});
