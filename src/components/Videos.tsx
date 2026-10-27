import { useState } from "react";
import { VCAT_LABEL, VIDEOS, type VCat, type Video } from "../data/site";
import { useUI } from "../context/ui";
import { Chip, Reveal, SectionHead, YtThumb } from "./ui";
import { IPlay } from "./icons";
import { cn } from "../utils/cn";

export function VideoCard({ v, tone = "aqua" }: { v: Video; tone?: "aqua" | "neon" }) {
  const ui = useUI();
  return (
    <button onClick={() => ui.openVideo(v)} className="group block w-full text-left">
      <div
        className={cn(
          "relative aspect-video overflow-hidden rounded-xl bg-tide ring-1 transition",
          tone === "neon" ? "ring-neon-pink/30 group-hover:ring-volt group-hover:shadow-[0_0_30px_-5px_rgba(242,255,61,.5)]" : "ring-white/10",
        )}
      >
        <YtThumb v={v} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-abyss/20 transition group-hover:bg-transparent" />
        <span
          className={cn(
            "absolute bottom-2 right-2 grid h-9 w-9 place-items-center rounded-full bg-abyss/70 text-foam backdrop-blur transition",
            tone === "neon" ? "group-hover:bg-volt group-hover:text-abyss" : "group-hover:bg-aqua group-hover:text-abyss",
          )}
        >
          <IPlay size={14} />
        </span>
        {v.date && (
          <span className="absolute left-2 top-2 rounded bg-abyss/70 px-1.5 py-0.5 text-[10px] tabular-nums text-foam/80 backdrop-blur">{v.date}</span>
        )}
      </div>
      <p className={cn("mt-3 truncate font-mincho text-foam transition", tone === "neon" ? "group-hover:text-volt" : "group-hover:text-aqua")}>{v.title}</p>
      <p className="truncate text-xs text-mist">{v.sub}</p>
    </button>
  );
}

const CATS: (VCat | "all")[] = ["mv", "live", "making", "anime", "denon", "other", "all"];

export function Videos() {
  const ui = useUI();
  const [cat, setCat] = useState<VCat | "all">("mv");
  const list = VIDEOS.filter((v) => cat === "all" || v.cat === cat);
  const featured = VIDEOS[0];

  return (
    <section id="video" className="relative overflow-hidden bg-deep py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          no="04"
          en="Video"
          zh="影像"
          desc={`收录 ${VIDEOS.length} 支官方影像——MV、现场、幕后花絮、动画联动与 YouTube 电台「ぐうたらじお」。点击即可在站内播放。`}
        />
        <Reveal>
          <button
            onClick={() => ui.openVideo(featured)}
            className="group relative block aspect-video w-full overflow-hidden rounded-3xl ring-1 ring-white/10 md:aspect-[21/9]"
          >
            <YtThumb v={featured} className="h-full w-full object-cover transition duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-abyss/90 via-abyss/30 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex flex-col justify-end p-6 text-left md:p-10">
              <p className="text-[11px] tracking-[0.35em] text-coral">LATEST MUSIC VIDEO</p>
              <p className="mt-2 font-mincho text-4xl text-foam md:text-6xl">シリウス</p>
              <p className="mt-2 text-sm text-mist">EP《all = one》终曲 · 2026.08.26 首播 · 导演 秋山七星</p>
            </div>
            <span className="absolute bottom-6 right-6 grid h-14 w-14 place-items-center rounded-full bg-foam/90 text-abyss transition group-hover:scale-110 group-hover:bg-aqua md:bottom-10 md:right-10 md:h-16 md:w-16">
              <IPlay size={24} />
            </span>
          </button>
        </Reveal>

        <div className="scrollbar-none -mx-5 mb-8 mt-12 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
          {CATS.map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)} activeClass={c === "denon" ? "border-volt bg-volt text-abyss" : undefined}>
              {VCAT_LABEL[c]} <span className="ml-1 opacity-60">{c === "all" ? VIDEOS.length : VIDEOS.filter((v) => v.cat === c).length}</span>
            </Chip>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((v) => (
            <div key={`${cat}-${v.id}`} className="animate-fadein">
              <VideoCard v={v} tone={v.cat === "denon" ? "neon" : "aqua"} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
