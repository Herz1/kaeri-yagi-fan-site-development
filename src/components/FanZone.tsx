import { useMemo, useState, type FormEvent } from "react";
import { GUIDE, IMG, soloPool, starterQueue, trackByTitle, upcomingEvents, type PTrack } from "../data/site";
import { usePlayer } from "../context/player";
import { Bubbles } from "./Hero";
import { btn, EqIcon, Img, pad2, Reveal, SectionHead, splitDiff, useLocal, useNow } from "./ui";
import { ICheck, IPause, IPlay, ISparkle, ITrash } from "./icons";
import { cn } from "../utils/cn";

const jstDay = (ms: number) => new Date(ms + 9 * 3600_000).toISOString().slice(0, 10);
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

function Countdowns() {
  const now = useNow(1000);
  const list = upcomingEvents(now).slice(0, 5);
  const [first, ...rest] = list;
  if (!first) return null;
  const d = splitDiff(first.at - now);
  return (
    <div className="h-full rounded-3xl border border-white/10 bg-abyss/50 p-6 md:p-8">
      <p className="text-[11px] tracking-[0.3em] text-aqua">COUNTDOWN · 倒计时</p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="rounded-full bg-coral/15 px-2.5 py-1 text-[10px] tracking-widest text-coral">{first.tag}</span>
          <p className="mt-3 font-mincho text-2xl text-foam md:text-3xl">{first.title}</p>
          <p className="text-sm text-mist">{first.sub}</p>
        </div>
        <div className="flex gap-2">
          {(
            [
              ["天", String(d.d)],
              ["时", pad2(d.h)],
              ["分", pad2(d.m)],
              ["秒", pad2(d.s)],
            ] as [string, string][]
          ).map(([l, v]) => (
            <div key={l} className="w-16 rounded-2xl bg-tide/70 py-3 text-center">
              <p className="font-mincho text-3xl tabular-nums leading-none text-foam">{v}</p>
              <p className="mt-1 text-[10px] text-mist">{l}</p>
            </div>
          ))}
        </div>
      </div>
      <ul className="mt-8 divide-y divide-white/5">
        {rest.map((e) => (
          <li key={e.at + e.title} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm text-foam">{e.title}</p>
              <p className="truncate text-xs text-mist">
                {new Date(e.at).toLocaleDateString("zh-CN", { timeZone: "Asia/Tokyo" })} · {e.sub}
              </p>
            </div>
            <p className="shrink-0 font-serif text-xl text-aqua">
              {Math.ceil((e.at - now) / 86_400_000)}
              <span className="ml-1 font-sans text-xs text-mist">天</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CheckIn() {
  const p = usePlayer();
  const now = useNow(60_000);
  const today = jstDay(now);
  const yesterday = jstDay(now - 86_400_000);
  const [st, setSt] = useLocal("kairi-fan-checkin", { last: "", streak: 0, total: 0 });
  const done = st.last === today;
  const pool = useMemo(() => soloPool(), []);
  const song: PTrack | undefined = pool.length ? pool[hash(today) % pool.length] : undefined;
  const songPlaying = !!song && p.playing && p.current?.key === song.key;
  const streak = st.last === today || st.last === yesterday ? st.streak : 0;

  const check = () => {
    if (done) return;
    setSt((s) => ({ last: today, streak: s.last === yesterday ? s.streak + 1 : 1, total: s.total + 1 }));
  };

  return (
    <div className="relative h-full overflow-hidden rounded-3xl border border-aqua/20 bg-gradient-to-br from-tide to-abyss p-6 md:p-8">
      <p className="text-[11px] tracking-[0.3em] text-aqua">DAILY CHECK-IN · 每日应援</p>
      <div className="mt-5 flex items-end gap-8">
        <div>
          <p className="font-serif text-6xl leading-none text-foam">{streak}</p>
          <p className="mt-1 text-xs text-mist">连续天数</p>
        </div>
        <div>
          <p className="font-serif text-4xl leading-none text-foam/80">{st.total}</p>
          <p className="mt-1 text-xs text-mist">累计应援</p>
        </div>
        <Img src={IMG.square} alt="八木海莉" className="ml-auto h-16 w-16 rounded-full object-cover ring-2 ring-aqua/50" />
      </div>
      <button
        onClick={check}
        disabled={done}
        className={cn(
          "mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-medium transition",
          done ? "border border-aqua/40 bg-aqua/10 text-aqua" : "bg-aqua text-abyss hover:bg-foam",
        )}
      >
        {done ? (
          <>
            <ICheck size={16} /> 今日已打卡，明天也要来哦
          </>
        ) : (
          "为海莉打卡应援 🌊"
        )}
      </button>
      {song && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-abyss/60 p-3">
          <Img src={song.cover} alt={song.album} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] tracking-[0.25em] text-aqua">今日推荐曲 · {today}</p>
            <p className="truncate text-sm text-foam">{song.title}</p>
            <p className="truncate text-xs text-mist">《{song.album}》</p>
          </div>
          <button
            onClick={() => (songPlaying ? p.pause() : p.playQueue([song]))}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-aqua text-abyss"
            aria-label="播放今日推荐曲"
          >
            {songPlaying ? <IPause size={16} /> : <IPlay size={16} />}
          </button>
        </div>
      )}
      <div className="mt-6">
        <div className="flex items-center justify-between gap-3 text-[11px] text-mist">
          <span>最近 7 天</span>
          <span className={streak >= 7 ? "text-aqua" : ""}>
            {streak >= 7 ? "🏅 已点亮「海莉蓝」七日徽章" : `再坚持 ${7 - streak} 天点亮七日徽章`}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {Array.from({ length: 7 }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-2 rounded-full transition",
                i >= 7 - Math.min(streak, 7) ? "bg-aqua shadow-[0_0_10px_rgba(127,219,230,.6)]" : "bg-white/10",
              )}
            />
          ))}
        </div>
      </div>
      <p className="mt-6 border-l-2 border-aqua/40 pl-4 font-mincho text-sm leading-relaxed text-foam/75">
        「お茶でも飲んで」
        <span className="mt-1 block font-sans text-xs text-mist">累了就停下来，先喝杯温热的乌龙茶吧。</span>
      </p>
    </div>
  );
}

function Guide() {
  const p = usePlayer();
  const items = useMemo(() => GUIDE.map((g) => ({ ...g, t: trackByTitle(g.it, g.track) })), []);
  const queue = useMemo(() => starterQueue(), []);
  return (
    <div className="h-full rounded-3xl border border-white/10 bg-abyss/50 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[11px] tracking-[0.3em] text-aqua">BEGINNER'S GUIDE · 入坑指南</p>
        <button onClick={() => p.playQueue(queue)} className="text-xs text-mist hover:text-aqua">
          全部播放 ▶
        </button>
      </div>
      <ol className="mt-5 space-y-2">
        {items.map((g, i) => {
          const cur = !!g.t && p.current?.key === g.t.key;
          return (
            <li key={g.track}>
              <button
                onClick={() => (cur ? p.toggle() : p.playQueue(queue, queue.findIndex((q) => q.key === g.t?.key)))}
                className={cn("flex w-full items-center gap-4 rounded-2xl p-3 text-left transition hover:bg-white/5", cur && "bg-aqua/10")}
              >
                <span className="font-serif text-2xl italic text-aqua/70">{i + 1}</span>
                {g.t && <Img src={g.t.cover} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />}
                <span className="min-w-0 flex-1">
                  <span className={cn("block truncate text-sm", cur ? "text-aqua" : "text-foam")}>「{g.track}」</span>
                  <span className="block text-xs leading-snug text-mist">{g.why}</span>
                </span>
                <span className="shrink-0 text-aqua">{cur && p.playing ? <EqIcon /> : <IPlay size={14} />}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

type Tone = "aqua" | "coral" | "volt" | "violet";
interface Msg {
  id: string;
  name: string;
  text: string;
  tone: Tone;
  at: number;
  seed?: boolean;
}
const TONE: Record<Tone, { dot: string; card: string }> = {
  aqua: { dot: "bg-aqua", card: "border-aqua/30 bg-aqua/[0.06]" },
  coral: { dot: "bg-coral", card: "border-coral/30 bg-coral/[0.06]" },
  volt: { dot: "bg-volt", card: "border-volt/30 bg-volt/[0.05]" },
  violet: { dot: "bg-neon-violet", card: "border-neon-violet/30 bg-neon-violet/[0.07]" },
};
const SEED: Msg[] = [
  { id: "s1", name: "站长", text: "欢迎来到八木海莉应援站！累了就点一首「お茶でも飲んで」，先停下来喝杯茶吧 🍵", tone: "aqua", at: Date.parse("2026-10-20T20:00:00+09:00"), seed: true },
  { id: "s2", name: "站长", text: "2026.12.18 就是出道 5 周年啦！一起来写下想对她说的话 ✨", tone: "coral", at: Date.parse("2026-10-21T21:00:00+09:00"), seed: true },
  { id: "s3", name: "站长", text: "⚡ 电音遊戯区的 PARTY MODE 记得戴上耳机试试，灯光会跟着低音跳！", tone: "volt", at: Date.parse("2026-10-22T22:00:00+09:00"), seed: true },
];

function Wall() {
  const [msgs, setMsgs] = useLocal<Msg[]>("kairi-fan-wall", SEED);
  const [name, setName] = useLocal("kairi-fan-name", "");
  const [text, setText] = useState("");
  const [tone, setTone] = useState<Tone>("aqua");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [{ id: String(Date.now()), name: name.trim() || "海莉的听众", text: t, tone, at: Date.now() }, ...m].slice(0, 60));
    setText("");
  };

  return (
    <div className="h-full rounded-3xl border border-white/10 bg-abyss/50 p-6 md:p-8">
      <p className="text-[11px] tracking-[0.3em] text-aqua">MESSAGE WALL · 留言墙</p>
      <form onSubmit={submit} className="mt-5 space-y-3">
        <div className="flex flex-wrap gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={16}
            placeholder="昵称（选填）"
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-deep px-4 py-2.5 text-sm text-foam placeholder:text-mist/50 focus:border-aqua/60 focus:outline-none"
          />
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-deep px-3">
            {(Object.keys(TONE) as Tone[]).map((k) => (
              <button
                type="button"
                key={k}
                onClick={() => setTone(k)}
                className={cn("h-5 w-5 rounded-full transition", TONE[k].dot, tone === k ? "ring-2 ring-foam ring-offset-2 ring-offset-deep" : "opacity-50")}
                aria-label={`选择颜色 ${k}`}
              />
            ))}
          </div>
        </div>
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={140}
            rows={3}
            placeholder="写下想对海莉说的话…"
            className="w-full resize-none rounded-xl border border-white/10 bg-deep px-4 py-3 text-sm text-foam placeholder:text-mist/50 focus:border-aqua/60 focus:outline-none"
          />
          <span className="absolute bottom-3 right-3 text-[10px] text-mist/60">{text.length}/140</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-[11px] text-mist/60">留言仅保存在本机浏览器中。</p>
          <button type="submit" disabled={!text.trim()} className={cn(btn.primary, "disabled:opacity-40")}>
            <ISparkle size={14} /> 贴上留言
          </button>
        </div>
      </form>
      <div className="mt-6 max-h-[420px] columns-1 gap-3 overflow-y-auto pr-1 sm:columns-2">
        {msgs.map((m) => (
          <div key={m.id} className={cn("group relative mb-3 break-inside-avoid rounded-2xl border p-4", TONE[m.tone].card)}>
            <p className="text-sm leading-relaxed text-foam/90">{m.text}</p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-mist">
              <span className="flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", TONE[m.tone].dot)} />
                {m.name}
                {m.seed && <span className="rounded bg-white/10 px-1 text-[9px]">置顶</span>}
              </span>
              <span>{new Date(m.at).toLocaleDateString("zh-CN")}</span>
            </div>
            {!m.seed && (
              <button
                onClick={() => setMsgs((list) => list.filter((x) => x.id !== m.id))}
                className="absolute right-2 top-2 rounded-full p-1 text-mist opacity-0 transition hover:text-coral group-hover:opacity-100"
                aria-label="删除留言"
              >
                <ITrash size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const COLORS = [
  { name: "海莉蓝", hex: "#7FDBE6", desc: "本站主色 · 海与水" },
  { name: "深海蓝", hex: "#0A1422", desc: "安静的夜与海" },
  { name: "珊瑚红", hex: "#FF7B84", desc: "温暖的点缀" },
  { name: "电音黄", hex: "#F2FF3D", desc: "⚡电音遊戯" },
];

function Palette() {
  const [copied, setCopied] = useState("");
  const copy = (hex: string) => {
    navigator.clipboard?.writeText(hex).catch(() => undefined);
    setCopied(hex);
    setTimeout(() => setCopied(""), 1400);
  };
  return (
    <div className="mt-6 rounded-3xl border border-white/10 bg-abyss/50 p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <p className="text-[11px] tracking-[0.3em] text-aqua">SITE COLORS · 本站应援配色</p>
        <p className="text-[11px] text-mist/60">* 本站自定配色，非官方应援色 · 点击复制色号</p>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {COLORS.map((c) => (
          <button key={c.hex} onClick={() => copy(c.hex)} className="group flex items-center gap-3 rounded-2xl border border-white/10 p-3 text-left transition hover:border-white/30">
            <span className="h-12 w-12 shrink-0 rounded-xl ring-1 ring-white/20" style={{ background: c.hex }} />
            <span className="min-w-0">
              <span className="block text-sm text-foam">{c.name}</span>
              <span className="block font-mono text-xs text-mist">{copied === c.hex ? "已复制 ✓" : c.hex}</span>
              <span className="block truncate text-[11px] text-mist/60">{c.desc}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function FanZone() {
  return (
    <section id="fans" className="relative overflow-hidden bg-deep py-24 md:py-32">
      <Bubbles count={10} />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead no="09" en="Fan Zone" zh="应援广场" desc="倒计时、每日打卡、入坑指南与留言墙。所有记录只保存在你自己的浏览器里。" />
        <div className="grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Countdowns />
          </Reveal>
          <Reveal className="lg:col-span-5" delay={100}>
            <CheckIn />
          </Reveal>
          <Reveal className="lg:col-span-5">
            <Guide />
          </Reveal>
          <Reveal className="lg:col-span-7" delay={100}>
            <Wall />
          </Reveal>
        </div>
        <Reveal>
          <Palette />
        </Reveal>
      </div>
    </section>
  );
}
