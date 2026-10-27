import { IMG, PAST_LIVES, UPCOMING, type LiveTag } from "../data/site";
import { Img, Reveal, SectionHead, useNow } from "./ui";
import { IExternal, IPin, ITicket } from "./icons";
import { cn } from "../utils/cn";

const TAG_STYLE: Record<LiveTag, string> = {
  SOLO: "border-aqua/40 text-aqua",
  TOUR: "border-coral/40 text-coral",
  "⚡": "border-volt/50 text-volt",
  ACOUSTIC: "border-[#b9a2ff]/40 text-[#b9a2ff]",
  OVERSEAS: "border-neon-cyan/40 text-neon-cyan",
  BIRTHDAY: "border-neon-pink/40 text-[#ff8fcf]",
};

export function Live() {
  const now = useNow(60_000);
  return (
    <section id="live" className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead no="08" en="Live" zh="演出" desc="即将到来的公演，以及从 2022 年首次有观众个人公演至今的演出年表。" />

        <div className="grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-tide via-deep to-abyss p-6 md:p-10">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-aqua/10 blur-3xl" />
              <p className="text-[11px] tracking-[0.35em] text-coral">UPCOMING · 2027</p>
              <h3 className="mt-3 font-mincho text-3xl leading-tight text-foam md:text-4xl">
                八木海莉
                <br />
                {UPCOMING.title}
              </h3>
              <p className="mt-3 text-sm text-mist">教会、陶瓷会馆、海边——在安静而特别的空间里，听她的 Acoustic 之声。</p>
              <ul className="mt-8 space-y-3">
                {UPCOMING.shows.map((s) => {
                  const days = Math.ceil((new Date(s.at).getTime() - now) / 86_400_000);
                  return (
                    <li key={s.at} className="flex items-stretch overflow-hidden rounded-2xl border border-white/10 bg-abyss/50">
                      <div className="grid w-24 shrink-0 place-items-center border-r border-dashed border-white/15 bg-aqua/5 p-3 text-center">
                        <p className="font-serif text-xl leading-none text-aqua">{s.label.slice(0, 5)}</p>
                        <p className="mt-1 text-[10px] tracking-widest text-mist">{s.label.slice(6)}</p>
                      </div>
                      <div className="min-w-0 flex-1 p-4">
                        <p className="flex items-center gap-1.5 text-foam">
                          <IPin size={14} className="shrink-0 text-coral" />
                          <span className="truncate">
                            {s.city} · {s.venue}
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-mist">
                          {s.time} · {s.note}
                        </p>
                      </div>
                      {days > 0 && (
                        <div className="hidden shrink-0 flex-col items-center justify-center px-4 text-center sm:flex">
                          <p className="font-serif text-2xl leading-none text-foam">{days}</p>
                          <p className="text-[10px] text-mist">天后</p>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-5 text-xs text-mist">{UPCOMING.price}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {UPCOMING.tickets.map((t) => (
                  <a
                    key={t.url}
                    href={t.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 rounded-2xl border border-white/15 px-4 py-3 transition hover:border-aqua/60"
                  >
                    <ITicket size={18} className="text-aqua" />
                    <span>
                      <span className="flex items-center gap-1 text-sm text-foam">
                        {t.label} <IExternal size={12} className="text-mist group-hover:text-aqua" />
                      </span>
                      <span className="block text-[11px] text-mist">{t.period}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={120}>
            <figure className="relative h-full overflow-hidden rounded-[2rem] ring-1 ring-white/10">
              <Img src={IMG.taipei} alt="八木海莉 ONE-MAN LIVE in TAIPEI 演唱「シリウス」" className="h-full max-h-[720px] min-h-[460px] w-full object-cover object-[50%_40%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-[11px] tracking-[0.3em] text-neon-cyan">2026.08.30 · FIRST OVERSEAS LIVE</p>
                <p className="mt-2 font-mincho text-2xl text-foam">ONE-MAN LIVE 2026 in TAIPEI</p>
                <p className="mt-1 text-sm text-mist">演唱「シリウス」（可拍摄时段）</p>
                <p className="mt-3 text-[10px] text-mist/70">
                  Photo ©{" "}
                  <a href="https://commons.wikimedia.org/wiki/File:YagiKairiTaipeiOneManCameraOK.jpg" target="_blank" rel="noreferrer" className="underline hover:text-aqua">
                    OToToT
                  </a>{" "}
                  ·{" "}
                  <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer" className="underline hover:text-aqua">
                    CC BY-SA 4.0
                  </a>{" "}
                  via Wikimedia Commons
                </p>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="mt-20">
          <Reveal>
            <h3 className="flex items-baseline gap-4 font-serif text-3xl text-foam md:text-4xl">
              Live History <span className="font-sans text-sm tracking-[0.3em] text-mist">个人公演年表</span>
            </h3>
          </Reveal>
          <ol className="relative mt-8 border-l border-white/10 pl-6 md:pl-10">
            {PAST_LIVES.map((l, i) => (
              <Reveal key={`${l.date}-${l.title}`} delay={Math.min(i, 6) * 40}>
                <li className="relative pb-8">
                  <span
                    className={cn(
                      "absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 bg-abyss md:-left-[47px]",
                      l.tag === "OVERSEAS" ? "border-neon-cyan" : l.tag === "⚡" ? "border-volt" : "border-aqua",
                    )}
                  />
                  <div className="grid gap-1 md:grid-cols-[180px_1fr] md:gap-6">
                    <p className="font-serif text-lg tabular-nums text-foam/80">{l.date}</p>
                    <div>
                      <p className="flex flex-wrap items-center gap-2 text-foam">
                        {l.title}
                        <span className={cn("rounded-full border px-2 py-0.5 text-[10px] tracking-widest", TAG_STYLE[l.tag])}>{l.tag}</span>
                      </p>
                      <p className="mt-1 text-sm text-mist">{l.place}</p>
                      {l.note && <p className="mt-1 text-xs text-aqua/80">{l.note}</p>}
                    </div>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
