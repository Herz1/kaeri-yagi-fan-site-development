import { useEffect, useRef, useState, type ImgHTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { ytThumb, type Video } from "../data/site";

export const btn = {
  primary:
    "inline-flex items-center gap-2 rounded-full bg-aqua px-5 py-2.5 text-sm font-medium text-abyss transition hover:bg-foam active:scale-[.98]",
  ghost:
    "inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-foam/90 transition hover:border-aqua/60 hover:text-aqua",
};

export const fmt = (s: number) => {
  const v = Math.max(0, Math.floor(s || 0));
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`;
};

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={cn("reveal", shown && "in", className)}>
      {children}
    </div>
  );
}

export function SectionHead({
  no,
  en,
  zh,
  desc,
  accent = "text-aqua",
  line = "bg-aqua/50",
}: {
  no: string;
  en: string;
  zh: string;
  desc?: ReactNode;
  accent?: string;
  line?: string;
}) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <div className={cn("flex items-center gap-4 text-xs tracking-[0.4em]", accent)}>
        <span className="font-serif text-lg italic tracking-normal">{no}</span>
        <span className={cn("h-px w-12", line)} />
        <span>{zh}</span>
      </div>
      <h2 className="mt-3 font-serif text-5xl font-medium tracking-tight text-foam md:text-7xl">{en}</h2>
      {desc && <p className="mt-4 max-w-2xl leading-relaxed text-mist">{desc}</p>}
    </Reveal>
  );
}

export function Img({ src, alt = "", className, ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  const [err, setErr] = useState(false);
  useEffect(() => setErr(false), [src]);
  if (err || !src)
    return (
      <div className={cn("grid place-items-center bg-gradient-to-br from-reef to-deep text-[10px] text-mist/60", className)}>
        {alt}
      </div>
    );
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setErr(true)}
      className={className}
      {...rest}
    />
  );
}

export function YtThumb({ v, className }: { v: Video; className?: string }) {
  const [src, setSrc] = useState(() => ytThumb(v.id, v.hq));
  const fallback = () => {
    if (!src.includes("hqdefault")) setSrc(ytThumb(v.id, true));
  };
  return (
    <img
      src={src}
      alt={v.title}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={className}
      onLoad={(e) => {
        if (e.currentTarget.naturalWidth <= 120) fallback();
      }}
      onError={fallback}
    />
  );
}

export function Chip({
  active,
  children,
  onClick,
  activeClass = "border-aqua bg-aqua text-abyss",
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  activeClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition",
        active ? activeClass : "border-white/15 text-mist hover:border-white/40 hover:text-foam",
      )}
    >
      {children}
    </button>
  );
}

export function EqIcon({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex h-3.5 items-end gap-[2px]", className)} aria-label="播放中">
      {[0, 0.25, 0.5].map((d) => (
        <span key={d} className="eq-bar h-full w-[3px] rounded-sm bg-current" style={{ animationDelay: `${d}s` }} />
      ))}
    </span>
  );
}

export function useLocal<T>(key: string, init: T) {
  const [v, setV] = useState<T>(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? (JSON.parse(s) as T) : init;
    } catch {
      return init;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      /* storage unavailable */
    }
  }, [key, v]);
  return [v, setV] as const;
}

export function useNow(interval = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(t);
  }, [interval]);
  return now;
}

export function splitDiff(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

export const pad2 = (n: number) => String(n).padStart(2, "0");
