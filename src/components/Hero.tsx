import { useMemo } from "react";
import { ITUNES } from "../data/itunes";
import { IMG, releaseByIt, tracksOf, upcomingEvents } from "../data/site";
import { usePlayer } from "../context/player";
import { useUI } from "../context/ui";
import { btn, Img, pad2, splitDiff, useNow } from "./ui";
import { IFilm, IPause, IPlay, ISparkle } from "./icons";
import { cn } from "../utils/cn";

const WAVE =
  "M0 120 C240 60 480 180 720 120 C960 60 1200 180 1440 120 C1680 60 1920 180 2160 120 C2400 60 2640 180 2880 120 V200 H0 Z";

export function Waves({ fill = "#050a13", back = "#11213a", className }: { fill?: string; back?: string; className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-x-0 bottom-0 h-28 overflow-hidden md:h-36", className)}>
      <svg className="absolute bottom-0 h-full w-[200%] animate-wave-slow opacity-50" viewBox="0 0 2880 200" preserveAspectRatio="none">
        <path d={WAVE} fill={back} />
      </svg>
      <svg className="absolute bottom-0 h-3/4 w-[200%] animate-wave" viewBox="0 0 2880 200" preserveAspectRatio="none" style={{ animationDirection: "reverse" }}>
        <path d={WAVE} fill={fill} />
      </svg>
    </div>
  );
}

export function Bubbles({ count = 16 }: { count?: number }) {
  const list = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) => (((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1) + 1) % 1;
        return { left: `${r(1) * 100}%`, size: 6 + r(2) * 22, dur: 12 + r(3) * 14, delay: -r(4) * 20 };
      }),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {list.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={{ left: b.left, width: b.size, height: b.size, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }}
        />
      ))}
    </div>
  );
}

function NextEventCard() {
  const now = useNow(1000);
  const next = upcomingEvents(now)[0];
  if (!next) return null;
  const d = splitDiff(next.at - now);
  const cells: [string, string][] = [
    ["天", String(d.d)],
    ["时", pad2(d.h)],
    ["分", pad2(d.m)],
    ["秒", pad2(d.s)],
  ];
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between text-[11px] tracking-[0.3em] text-aqua">
        <span>NEXT · {next.tag}</span>
        <span className="tracking-normal text-mist/70">
          {new Date(next.at).toLocaleDateString("zh-CN", { timeZone: "Asia/Tokyo", year: "numeric", month: "long", day: "numeric" })}
        </span>
      </div>
      <p className="mt-2 text-foam">{next.title}</p>
      <p className="text-xs text-mist">{next.sub}</p>
      <div className="mt-3 grid grid-cols-4 gap-2 text-center">
        {cells.map(([l, v]) => (
          <div key={l} className="rounded-xl bg-abyss/60 py-2">
            <p className="font-mincho text-3xl tabular-nums leading-none text-foam">{v}</p>
            <p className="mt-1 text-[10px] text-mist">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const p = usePlayer();
  const ui = useUI();
  const latest = releaseByIt(6801506162)!;
  const it = ITUNES[latest.it];
  const tracks = useMemo(() => tracksOf(latest.it), [latest.it]);
  const albumPlaying = p.playing && !!p.current?.key.startsWith(`${latest.it}-`);

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={IMG.hero}
          alt="八木海莉 官方艺人照"
          referrerPolicy="no-referrer"
          className="h-full w-full animate-slowzoom object-cover object-[64%_25%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/70 to-abyss/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/5 to-abyss/60" />
      </div>
      <Bubbles />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pb-40 pt-28 md:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="flex items-center gap-3 text-[11px] tracking-[0.45em] text-aqua">
              UNOFFICIAL FAN SITE <span className="h-px w-10 bg-aqua/60" /> 粉丝应援站
            </p>
            <h1 className="mt-6 font-mincho text-[19vw] leading-[0.95] tracking-wider text-foam drop-shadow-[0_8px_30px_rgba(0,0,0,.5)] sm:text-8xl md:text-[9rem]">
              八木海莉
            </h1>
            <p className="mt-4 font-serif text-3xl italic text-foam/80 md:text-4xl">
              Yagi Kairi <span className="text-aqua">·</span> <span className="font-mincho text-2xl not-italic md:text-3xl">やぎ かいり</span>
            </p>
            <p className="mt-6 max-w-2xl leading-relaxed text-mist">
              <span className="block">2002.09.05 生于广岛 · Sony Music Artists / Ki/oon Music 旗下创作歌手</span>
              <span className="mt-1 block text-foam/80">以凛然而清澈的歌声，陪你停下来，喝杯茶，喘口气。</span>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => (albumPlaying ? p.pause() : p.playQueue(tracks))} className={btn.primary}>
                {albumPlaying ? <IPause size={16} /> : <IPlay size={16} />} 试听新 EP《all = one》
              </button>
              <button onClick={() => ui.openVideo("dFJoPom_Rg8")} className={btn.ghost}>
                <IFilm size={16} /> 观看「シリウス」MV
              </button>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-5">
            <button
              onClick={() => ui.openRelease(latest)}
              className="glass group flex w-full items-center gap-4 rounded-2xl p-3 text-left transition hover:border-aqua/50"
            >
              <Img src={it?.cover} alt="all = one" className="h-24 w-24 shrink-0 rounded-xl object-cover shadow-lg transition group-hover:scale-[1.03] sm:h-28 sm:w-28" />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-[11px] tracking-[0.3em] text-coral">
                  <ISparkle size={12} /> NEW RELEASE
                </p>
                <p className="mt-1 font-mincho text-2xl text-foam">all = one</p>
                <p className="text-xs text-mist">3rd EP · 2026.08.26 配信 · 5 曲</p>
                <p className="mt-2 truncate text-xs text-foam/60">PERFECT END / color / sweet home / 君がさ / シリウス</p>
              </div>
            </button>
            <NextEventCard />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute right-7 top-28 z-10 hidden font-mincho text-sm tracking-[0.6em] text-foam/50 [writing-mode:vertical-rl] xl:block">
        お茶でも飲んで、ひと休み。
      </div>
      <a href="#news" className="absolute bottom-24 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.4em] text-mist md:flex">
        SCROLL
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-aqua to-transparent" />
      </a>
      <Waves />
    </section>
  );
}

const MARQUEE = [
  "Ripe Aster", "お茶でも飲んで", "SELF HELP", "海が乾く頃", "僕らの永夜", "君への戦", "刺激による彼ら", "健やかDE居たい",
  "さらば、私の星", "メタモルフォーゼ", "know me...", "recall", "脳内シネマ", "color", "sweet home", "君がさ", "シリウス",
  "Sing My Pleasure", "TINY LUCK",
];

export function Marquee() {
  const row = (k: string) => (
    <div key={k} className="flex shrink-0 items-center" aria-hidden={k === "b"}>
      {MARQUEE.map((w) => (
        <span key={w} className="flex items-center">
          <span className="px-6 font-serif text-2xl italic text-foam/60 md:text-3xl">{w}</span>
          <span className="text-aqua/60">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-deep/60 py-5">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
