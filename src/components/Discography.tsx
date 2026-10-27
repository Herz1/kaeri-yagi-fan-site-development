import { useMemo, useState } from "react";
import { ITUNES } from "../data/itunes";
import { CAT_LABEL, RELEASES, tracksOf, type Cat, type Release } from "../data/site";
import { usePlayer } from "../context/player";
import { useUI } from "../context/ui";
import { Chip, Img, Reveal, SectionHead } from "./ui";
import { IExternal, IPause, IPlay } from "./icons";
import { cn } from "../utils/cn";

const CATS: (Cat | "all")[] = ["all", "single", "ep", "digital", "denon", "anime", "collab"];
const dateOf = (r: Release) => ITUNES[r.it]?.date ?? "";

export function ReleaseCard({ r, size = "md" }: { r: Release; size?: "md" | "sm" }) {
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
    </div>
  );
}

export function Discography() {
  const [cat, setCat] = useState<Cat | "all">("all");
  const list = useMemo(
    () => RELEASES.filter((r) => cat === "all" || r.cats.includes(cat)).sort((a, b) => dateOf(b).localeCompare(dateOf(a))),
    [cat],
  );
  const count = (c: Cat | "all") => (c === "all" ? RELEASES.length : RELEASES.filter((r) => r.cats.includes(c)).length);

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
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {list.map((r) => (
            <div key={r.it} className="animate-fadein">
              <ReleaseCard r={r} />
            </div>
          ))}
        </div>
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
