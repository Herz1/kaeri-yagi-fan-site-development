import { useState } from "react";
import {
  BONUS,
  GCAT_LABEL,
  GOODS,
  goodsUrl,
  releaseByIt,
  SHOP_URL,
  TAIPEI_GOODS,
  type GCat,
  type Goods as GoodsItem,
} from "../data/site";
import { useUI } from "../context/ui";
import { btn, Chip, Img, Reveal, SectionHead, useLocal } from "./ui";
import { ICheck, IExternal, IHeart } from "./icons";
import { cn } from "../utils/cn";

type Own = Record<string, "have" | "want">;
type Tab = "shop" | "bonus" | "taipei";
const GCATS: (GCat | "all")[] = ["all", "wear", "towel", "small", "home", "fc"];
const TAIPEI_IDS = ["2093270051", "2093270054", "2093270039", "2093270066"];

function GoodsCard({ g, st, onToggle }: { g: GoodsItem; st?: "have" | "want"; onToggle: (s: "have" | "want") => void }) {
  return (
    <div className={cn("group flex flex-col overflow-hidden rounded-2xl border bg-abyss/40 transition", st === "have" ? "border-aqua/60" : "border-white/10 hover:border-white/25")}>
      <a href={goodsUrl(g.id)} target="_blank" rel="noreferrer" className="block flex-1">
        <div className="relative aspect-square overflow-hidden bg-white">
          <Img src={g.img} alt={g.name} className={cn("h-full w-full object-cover transition duration-700 group-hover:scale-105", g.soldout && "opacity-55")} />
          {g.soldout ? (
            <span className="absolute left-3 top-3 rounded-full bg-abyss/85 px-2.5 py-1 text-[10px] tracking-widest text-foam">SOLD OUT</span>
          ) : g.was ? (
            <span className="absolute left-3 top-3 rounded-full bg-coral px-2.5 py-1 text-[10px] font-medium text-abyss">
              SALE −{Math.round((1 - g.price / g.was) * 100)}%
            </span>
          ) : null}
          {g.cat === "fc" && <span className="absolute right-3 top-3 rounded-full bg-aqua px-2.5 py-1 text-[10px] text-abyss">FC 限定</span>}
        </div>
        <div className="p-4">
          <p className="line-clamp-1 text-sm text-foam">{g.name}</p>
          <p className="line-clamp-1 text-xs text-mist">{g.zh}</p>
          <p className="mt-2 font-serif text-xl text-foam">
            ¥{g.price.toLocaleString()}
            {g.was && <span className="ml-2 text-sm text-mist/60 line-through">¥{g.was.toLocaleString()}</span>}
            <span className="ml-1 font-sans text-[10px] text-mist">含税</span>
          </p>
        </div>
      </a>
      <div className="flex border-t border-white/5">
        <button
          onClick={() => onToggle("have")}
          className={cn("flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs transition", st === "have" ? "bg-aqua/15 text-aqua" : "text-mist hover:text-foam")}
        >
          <ICheck size={14} /> 已入手
        </button>
        <button
          onClick={() => onToggle("want")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 border-l border-white/5 py-2.5 text-xs transition",
            st === "want" ? "bg-coral/15 text-coral" : "text-mist hover:text-foam",
          )}
        >
          <IHeart size={14} /> 想要
        </button>
      </div>
    </div>
  );
}

export function Goods() {
  const ui = useUI();
  const [tab, setTab] = useState<Tab>("shop");
  const [cat, setCat] = useState<GCat | "all">("all");
  const [own, setOwn] = useLocal<Own>("kairi-fan-goods", {});
  const list = GOODS.filter((g) => cat === "all" || g.cat === cat);
  const have = GOODS.filter((g) => own[g.id] === "have").length;
  const want = GOODS.filter((g) => own[g.id] === "want").length;
  const toggle = (id: string, s: "have" | "want") =>
    setOwn((o) => {
      const n = { ...o };
      if (n[id] === s) delete n[id];
      else n[id] = s;
      return n;
    });

  const TABS: [Tab, string, number][] = [
    ["shop", "官方周边", GOODS.length],
    ["bonus", "CD 特典 · 动漫联动", BONUS.length],
    ["taipei", "台北公演限定", TAIPEI_GOODS.length],
  ];

  return (
    <section id="goods" className="relative bg-deep py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          no="07"
          en="Goods"
          zh="周边 · 特典"
          desc="官方周边来自 Sony Music 官方商店 ROCKET-EXPRESS（数据快照 2026.10，价格与库存以官方为准）。T 恤、贴纸、徽章上频繁登场的蓝绿发 Q 版插画形象，是海莉周边的一大特色！点「已入手 / 想要」打造你的收藏清单。"
        />

        <Reveal>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {TABS.map(([k, label, n]) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={cn(
                    "rounded-2xl border px-5 py-3 text-left transition",
                    tab === k ? "border-aqua bg-aqua/10 text-foam" : "border-white/10 text-mist hover:border-white/30",
                  )}
                >
                  <span className="block text-sm">{label}</span>
                  <span className="block text-[11px] opacity-60">{n} 件</span>
                </button>
              ))}
            </div>
            <a href={SHOP_URL} target="_blank" rel="noreferrer" className={btn.ghost}>
              ROCKET-EXPRESS 官方商店 <IExternal />
            </a>
          </div>
        </Reveal>

        {tab === "shop" && (
          <>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-abyss/40 p-4">
              <div className="scrollbar-none flex gap-2 overflow-x-auto">
                {GCATS.map((c) => (
                  <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
                    {GCAT_LABEL[c]}
                  </Chip>
                ))}
              </div>
              <div className="min-w-[220px] flex-1 sm:max-w-xs">
                <div className="flex justify-between text-xs text-mist">
                  <span>
                    我的收藏 <span className="text-aqua">已入手 {have}</span> · <span className="text-coral">想要 {want}</span>
                  </span>
                  <span>
                    {have}/{GOODS.length}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-aqua-deep to-aqua transition-all" style={{ width: `${(have / GOODS.length) * 100}%` }} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {list.map((g) => (
                <div key={g.id} className="animate-fadein">
                  <GoodsCard g={g} st={own[g.id]} onToggle={(s) => toggle(g.id, s)} />
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "bonus" && (
          <div className="animate-fadein">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BONUS.map((b) => (
                <div key={b.title} className="rounded-2xl border border-white/10 bg-abyss/40 p-5">
                  <div className="flex items-start justify-between">
                    <span className="text-4xl">{b.icon}</span>
                    <span className={cn("rounded-full px-2.5 py-1 text-[10px]", b.tag === "动漫联动" ? "bg-volt text-abyss" : "bg-white/10 text-mist")}>{b.tag}</span>
                  </div>
                  <p className="mt-4 text-foam">{b.title}</p>
                  <p className="mt-1 text-xs text-mist">{b.jp}</p>
                  <p className="mt-3 text-xs text-aqua">{b.from}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-volt/30 bg-volt/5 p-5">
              <p className="text-sm text-foam/80">以上为八木海莉⚡電音遊戯《ACTION！EP》（KSCL-3610〜3611 · ¥3,630）的初回仕様与店铺特典。</p>
              <button
                onClick={() => {
                  const r = releaseByIt(1828859842);
                  if (r) ui.openRelease(r);
                }}
                className="rounded-full bg-volt px-5 py-2.5 text-sm font-medium text-abyss"
              >
                查看 ACTION！EP
              </button>
            </div>
          </div>
        )}

        {tab === "taipei" && (
          <div className="grid animate-fadein gap-6 lg:grid-cols-12">
            <div className="rounded-3xl border border-white/10 bg-abyss/40 p-6 lg:col-span-5">
              <p className="text-[11px] tracking-[0.3em] text-neon-cyan">2026.08.30 · TAIPEI</p>
              <p className="mt-2 font-mincho text-2xl text-foam">ONE-MAN LIVE 2026 in TAIPEI</p>
              <p className="mt-2 text-sm text-mist">台北 CLAPPER STUDIO 5F（Live Hall 入口）现场贩售 · 首次海外公演</p>
              <ul className="mt-6 divide-y divide-white/5">
                {TAIPEI_GOODS.map((t) => (
                  <li key={t.name} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <span className="text-foam/90">{t.name}</span>
                    <span className="font-serif text-lg text-aqua">{t.price}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:col-span-7">
              {TAIPEI_IDS.map((id) => {
                const g = GOODS.find((x) => x.id === id);
                return g ? <GoodsCard key={id} g={g} st={own[g.id]} onToggle={(s) => toggle(g.id, s)} /> : null;
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
