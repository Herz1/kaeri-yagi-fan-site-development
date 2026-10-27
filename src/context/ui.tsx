import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ITUNES } from "../data/itunes";
import { cleanArtist, tracksOf, VCAT_LABEL, videoById, type Release, type Video } from "../data/site";
import { usePlayer } from "./player";
import { IClose, IExternal, IFilm, IPause, IPlay } from "../components/icons";
import { btn, EqIcon, fmt, Img } from "../components/ui";
import { cn } from "../utils/cn";

interface UIAPI {
  openVideo: (v: Video | string) => void;
  openRelease: (r: Release) => void;
}
const Ctx = createContext<UIAPI | null>(null);

export function useUI() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useUI must be used inside <UIProvider>");
  return c;
}

export function UIProvider({ children }: { children: ReactNode }) {
  const { pause } = usePlayer();
  const [video, setVideo] = useState<Video | null>(null);
  const [release, setRelease] = useState<Release | null>(null);

  const openVideo = useCallback(
    (v: Video | string) => {
      const vv: Video = typeof v === "string" ? videoById(v) ?? { id: v, title: "Video", sub: "", cat: "mv" } : v;
      pause();
      setVideo(vv);
    },
    [pause],
  );
  const openRelease = useCallback((r: Release) => setRelease(r), []);
  const api = useMemo(() => ({ openVideo, openRelease }), [openVideo, openRelease]);

  const open = !!video || !!release;
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (video) setVideo(null);
      else setRelease(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, video]);

  return (
    <Ctx.Provider value={api}>
      {children}
      {release && <ReleaseModal key={release.it} r={release} onClose={() => setRelease(null)} onVideo={openVideo} />}
      {video && <VideoModal v={video} onClose={() => setVideo(null)} />}
    </Ctx.Provider>
  );
}

function VideoModal({ v, onClose }: { v: Video; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-black/90 p-4 backdrop-blur-sm animate-fadein"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] tracking-[0.3em] text-aqua">
              {VCAT_LABEL[v.cat]}
              {v.date ? ` · ${v.date}` : ""}
            </p>
            <h3 className="truncate font-mincho text-xl sm:text-2xl">{v.title}</h3>
            <p className="truncate text-sm text-mist">{v.sub}</p>
          </div>
          <button onClick={onClose} className="shrink-0 rounded-full border border-white/15 p-2 text-mist hover:text-foam" aria-label="关闭">
            <IClose />
          </button>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={v.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-4 text-xs text-mist">
          <span>影像来自 YouTube 官方频道 · 按 Esc 关闭</span>
          <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-aqua">
            在 YouTube 打开 <IExternal />
          </a>
        </div>
      </div>
    </div>
  );
}

function ReleaseModal({ r, onClose, onVideo }: { r: Release; onClose: () => void; onVideo: (id: string) => void }) {
  const p = usePlayer();
  const c = ITUNES[r.it];
  const tracks = useMemo(() => tracksOf(r.it), [r.it]);
  const covers = [c?.cover, ...(r.jackets ?? [])].filter(Boolean) as string[];
  const [ci, setCi] = useState(0);
  const albumPlaying = p.playing && !!p.current?.key.startsWith(`${r.it}-`);
  const meta: [string, string | undefined][] = [
    ["发行", r.date],
    ["规格", r.format],
    ["Oricon", r.oricon],
    ["Tie-up", r.tieup],
    ["制作", r.credit],
  ];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-abyss/85 backdrop-blur-md animate-fadein sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl border border-white/10 bg-deep shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full bg-abyss/70 p-2 text-mist hover:text-foam" aria-label="关闭">
          <IClose />
        </button>
        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[minmax(0,300px)_1fr]">
          <div>
            <div className="aspect-square overflow-hidden rounded-2xl bg-tide shadow-xl ring-1 ring-white/10">
              <Img src={covers[ci]} alt={r.title} className="h-full w-full object-cover" />
            </div>
            {covers.length > 1 && (
              <>
                <div className="mt-3 flex flex-wrap gap-2">
                  {covers.map((src, i) => (
                    <button
                      key={src}
                      onClick={() => setCi(i)}
                      className={cn("h-14 w-14 overflow-hidden rounded-lg ring-2 transition", ci === i ? "ring-aqua" : "ring-transparent opacity-60 hover:opacity-100")}
                    >
                      <Img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-mist/70">切换：配信封面 / Sony Music 官方 Jacket</p>
              </>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-xs tracking-[0.3em] text-aqua">{r.kind}</p>
            <h3 className="mt-2 pr-10 font-mincho text-3xl leading-tight text-foam sm:text-4xl">{r.title}</h3>
            <p className="mt-1 text-sm text-mist">{c ? cleanArtist(c.artist) : "八木海莉"}</p>
            <dl className="mt-5 space-y-2 text-sm">
              {meta
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <dt className="w-14 shrink-0 text-mist/70">{k}</dt>
                    <dd className="text-foam/90">{v}</dd>
                  </div>
                ))}
            </dl>
            <p className="mt-5 leading-relaxed text-foam/80">{r.note}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              <button onClick={() => (albumPlaying ? p.pause() : p.playQueue(tracks))} className={btn.primary}>
                {albumPlaying ? <IPause size={16} /> : <IPlay size={16} />}
                {albumPlaying ? "暂停" : "试听全部"}
              </button>
              {r.mv && (
                <button onClick={() => onVideo(r.mv!)} className={btn.ghost}>
                  <IFilm size={16} /> 观看影像
                </button>
              )}
              {c?.apple && (
                <a href={c.apple} target="_blank" rel="noreferrer" className={btn.ghost}>
                  Apple Music <IExternal />
                </a>
              )}
              {r.link && (
                <a href={r.link} target="_blank" rel="noreferrer" className={btn.ghost}>
                  官方配信 / 购买 <IExternal />
                </a>
              )}
            </div>

            <ol className="mt-6 divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-abyss/40">
              {tracks.map((t, i) => {
                const cur = p.current?.key === t.key;
                return (
                  <li key={t.key}>
                    <button
                      onClick={() => (cur ? p.toggle() : p.playQueue(tracks, i))}
                      className={cn("flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/5", cur && "bg-aqua/10")}
                    >
                      <span className="w-6 text-center text-xs tabular-nums text-mist">
                        {cur && p.playing ? <EqIcon className="text-aqua" /> : String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={cn("min-w-0 flex-1 truncate text-sm", cur ? "text-aqua" : "text-foam/90")}>{t.title}</span>
                      <span className="text-xs tabular-nums text-mist/70">{fmt(t.sec)}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 text-[11px] leading-relaxed text-mist/60">
              ▶ 为 Apple Music 提供的 30 秒试听片段。请通过正版平台收听完整版、支持艺人。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
