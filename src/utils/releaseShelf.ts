export interface ShelfRelease {
  it: number;
  title: string;
  kind: string;
  cats: readonly string[];
  date?: string;
  note?: string;
  tieup?: string;
  credit?: string;
}

export interface ShelfCollection {
  date?: string;
  tracks?: readonly { title: string }[];
}

export interface ShelfFilters {
  query: string;
  category: string;
  year: string;
  sort: 'new' | 'old' | 'title';
  savedOnly: boolean;
  saved: ReadonlySet<number>;
}

export const normalizeSearch = (value: string) => value.normalize('NFKC').toLocaleLowerCase().trim();
export const releaseDate = (release: ShelfRelease, collection?: ShelfCollection) =>
  (collection?.date || release.date || '').replace(/\./g, '-');

export function parseShelf(raw: string | null, knownIds: ReadonlySet<number>): Set<number> {
  if (!raw || raw.length > 20000) return new Set();
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data) || data.length > 1000) return new Set();
    return new Set(data.filter((id): id is number => typeof id === 'number' && Number.isSafeInteger(id) && knownIds.has(id)));
  } catch {
    return new Set();
  }
}

export function selectReleases<T extends ShelfRelease>(releases: readonly T[], collections: Readonly<Record<number, ShelfCollection>>, filters: ShelfFilters): T[] {
  const words = normalizeSearch(filters.query).split(/\s+/).filter(Boolean);
  return releases.filter(release => {
    if (filters.category !== 'all' && !release.cats.includes(filters.category)) return false;
    if (filters.year !== 'all' && releaseDate(release, collections[release.it]).slice(0, 4) !== filters.year) return false;
    if (filters.savedOnly && !filters.saved.has(release.it)) return false;
    const searchable = normalizeSearch([
      release.title, release.kind, release.note, release.tieup, release.credit,
      ...(collections[release.it]?.tracks?.map(track => track.title) ?? []),
    ].filter(Boolean).join(' '));
    return words.every(word => searchable.includes(word));
  }).sort((a, b) => filters.sort === 'title'
    ? a.title.localeCompare(b.title, 'ja')
    : (filters.sort === 'old' ? 1 : -1) * releaseDate(a, collections[a.it]).localeCompare(releaseDate(b, collections[b.it])));
}
