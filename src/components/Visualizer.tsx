import { useEffect, useRef } from "react";
import { usePlayer } from "../context/player";

/** Real-time frequency bars driven by the Web Audio analyser (gentle idle wave when nothing plays). */
export function Visualizer({
  className,
  bars = 40,
  from = "#35aebf",
  to = "#7fdbe6",
  idle = true,
  mirror = false,
}: {
  className?: string;
  bars?: number;
  from?: string;
  to?: string;
  idle?: boolean;
  mirror?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { getAnalyser, playing } = usePlayer();
  const live = useRef(playing);
  live.current = playing;
  const colors = useRef([from, to]);
  colors.current = [from, to];

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const data = new Uint8Array(128);
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
        cv.width = Math.round(w * dpr);
        cv.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const an = getAnalyser();
      const on = !!an && live.current;
      if (on && an) an.getByteFrequencyData(data);
      t += 0.045;
      const gap = Math.max(1, (w / bars) * 0.3);
      const bw = (w - gap * (bars - 1)) / bars;
      const g = ctx.createLinearGradient(0, h, 0, 0);
      if (mirror) {
        // symmetric: accent colour at the centre line, highlight colour at the peaks
        g.addColorStop(0, colors.current[1]);
        g.addColorStop(0.5, colors.current[0]);
        g.addColorStop(1, colors.current[1]);
      } else {
        g.addColorStop(0, colors.current[0]);
        g.addColorStop(1, colors.current[1]);
      }
      ctx.fillStyle = g;
      for (let i = 0; i < bars; i++) {
        let v: number;
        if (on) v = data[1 + Math.floor(Math.pow(i / bars, 1.25) * 100)] / 255;
        else if (idle) v = 0.1 + 0.08 * (Math.sin(t + i * 0.45) + 1);
        else v = 0.04;
        const bh = Math.max(2, v * (mirror ? h / 2 : h));
        ctx.globalAlpha = on ? 1 : 0.6;
        const x = i * (bw + gap);
        if (mirror) ctx.fillRect(x, h / 2 - bh, bw, bh * 2);
        else ctx.fillRect(x, h - bh, bw, bh);
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [bars, getAnalyser, idle, mirror]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
