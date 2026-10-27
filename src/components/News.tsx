import { useState } from "react";
import { IMG, NEWS, sonyInfo, UPCOMING, type NewsCat } from "../data/site";
import { btn, Img, Reveal, SectionHead, useNow } from "./ui";
import { IExternal, ITicket } from "./icons";
import { cn } from "../utils/cn";

const CAT_STYLE: Record<NewsCat, string> = {
  RELEASE: "text-aqua border-aqua/40",
  LIVE: "text-coral border-coral/40",
  GOODS: "text-volt border-volt/40",
  MEDIA: "text-[#b9a2ff] border-[#b9a2ff]/40",
  VIDEO: "text-neon-cyan border-neon-cyan/40",
  INFO: "text-mist border-white/20",
};

const PRESALE_END = new Date("2026-11-01T23:59:00+09:00").getTime();

function NextLiveCard() {
  const now = useNow(60_000);
  const open = now < PRESALE_END;
  const tk = UPCOMING.tickets[0];
  return (
    <div className="glass overflow-hidden rounded-3xl lg:sticky lg:top-24">
      <div className="relative h-44 overflow-hidden">
        <Img src={IMG.ogp} alt="八木海莉" className="h-full w-full object-cover object-[50%_38%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/20 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-coral px-3 py-1 text-[10px] tracking-[0.25em] text-abyss">NEXT LIVE</span>
      </div>
      <div className="p-5">
        <p className="font-mincho text-xl leading-snug text-foam">八木海莉 {UPCOMING.title}</p>
        <ul className="mt-4 space-y-3 text-sm">
          {UPCOMING.shows.map((s) => (
            <li key={s.at} className="flex gap-3">
              <span className="w-[74px] shrink-0 font-serif text-base text-aqua">{s.label}</span>
              <span className="min-w-0">
                <span className="block text-foam">
                  {s.city} · {s.venue}
                </span>
                <span className="block text-xs text-mist">{s.time}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-mist">{UPCOMING.price}</p>
        {open ? (
          <>
            <a href={tk.url} target="_blank" rel="noreferrer" className={cn(btn.primary, "mt-5 w-full justify-center")}>
              <ITicket size={16} /> {tk.label}
            </a>
            <p className="mt-2 text-center text-[11px] text-mist/70">受理期间 {tk.period}</p>
          </>
        ) : (
          <p className="mt-5 rounded-xl border border-white/10 p-3 text-center text-xs text-mist">官网先行已截止，请关注官方后续的一般发售信息。</p>
        )}
      </div>
    </div>
  );
}

export function News() {
  const [all, setAll] = useState(false);
  const list = all ? NEWS : NEWS.slice(0, 8);
  return (
    <section id="news" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead no="01" en="News" zh="最新资讯" desc="整理自 Sony Music 官方资讯的中文摘要（更新至 2026.10），点击即可前往官方原文。" />
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <ul className="divide-y divide-white/5 border-y border-white/5">
              {list.map((n) => (
                <li key={n.id}>
                  <a
                    href={sonyInfo(n.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5 sm:grid-cols-[104px_86px_1fr_auto]"
                  >
                    <time className="font-serif text-lg tabular-nums text-foam/80">{n.date}</time>
                    <span className={cn("hidden w-fit rounded-full border px-2.5 py-0.5 text-[10px] tracking-widest sm:inline-block", CAT_STYLE[n.cat])}>
                      {n.cat}
                    </span>
                    <span className="text-sm leading-relaxed text-foam/85 transition group-hover:text-aqua sm:text-base">{n.title}</span>
                    <IExternal className="text-mist/50 transition group-hover:text-aqua" />
                  </a>
                </li>
              ))}
            </ul>
            <button onClick={() => setAll(!all)} className="mt-6 text-sm text-mist transition hover:text-aqua">
              {all ? "收起 ↑" : `查看全部 ${NEWS.length} 条 ↓`}
            </button>
          </Reveal>
          <Reveal className="lg:col-span-4" delay={150}>
            <NextLiveCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
