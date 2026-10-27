import { useEffect, useMemo, useRef, useState } from "react";
import { ITUNES } from "../data/itunes";
import { CAT_LABEL, RELEASES, tracksOf, type Cat, type Release } from "../data/site";
import { usePlayer } from "../context/player";
import { useUI } from "../context/ui";
import { Chip, Img, Reveal, SectionHead } from "./ui";
import { IExternal, IPause, IPlay } from "./icons";
import { cn } from "../utils/cn";
import { parseShelf, releaseDate, selectReleases, type ShelfFilters } from "../utils/releaseShelf";

const CATS: (Cat | "all")[] = ["all", "single", "ep", "digital", "denon", "anime", "collab"];
const dateOf = (r: Release) => releaseDate(r, ITUNES[r.it]);
const SHELF_KEY = "kairi:release-shelf:v1";
const knownIds = new Set(RELEASES.map(r => r.it));
const years = [...new Set(RELEASES.map(r => dateOf(r).slice(0, 4)).filter(Boolean))].sort().reverse();
function loadShelf() {
  try { return { ids: parseShelf(localStorage.getItem(SHELF_KEY), knownIds), available: true }; }
  catch { return { ids: new Set<number>(), available: false }; }
}

export function ReleaseCard({ r, size = "md", saved, onSave }: { r: Release; size?: "md" | "sm"; saved?: boolean; onSave?: () => void }) {
  const p = usePlayer();
  const ui = useUI();
  const c = ITUNES[r.it];
  const playingThis = p.playing && !!p.current?.key.startsWith(`${r.it}-`);
  const isDenon = r.cats.includes("denon");
  return (
    <div className="group">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-tide shadow-lg ring-1 ring-white/10">
        <button onClick={() => ui.openRelease(r)} className="absolute inset-0" aria-label={`查看 ${r.title}`}>
          <Img src={c?.cover} alt={r.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        </button>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        {r.tag && (
          <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-coral px-2 py-0.5 text-[10px] font-medium tracking-wider text-abyss">
            {r.tag}
          </span>
        )}
        {isDenon && (
          <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-volt px-2 py-0.5 text-[10px] font-bold text-abyss">⚡</span>
        )}
        <button
          onClick={() => (playingThis ? p.pause() : p.playQueue(tracksOf(r.it)))}
          className={cn(
            "absolute bottom-3 right-3 grid place-items-center rounded-full text-abyss shadow-xl transition",
            size === "sm" ? "h-9 w-9" : "h-11 w-11",
            isDenon ? "bg-volt" : "bg-aqua",
            playingThis ? "opacity-100" : "opacity-100 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100",
          )}
          aria-label={playingThis ? "暂停" : `试听 ${r.title}`}
        >
          {playingThis ? <IPause size={size === "sm" ? 14 : 18} /> : <IPlay size={size === "sm" ? 14 : 18} />}
        </button>
      </div>
      <button onClick={() => ui.openRelease(r)} className="mt-3 block w-full text-left">
        <p className={cn("truncate font-mincho text-foam transition group-hover:text-aqua", size === "sm" ? "text-sm" : "text-base")}>{r.title}</p>
        <p className="mt-0.5 truncate text-xs text-mist">{r.kind}</p>
        <p className="text-xs tabular-nums text-mist/60">{dateOf(r).replace(/-/g, ".")}</p>
      </button>
      {onSave && (
        <button type="button" onClick={onSave} aria-pressed={saved} aria-label={`${saved ? '移出' : '加入'}唱片架：${r.title}`}
          className={cn("mt-3 rounded-full border px-3 py-1.5 text-[11px] transition", saved ? "border-aqua/40 bg-aqua/10 text-aqua" : "border-white/15 text-mist hover:border-aqua/50 hover:text-aqua")}>
          {saved ? '✦ 已放入唱片架' : '＋ 放入唱片架'}
        </button>
      )}
    </div>
  );
}

export function Discography() {
  const [cat, setCat] = useState<Cat | "all">("all");
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('all');
  const [sort, setSort] = useState<ShelfFilters['sort']>('new');
  const [savedOnly, setSavedOnly] = useState(false);
  const [initialShelf] = useState(loadShelf);
  const [saved, setSaved] = useState(initialShelf.ids);
  const storageAvailable = useRef(initialShelf.available);
  const [notice, setNotice] = useState(initialShelf.available ? '' : '当前浏览器无法长期保存收藏，本次打开期间仍可使用唱片架。');
  const shelfButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== null && event.key !== SHELF_KEY) return;
      setSaved(parseShelf(event.key === null ? null : event.newValue, knownIds));
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const toggleSaved = (id: number) => {
    let next = new Set(saved);
    if (storageAvailable.current) {
      const latest = loadShelf();
      if (latest.available) next = latest.ids;
      else storageAvailable.current = false;
    }
    if (next.has(id)) next.delete(id); else next.add(id);
    if (savedOnly && !next.has(id)) shelfButton.current?.focus({ preventScroll: true });
    setSaved(next);
    try {
      localStorage.setItem(SHELF_KEY, JSON.stringify([...next]));
      storageAvailable.current = true; setNotice('');
    } catch {
      storageAvailable.current = false;
      setNotice('当前浏览器无法长期保存收藏，本次打开期间仍可使用唱片架。');
    }
  };
  const list = useMemo(() => selectReleases(RELEASES, ITUNES, { query, category: cat, year, sort, savedOnly, saved }), [query, cat, year, sort, savedOnly, saved]);
  const count = (c: Cat | "all") => (c === "all" ? RELEASES.length : RELEASES.filter((r) => r.cats.includes(c)).length);
  const reset = () => { setQuery(''); setCat('all'); setYear('all'); setSort('new'); setSavedOnly(false); };

  return (
    <section id="music" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          no="03"
          en="Discography"
          zh="作品一览"
          desc={`从 Vivy 时期的角色歌到最新 EP，共收录 ${RELEASES.length} 部作品。点击封面查看曲目与制作信息，按 ▶ 即可试听。`}
        />
        <Reveal>
          <div className="scrollbar-none -mx-5 mb-10 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
            {CATS.map((c) => (
              <Chip key={c} active={cat === c} onClick={() => setCat(c)} activeClass={c === "denon" ? "border-volt bg-volt text-abyss" : undefined}>
                {CAT_LABEL[c]} <span className="ml-1 opacity-60">{count(c)}</span>
              </Chip>
            ))}
          </div>
        </Reveal>
        <div className="mb-9 rounded-2xl border border-aqua/15 bg-gradient-to-br from-reef/70 to-deep/70 p-5 md:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[10px] tracking-[.17em] text-aqua/80">YOUR RECORD SHELF · 找到想再听一次的声音</p>
            <button type="button" ref={shelfButton} aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}
              className={cn("rounded-full border px-4 py-2 text-sm transition", savedOnly ? "border-aqua bg-aqua text-abyss" : "border-aqua/30 text-aqua hover:bg-aqua/10")}>
              我的唱片架 · {saved.size}
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_140px_150px]">
            <label className="block min-w-0 text-xs text-mist">歌名 / 作品 / 动画
              <input type="search" value={query} maxLength={200} onChange={e => setQuery(e.target.value)} placeholder="试试 Vivy、シリウス、作曲者…"
                className="mt-2 w-full rounded-xl border border-white/15 bg-abyss/60 px-3 py-2.5 text-sm text-foam placeholder:text-mist/60" />
            </label>
            <label className="block text-xs text-mist">发行年份
              <select value={year} onChange={e => setYear(e.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-deep px-3 py-2.5 text-sm text-foam">
                <option value="all">全部年份</option>{years.map(y => <option key={y}>{y}</option>)}
              </select>
            </label>
            <label className="block text-xs text-mist">排序方式
              <select value={sort} onChange={e => setSort(e.target.value as ShelfFilters['sort'])} className="mt-2 w-full rounded-xl border border-white/15 bg-deep px-3 py-2.5 text-sm text-foam">
                <option value="new">最新发行</option><option value="old">从出道听起</option><option value="title">作品名顺序</option>
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <p role="status" aria-live="polite" className="text-mist">找到 {list.length} / {RELEASES.length} 部作品</p>
            <button type="button" onClick={reset} className="text-aqua underline decoration-aqua/30 underline-offset-4 hover:decoration-aqua">重置筛选</button>
          </div>
          {notice && <p className="mt-3 text-xs leading-relaxed text-coral" role="status">{notice}</p>}
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {list.map((r) => (
            <div key={r.it} className="animate-fadein">
              <ReleaseCard r={r} saved={saved.has(r.it)} onSave={() => toggleSaved(r.it)} />
            </div>
          ))}
        </div>
        {!list.length && <div className="rounded-2xl border border-dashed border-aqua/25 bg-deep/40 px-5 py-14 text-center">
          <p className="font-mincho text-xl text-foam">{savedOnly ? '唱片架里，还没有符合条件的声音。' : '暂时没有找到这首歌。'}</p>
          <p className="mt-3 text-sm text-mist">换个关键词、调整年份，或把喜欢的作品放入唱片架。</p>
          <button type="button" onClick={reset} className="mt-5 rounded-full border border-aqua/30 px-5 py-2 text-sm text-aqua">看看全部作品</button>
        </div>}
        <Reveal>
          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-deep/50 p-5 text-sm text-mist">
            <p>封面来自 Apple Music / Sony Music 官方；试听片段由 Apple Music 提供（30 秒）。请支持正版！</p>
            <a
              href="https://www.sonymusic.co.jp/artist/yagikairi/discography/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-aqua hover:underline"
            >
              Sony Music 官方 Discography <IExternal />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
