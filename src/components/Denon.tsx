import { useMemo, useRef, type CSSProperties } from "react";
import { DENON_LIVES, DENON_MEMBERS, DENON_RELEASES, releaseByIt, tracksOf, VIDEOS, type PTrack } from "../data/site";
import { useBeat, usePlayer } from "../context/player";
import { Reveal } from "./ui";
import { ReleaseCard } from "./Discography";
import { VideoCard } from "./Videos";
import { Visualizer } from "./Visualizer";
import { IBolt, IPause } from "./icons";
import { cn } from "../utils/cn";

export function Denon() {
  const p = usePlayer();
  const ref = useRef<HTMLElement>(null);
  const queue = useMemo(() => {
    const seen = new Set<string>();
    return [1828859842, 1780274109, 1789295723, 1798949952, 1816188677]
      .flatMap((id) => tracksOf(id))
      .filter((t: PTrack) => (seen.has(t.title) ? false : (seen.add(t.title), true)));
  }, []);
  const keys = useMemo(() => new Set(DENON_RELEASES.flatMap((id) => tracksOf(id).map((t) => t.key))), []);
  const party = p.playing && !!p.current && keys.has(p.current.key);
  useBeat(ref, party);
  const vids = VIDEOS.filter((v) => v.cat === "denon");

  return (
    <section id="denon" ref={ref} style={{ "--beat": 0 } as CSSProperties} className="relative overflow-hidden bg-[#07020f] py-24 md:py-32">
      {/* neon background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="neon-grid absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_top,black_15%,transparent_65%)]" />
        <div className="neon-grid neon-floor absolute bottom-0 left-[-50%] right-[-50%] h-[50%] opacity-40 [mask-image:linear-gradient(to_top,black,transparent)]" />
        <div className="beat-glow absolute -left-32 top-24 h-96 w-96 rounded-full bg-neon-pink/40 blur-[120px]" />
        <div className="beat-glow absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-neon-cyan/30 blur-[120px]" />
        <div className="beat-glow absolute bottom-10 left-1/3 h-80 w-80 rounded-full bg-neon-violet/40 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="flex items-center gap-4 font-pixel text-xs tracking-[0.3em] text-volt">
            <span className="text-lg tracking-normal">06</span>
            <span className="h-px w-12 bg-volt/60" />
            ELECTRO DANCE UNIT · 派对组合
          </div>
          <h2 className="mt-5 font-pixel text-5xl leading-tight text-foam sm:text-7xl md:text-8xl">
            <span className="glitch" data-text="八木海莉">
              八木海莉
            </span>
            <span className="beat-scale neon-text inline-block animate-flicker text-volt">⚡</span>
            <span className="glitch" data-text="電音遊戯">
              電音遊戯
            </span>
          </h2>
          <p className="mt-3 font-display text-base font-bold tracking-[0.25em] text-neon-cyan md:text-2xl">KAIRI YAGI ELECTRIC-PLAY</p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-foam/90">
              以<span className="text-volt">电子音乐、VOCALOID 与网络文化</span>为根，“用电音来游戏”的电子舞曲企划。2024 年 12 月始动，八木海莉携手另类摇滚乐队「鋭児」的藤田聖史（Key）与市原太郎（Dr）组成三人编制。
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-foam/75">
              <li className="flex gap-3">
                <span className="text-neon-pink">▸</span>SOLO 名义偏内省，常写自己的阴影面；电音遊戯更明亮、向前，是让人想跳舞的音乐。
              </li>
              <li className="flex gap-3">
                <span className="text-neon-cyan">▸</span>成立契机：她想要能定期见面、一起摸索制作方法的创作伙伴；三人都用 Logic Pro 制作。
              </li>
              <li className="flex gap-3">
                <span className="text-volt">▸</span>2025 年「ACTION！」成为 TV 动画《真・侍伝 YAIBA》片尾曲，8 月发行首张 EP《ACTION！EP》。
              </li>
            </ul>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={120}>
            <div className="relative overflow-hidden rounded-3xl border border-neon-pink/30 bg-black/50 p-6 shadow-[0_0_60px_-20px_rgba(255,63,176,.6)] backdrop-blur">
              <p className="font-pixel text-xs tracking-[0.3em] text-neon-pink">PARTY MODE</p>
              <p className="mt-2 text-sm text-mist">一键连播电音遊戯 {queue.length} 首试听，背景灯光会跟着低音跳动 ⚡ 建议戴上耳机！</p>
              <Visualizer className="mt-5 h-28 w-full" bars={36} from="#ff3fb0" to="#f2ff3d" mirror />
              <button
                onClick={() => (party ? p.pause() : p.playQueue(queue))}
                className={cn(
                  "mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-display text-sm font-bold tracking-[0.2em] transition",
                  party ? "bg-neon-pink text-white shadow-[0_0_30px_rgba(255,63,176,.8)]" : "bg-volt text-abyss hover:shadow-[0_0_30px_rgba(242,255,61,.7)]",
                )}
              >
                {party ? <IPause size={16} /> : <IBolt size={16} />}
                {party ? "PAUSE THE PARTY" : "START THE PARTY"}
              </button>
              {party && p.current && <p className="mt-3 truncate text-center font-pixel text-xs text-volt">NOW PLAYING ▸ {p.current.title}</p>}
            </div>
          </Reveal>
        </div>

        {/* members */}
        <div className="mt-20 grid gap-4 md:grid-cols-3">
          {DENON_MEMBERS.map((m, i) => (
            <Reveal key={m.name} delay={i * 80}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-white/25">
                <div className={cn("grid h-16 w-16 place-items-center rounded-2xl bg-black font-display text-lg font-black ring-2", m.color, m.ring)}>{m.glyph}</div>
                <p className={cn("mt-5 font-pixel text-xs tracking-[0.25em]", m.color)}>{m.role}</p>
                <p className="mt-1 text-2xl text-foam">
                  {m.name} <span className="ml-1 text-sm text-mist">{m.en}</span>
                </p>
                {m.from && <p className="mt-1 text-xs text-mist">from {m.from}</p>}
                <p className="mt-4 text-sm leading-relaxed text-foam/70">{m.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* discography */}
        <div className="mt-20">
          <Reveal>
            <h3 className="font-pixel text-2xl text-foam md:text-3xl">
              DISCOGRAPHY <span className="ml-2 text-sm text-mist">作品</span>
            </h3>
          </Reveal>
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {[...DENON_RELEASES].reverse().map((id) => {
              const r = releaseByIt(id);
              return r ? <ReleaseCard key={id} r={r} size="sm" /> : null;
            })}
          </div>
        </div>

        {/* videos */}
        <div className="mt-20">
          <Reveal>
            <h3 className="font-pixel text-2xl text-foam md:text-3xl">
              MUSIC VIDEO <span className="ml-2 text-sm text-mist">MV · Visualizer · 幕后</span>
            </h3>
          </Reveal>
          <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {vids.map((v) => (
              <VideoCard key={v.id} v={v} tone="neon" />
            ))}
          </div>
        </div>

        {/* lives */}
        <Reveal className="mt-20">
          <div className="rounded-3xl border border-neon-cyan/25 bg-black/40 p-6 md:p-8">
            <h3 className="font-pixel text-2xl text-foam">LIVE <span className="ml-2 text-sm text-mist">放电记录</span></h3>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {DENON_LIVES.map((l) => (
                <li key={l.date} className="rounded-2xl border border-white/10 p-4">
                  <p className="font-pixel text-volt">{l.date}</p>
                  <p className="mt-1 text-foam">{l.title}</p>
                  <p className="text-xs text-mist">{l.place}</p>
                  <p className="mt-2 text-xs text-neon-cyan/80">{l.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
