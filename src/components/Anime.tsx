import { useMemo } from "react";
import { ITUNES, type ItCollection } from "../data/itunes";
import { ANIME, releaseByIt, tracksOf, videoById, type AnimeWork, type PTrack, type Video } from "../data/site";
import { usePlayer } from "../context/player";
import { useUI } from "../context/ui";
import { btn, Img, Reveal, SectionHead, YtThumb } from "./ui";
import { IPause, IPlay } from "./icons";
import { cn } from "../utils/cn";

const ANIME_GOODS = [
  { it: 1567197861, title: "Sing My Pleasure", sub: "Vivy（Vo.八木海莉）· CD SVWC-70534 · Aniplex", badge: "动画绘柄" },
  { it: 1571465990, title: "Vivy Vocal Collection", sub: "～Sing for Your Smile～ · 剧中歌曲集", badge: "动画绘柄" },
  { it: 1612444825, title: "Ripe Aster 期间生产限定盘", sub: "CD+BD KSCL-3258〜3259 ·《魔法科 追忆篇》", badge: "期间限定" },
  { it: 1714589424, title: "know me...", sub: "CD+BD KSCL-3467 ·《不死不幸》ED", badge: "ED 主题曲" },
  { it: 1735889487, title: "recall - Anime version -", sub: "《魔法科》第3季 动画尺寸版", badge: "动画版" },
  { it: 1828859842, title: "ACTION！EP 初回仕様", sub: "附《真・侍伝 YAIBA》动画绘柄宽版贴纸", badge: "初回特典" },
];

function CoverStack({ covers, onPick }: { covers: { id: number; c: ItCollection }[]; onPick: (id: number) => void }) {
  if (!covers.length) return null;
  const [main, ...rest] = covers;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm">
      {rest.slice(0, 2).map((x, i) => (
        <button
          key={x.id}
          onClick={() => onPick(x.id)}
          className={cn(
            "absolute top-[6%] h-[68%] w-[68%] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 transition duration-500 hover:z-20 hover:scale-105",
            i === 0 ? "right-0 rotate-6" : "left-0 -rotate-6",
          )}
          aria-label={x.c.title}
        >
          <Img src={x.c.cover} alt={x.c.title} className="h-full w-full object-cover" />
        </button>
      ))}
      <button
        onClick={() => onPick(main.id)}
        className={cn(
          "absolute z-10 overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,.85)] ring-1 ring-white/20 transition duration-500 hover:scale-[1.02]",
          rest.length ? "inset-x-[13%] bottom-0 aspect-square" : "inset-[6%]",
        )}
        aria-label={main.c.title}
      >
        <Img src={main.c.cover} alt={main.c.title} className="h-full w-full object-cover" />
      </button>
    </div>
  );
}

function AnimeCard({ a, flip }: { a: AnimeWork; flip: boolean }) {
  const ui = useUI();
  const p = usePlayer();
  const vids = a.videos.map(videoById).filter(Boolean) as Video[];
  const covers = a.covers.map((id) => ({ id, c: ITUNES[id] })).filter((x) => x.c);
  const queue = useMemo(() => {
    const seen = new Set<string>();
    return a.covers
      .flatMap((id) => tracksOf(id, (t) => !/instrumental/i.test(t.title)))
      .filter((t: PTrack) => (seen.has(t.title) ? false : (seen.add(t.title), true)));
  }, [a.covers]);
  const keys = useMemo(() => new Set(queue.map((t) => t.key)), [queue]);
  const playingThis = p.playing && !!p.current && keys.has(p.current.key);

  return (
    <Reveal>
      <article className={cn("relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br p-6 md:p-10", a.tone)}>
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-aqua/10 blur-3xl" />
        <div className="relative grid items-center gap-10 lg:grid-cols-12">
          <div className={cn("lg:col-span-5", flip && "lg:order-2")}>
            <CoverStack
              covers={covers}
              onPick={(id) => {
                const r = releaseByIt(id);
                if (r) ui.openRelease(r);
              }}
            />
          </div>
          <div className="lg:col-span-7">
            <p className="text-[11px] tracking-[0.3em] text-aqua">{a.year}</p>
            <h3 className="mt-2 font-mincho text-3xl leading-tight text-foam md:text-4xl">{a.title}</h3>
            <p className="mt-1 text-sm text-mist">{a.zh}</p>
            <p className="mt-5 rounded-xl border border-white/10 bg-abyss/40 px-4 py-3 text-sm leading-relaxed text-foam/90">
              <span className="mr-2 font-medium text-coral">担当</span>
              {a.role}
            </p>
            <p className="mt-4 leading-relaxed text-foam/75">{a.desc}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {a.songs.map((s) => (
                <span key={s} className="rounded-full border border-white/15 bg-abyss/30 px-3 py-1 text-xs text-foam/80">
                  ♪ {s}
                </span>
              ))}
            </div>
            {a.goods && <p className="mt-4 text-xs leading-relaxed text-mist">🎁 相关作品 / 周边：{a.goods}</p>}
            {queue.length > 0 && (
              <button onClick={() => (playingThis ? p.pause() : p.playQueue(queue))} className={cn(btn.primary, "mt-6")}>
                {playingThis ? <IPause size={16} /> : <IPlay size={16} />}
                {playingThis ? "暂停" : `试听相关歌曲（${queue.length}）`}
              </button>
            )}
            {vids.length > 0 && (
              <div className="mt-6 grid grid-cols-3 gap-3">
                {vids.map((v) => (
                  <button key={v.id} onClick={() => ui.openVideo(v)} className="group text-left">
                    <div className="relative aspect-video overflow-hidden rounded-lg ring-1 ring-white/10">
                      <YtThumb v={v} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      <span className="absolute inset-0 grid place-items-center bg-abyss/40 text-foam opacity-0 transition group-hover:opacity-100">
                        <IPlay />
                      </span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-mist group-hover:text-aqua">{v.sub}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function Anime() {
  const ui = useUI();
  return (
    <section id="anime" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          no="05"
          en="Anime"
          zh="动漫联动 · 衍生形象"
          desc="从 AI 歌姬 Vivy 的歌声出发——她与 6 部动画作品的缘分。官方无字幕 OP/ED、联动影像、动画绘柄 CD 一站看齐。"
        />
        <div className="space-y-8">
          {ANIME.map((a, i) => (
            <AnimeCard key={a.key} a={a} flip={i % 2 === 1} />
          ))}
        </div>

        <Reveal className="mt-16">
          <div className="rounded-[2rem] border border-white/10 bg-deep/60 p-6 md:p-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] tracking-[0.3em] text-coral">ANIME GOODS & CD</p>
                <h3 className="mt-2 font-mincho text-3xl text-foam">动漫相关周边 / 盘</h3>
              </div>
              <a href="#goods" className="text-sm text-mist hover:text-aqua">
                全部周边 →
              </a>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ANIME_GOODS.map((g) => {
                const c = ITUNES[g.it];
                return (
                  <button
                    key={g.it}
                    onClick={() => {
                      const r = releaseByIt(g.it);
                      if (r) ui.openRelease(r);
                    }}
                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-abyss/40 p-3 text-left transition hover:border-aqua/40"
                  >
                    <Img src={c?.cover} alt={g.title} className="h-20 w-20 shrink-0 rounded-xl object-cover transition group-hover:scale-105" />
                    <div className="min-w-0">
                      <span className="rounded-full bg-aqua/15 px-2 py-0.5 text-[10px] text-aqua">{g.badge}</span>
                      <p className="mt-1.5 truncate font-mincho text-foam">{g.title}</p>
                      <p className="line-clamp-2 text-xs text-mist">{g.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
