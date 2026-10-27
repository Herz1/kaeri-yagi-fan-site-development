import { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { IClose, IMenu } from "./icons";

const ITEMS: [string, string][] = [
  ["news", "资讯"],
  ["profile", "人物"],
  ["music", "作品"],
  ["video", "影像"],
  ["anime", "动漫"],
  ["denon", "⚡电音遊戯"],
  ["goods", "周边"],
  ["live", "演出"],
  ["fans", "应援"],
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState("home");
  const [prog, setProg] = useState(0);

  useEffect(() => {
    const on = () => {
      setScrolled(window.scrollY > 40);
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProg(max > 0 ? h.scrollTop / max : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["home", ...ITEMS.map((i) => i[0])].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const isDenon = active === "denon";

  return (
    <header
      onKeyDown={e => {
        if (open && e.key === 'Escape' && !e.nativeEvent.isComposing) {
          e.preventDefault(); setOpen(false); menuButton.current?.focus();
        }
      }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open ? "border-b border-white/5 bg-abyss/80 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-0 h-[2px] transition-[width] duration-150",
          isDenon ? "bg-gradient-to-r from-neon-pink via-volt to-neon-cyan" : "bg-gradient-to-r from-aqua-deep via-aqua to-coral",
        )}
        style={{ width: `${prog * 100}%` }}
      />
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <a href="#home" className="group flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-mincho text-xl tracking-wider text-foam">八木海莉</span>
          <span className="font-serif text-sm italic text-aqua transition group-hover:text-coral">fan site</span>
        </a>
        <ul className="hidden items-center gap-0.5 lg:flex">
          {ITEMS.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition",
                  active === id
                    ? id === "denon"
                      ? "bg-volt text-abyss"
                      : "bg-aqua text-abyss"
                    : id === "denon"
                      ? "text-volt/80 hover:text-volt"
                      : "text-mist hover:text-foam",
                )}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <button ref={menuButton} className="rounded-full p-2 text-foam lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? '关闭菜单' : '打开菜单'} aria-expanded={open} aria-controls="mobile-navigation">
          {open ? <IClose /> : <IMenu />}
        </button>
      </nav>
      {open && (
        <ul id="mobile-navigation" className="grid grid-cols-3 gap-2 px-5 pb-5 lg:hidden">
          {ITEMS.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-xl border px-3 py-3 text-center text-sm",
                  active === id ? "border-aqua bg-aqua/10 text-aqua" : "border-white/10 text-foam/80",
                )}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
