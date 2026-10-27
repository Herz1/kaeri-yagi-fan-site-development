import { usePlayer, usePlayerTime } from "../context/player";
import { starterQueue } from "../data/site";
import { IClose, IExternal, INext, IPause, IPlay, IPrev } from "./icons";
import { fmt, Img } from "./ui";
import { Visualizer } from "./Visualizer";
import { cn } from "../utils/cn";

export function PlayerBar() {
  const p = usePlayer();
  const { time, duration } = usePlayerTime();

  if (!p.current) {
    return (
      <button
        onClick={() => p.playQueue(starterQueue())}
        aria-label="开始收听入坑歌单"
        className="glass group fixed bottom-4 right-4 z-40 flex items-center gap-3 rounded-full p-1.5 shadow-xl transition hover:border-aqua/50 sm:bottom-6 sm:right-6 sm:py-2 sm:pl-2 sm:pr-5"
      >
        <span className="relative grid h-11 w-11 place-items-center rounded-full bg-aqua text-abyss sm:h-10 sm:w-10">
          <span className="absolute inset-0 animate-ping rounded-full bg-aqua/40" />
          <IPlay size={18} className="relative" />
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-[11px] text-mist">入坑歌单 · 7 首试听</span>
          <span className="block text-sm text-foam">开始收听八木海莉</span>
        </span>
      </button>
    );
  }

  const t = p.current;
  const pct = duration ? Math.min(100, (time / duration) * 100) : 0;
  const isDenon = t.artist.includes("電音");

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-2 pb-2 sm:px-4 sm:pb-4">
      <div className="glass mx-auto max-w-5xl overflow-hidden rounded-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,.85)]">
        <div
          className="group relative h-1.5 cursor-pointer bg-white/10"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            p.seek((e.clientX - r.left) / r.width);
          }}
          role="slider"
          aria-label="播放进度"
          aria-valuenow={Math.round(pct)}
        >
          <div
            className={cn("absolute inset-y-0 left-0 transition-[width] duration-200", isDenon ? "bg-gradient-to-r from-neon-pink via-volt to-neon-cyan" : "bg-gradient-to-r from-aqua-deep to-aqua")}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center gap-3 p-2.5 sm:gap-4 sm:p-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10">
            <Img src={t.cover} alt={t.album} className="h-full w-full object-cover" />
            {p.loading && (
              <span className="absolute inset-0 grid place-items-center bg-abyss/60">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-aqua border-t-transparent" />
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foam">{t.title}</p>
            <p className="truncate text-xs text-mist">
              {t.artist} · 《{t.album}》 <span className="text-mist/50">· {p.index + 1}/{p.queue.length}</span>
            </p>
          </div>
          <Visualizer
            className="hidden h-9 w-36 md:block"
            bars={28}
            from={isDenon ? "#ff3fb0" : "#35aebf"}
            to={isDenon ? "#f2ff3d" : "#7fdbe6"}
          />
          <span className="hidden w-[76px] text-right text-[11px] tabular-nums text-mist sm:block">
            {fmt(time)} / {fmt(duration)}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={p.prev} className="rounded-full p-2 text-mist transition hover:text-foam" aria-label="上一首">
              <IPrev size={18} />
            </button>
            <button
              onClick={p.toggle}
              className={cn("grid h-10 w-10 place-items-center rounded-full text-abyss transition hover:scale-105", isDenon ? "bg-volt" : "bg-aqua")}
              aria-label={p.playing ? "暂停" : "播放"}
            >
              {p.playing ? <IPause size={18} /> : <IPlay size={18} />}
            </button>
            <button
              onClick={p.next}
              disabled={p.index >= p.queue.length - 1}
              className="rounded-full p-2 text-mist transition hover:text-foam disabled:opacity-30"
              aria-label="下一首"
            >
              <INext size={18} />
            </button>
          </div>
          <a
            href={t.apple}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-xs text-mist transition hover:text-aqua lg:inline-flex"
          >
            完整版 <IExternal size={12} />
          </a>
          <button onClick={p.stop} className="rounded-full p-1.5 text-mist transition hover:text-foam" aria-label="关闭播放器">
            <IClose size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
