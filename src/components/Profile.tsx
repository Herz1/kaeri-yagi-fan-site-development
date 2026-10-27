import { IMG, PROFILE, TIMELINE, TRIVIA } from "../data/site";
import { Img, Reveal, SectionHead } from "./ui";

export function Profile() {
  return (
    <section id="profile" className="relative overflow-hidden bg-deep py-24 md:py-32">
      <div
        className="text-outline pointer-events-none absolute -right-10 top-10 select-none font-serif text-[22vw] font-semibold leading-none opacity-60"
        aria-hidden
      >
        Kairi
      </div>
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          no="02"
          en="Profile"
          zh="人物介绍"
          desc="从广岛的舞蹈学校，到 YouTube 弹唱、AI 歌姬 Vivy 的歌声，再到主流出道——认识一下这位以「海」为名的歌手。"
        />

        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <figure className="relative">
              <div className="overflow-hidden rounded-[2rem] ring-1 ring-white/10">
                <Img src={IMG.ogp} alt="八木海莉" className="aspect-[4/5] w-full object-cover object-[46%_50%]" />
              </div>
              <div className="glass absolute -bottom-6 -right-3 rounded-2xl px-5 py-4 sm:-right-6">
                <p className="font-mincho text-3xl text-foam">
                  海<span className="text-aqua">×</span>莉
                </p>
                <p className="mt-1 text-[11px] tracking-widest text-mist">KAIRI · 名字来自《王国之心》</p>
              </div>
              <figcaption className="mt-3 text-[11px] text-mist/60">Photo: 八木海莉 Official Site</figcaption>
            </figure>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={120}>
            <h3 className="font-mincho text-4xl text-foam md:text-5xl">
              八木 海莉
              <span className="ml-3 font-serif text-2xl italic text-aqua md:text-3xl">Kairi Yagi</span>
            </h3>
            <div className="mt-6 space-y-4 leading-loose text-foam/80">
              <p>
                2002 年生于广岛。小学时在 ACTOR'S SCHOOL 广岛学习唱歌与舞蹈，初三开始自学吉他，15 岁独自上京追梦。2018 年起在 YouTube
                发布吉他弹唱，2021 年担任 TV 动画《Vivy -Fluorite Eye's Song-》主角 Vivy 的歌唱而备受瞩目，同年 12 月以《魔法科高校的劣等生
                追忆篇》主题曲「Ripe Aster」主流出道。
              </p>
              <p>
                她的歌常取材于自己的经历——刚到东京时的不安、写给已故祖父的信、离开故乡的心情。她说，希望自己的音乐不是去告诉迷茫的人「该怎么做」，而是成为能产生共鸣、陪在身边的存在。2024
                年起，她也以电子音乐企划「八木海莉⚡電音遊戯」展现明亮、能跳舞的另一面。
              </p>
            </div>
            <dl className="mt-8 grid gap-x-8 sm:grid-cols-2">
              {PROFILE.map(([k, v]) => (
                <div key={k} className="flex gap-4 border-b border-white/5 py-3">
                  <dt className="w-16 shrink-0 pt-0.5 text-xs tracking-widest text-aqua/80">{k}</dt>
                  <dd className="text-sm text-foam/90">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* trivia */}
        <div className="mt-24">
          <Reveal>
            <h3 className="flex items-baseline gap-4 font-serif text-3xl text-foam md:text-4xl">
              Trivia <span className="font-sans text-sm tracking-[0.3em] text-mist">小档案</span>
            </h3>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRIVIA.map((t, i) => (
              <Reveal key={t.title} delay={i * 60}>
                <div className="group h-full rounded-2xl border border-white/10 bg-abyss/40 p-5 transition hover:-translate-y-1 hover:border-aqua/40">
                  <div className="text-3xl transition group-hover:scale-110">{t.icon}</div>
                  <p className="mt-3 font-medium text-foam">{t.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{t.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* timeline */}
        <div className="mt-24">
          <Reveal>
            <h3 className="flex items-baseline gap-4 font-serif text-3xl text-foam md:text-4xl">
              History <span className="font-sans text-sm tracking-[0.3em] text-mist">经历年表 · 可横向滑动</span>
            </h3>
          </Reveal>
          <Reveal delay={100}>
            <div className="scrollbar-none -mx-5 mt-8 overflow-x-auto px-5 pb-4 md:-mx-8 md:px-8">
              <ol className="relative flex w-max snap-x snap-mandatory gap-4">
                <span className="absolute left-0 right-0 top-[54px] h-px bg-gradient-to-r from-aqua/60 via-aqua/20 to-coral/50" aria-hidden />
                {TIMELINE.map((e) => (
                  <li key={e.y} className="relative w-64 shrink-0 snap-start">
                    <p className="font-serif text-4xl text-foam">{e.y}</p>
                    <span className="mt-2 block h-3 w-3 rounded-full border-2 border-aqua bg-deep" />
                    <p className="mt-4 rounded-2xl border border-white/10 bg-abyss/40 p-4 text-sm leading-relaxed text-foam/80">{e.t}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
