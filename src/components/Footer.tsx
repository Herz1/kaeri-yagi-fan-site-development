import { LINKS } from "../data/site";
import { IExternal } from "./icons";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-abyss pb-36 pt-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mincho text-3xl text-foam">
              八木海莉 <span className="font-serif text-xl italic text-aqua">fan site</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-mist">
              本站为粉丝自发制作的非官方应援站，与八木海莉本人、Sony Music Artists、Sony Music Labels / Ki/oon Music
              无任何关联。最新、最准确的信息请以官方渠道为准。
            </p>
            <p className="mt-6 font-mincho text-sm tracking-[0.3em] text-foam/50">お茶でも飲んで、またね。</p>
          </div>
          <div className="lg:col-span-8">
            <p className="text-xs tracking-[0.3em] text-aqua">OFFICIAL LINKS · 官方渠道</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {LINKS.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-xl border border-white/10 px-4 py-3 transition hover:border-aqua/50 hover:bg-white/[0.02]"
                >
                  <p className="flex items-center justify-between gap-2 text-sm text-foam">
                    {l.label}
                    <IExternal className="shrink-0 text-mist/50 transition group-hover:text-aqua" />
                  </p>
                  <p className="truncate text-xs text-mist">{l.sub}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-14 space-y-2 border-t border-white/5 pt-8 text-[11px] leading-relaxed text-mist/70">
          <p>
            图片来源：艺人照片来自 Sony Music Artists 与八木海莉官方网站；作品封面来自 Apple Music 与 Sony Music 官方；周边照片来自 ROCKET-EXPRESS
            官方商店；影像缩略图与播放来自 YouTube 官方频道。台北公演现场照片 © OToToT，依{" "}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer" className="underline hover:text-aqua">
              CC BY-SA 4.0
            </a>{" "}
            授权，经{" "}
            <a href="https://commons.wikimedia.org/wiki/File:YagiKairiTaipeiOneManCameraOK.jpg" target="_blank" rel="noreferrer" className="underline hover:text-aqua">
              Wikimedia Commons
            </a>{" "}
            使用。<span className="text-aqua/80">本站未使用任何 AI 生成图像。</span>
          </p>
          <p>资料参考：Sony Music 官方资讯、Sony Music Artists、Wikipedia（日 / 中）、Real Sound、音楽ナタリー、iTunes Search API 等。各作品版权归各权利人所有。</p>
          <p>© {new Date().getFullYear()} Yagi Kairi Unofficial Fan Site · Made with 🍵 &amp; ⚡</p>
        </div>
      </div>
    </footer>
  );
}
