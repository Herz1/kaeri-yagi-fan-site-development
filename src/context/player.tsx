import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import type { PTrack } from "../data/site";

export interface PlayerAPI {
  queue: PTrack[];
  index: number;
  current: PTrack | null;
  playing: boolean;
  loading: boolean;
  playQueue: (q: PTrack[], i?: number) => void;
  toggle: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (ratio: number) => void;
  stop: () => void;
  getAnalyser: () => AnalyserNode | null;
}

const Ctx = createContext<PlayerAPI | null>(null);
const TimeCtx = createContext<{ time: number; duration: number }>({ time: 0, duration: 30 });

export function usePlayer() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return c;
}
export const usePlayerTime = () => useContext(TimeCtx);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const acRef = useRef<AudioContext | null>(null);
  const anRef = useRef<AnalyserNode | null>(null);
  const qRef = useRef<PTrack[]>([]);
  const iRef = useRef(0);
  const [queue, setQueue] = useState<PTrack[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(30);

  const load = useCallback((i: number) => {
    const a = audioRef.current;
    const t = qRef.current[i];
    if (!a || !t) return;
    iRef.current = i;
    setIndex(i);
    setTime(0);
    setLoading(true);
    a.src = t.preview;
    a.play().catch(() => {
      setPlaying(false);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const a = new Audio();
    a.crossOrigin = "anonymous"; // iTunes previews send CORS headers → enables the analyser
    a.preload = "auto";
    a.volume = 0.85;
    audioRef.current = a;
    const handlers: Record<string, () => void> = {
      timeupdate: () => setTime(a.currentTime),
      loadedmetadata: () => setDuration(Number.isFinite(a.duration) ? a.duration : 30),
      playing: () => {
        setPlaying(true);
        setLoading(false);
      },
      play: () => setPlaying(true),
      pause: () => setPlaying(false),
      waiting: () => setLoading(true),
      canplay: () => setLoading(false),
      error: () => {
        setLoading(false);
        setPlaying(false);
      },
      ended: () => {
        const n = iRef.current + 1;
        if (n < qRef.current.length) load(n);
        else {
          setPlaying(false);
          setTime(0);
        }
      },
    };
    Object.entries(handlers).forEach(([k, f]) => a.addEventListener(k, f));
    return () => {
      Object.entries(handlers).forEach(([k, f]) => a.removeEventListener(k, f));
      a.pause();
      a.removeAttribute("src");
    };
  }, [load]);

  const ensureGraph = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (acRef.current) {
      if (acRef.current.state === "suspended") void acRef.current.resume();
      return;
    }
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      const ac = new AC();
      const src = ac.createMediaElementSource(a);
      const an = ac.createAnalyser();
      an.fftSize = 256;
      an.smoothingTimeConstant = 0.8;
      src.connect(an);
      an.connect(ac.destination);
      acRef.current = ac;
      anRef.current = an;
    } catch {
      /* visualizer unavailable — audio still plays normally */
    }
  }, []);

  const playQueue = useCallback(
    (q: PTrack[], i = 0) => {
      if (!q.length) return;
      ensureGraph();
      qRef.current = q;
      setQueue(q);
      load(i);
    },
    [ensureGraph, load],
  );

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a || !qRef.current.length) return;
    ensureGraph();
    if (a.paused) a.play().catch(() => setPlaying(false));
    else a.pause();
  }, [ensureGraph]);

  const pause = useCallback(() => audioRef.current?.pause(), []);
  const next = useCallback(() => {
    const n = iRef.current + 1;
    if (n < qRef.current.length) load(n);
  }, [load]);
  const prev = useCallback(() => {
    const a = audioRef.current;
    if (a && a.currentTime > 3) {
      a.currentTime = 0;
      return;
    }
    const n = iRef.current - 1;
    if (n >= 0) load(n);
  }, [load]);
  const seek = useCallback((r: number) => {
    const a = audioRef.current;
    if (a && Number.isFinite(a.duration)) a.currentTime = Math.max(0, Math.min(1, r)) * a.duration;
  }, []);
  const stop = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.removeAttribute("src");
    }
    qRef.current = [];
    setQueue([]);
    setIndex(0);
    setPlaying(false);
    setLoading(false);
    setTime(0);
  }, []);
  const getAnalyser = useCallback(() => anRef.current, []);

  const value = useMemo<PlayerAPI>(
    () => ({
      queue,
      index,
      current: queue[index] ?? null,
      playing,
      loading,
      playQueue,
      toggle,
      pause,
      next,
      prev,
      seek,
      stop,
      getAnalyser,
    }),
    [queue, index, playing, loading, playQueue, toggle, pause, next, prev, seek, stop, getAnalyser],
  );
  const timeValue = useMemo(() => ({ time, duration }), [time, duration]);

  return (
    <Ctx.Provider value={value}>
      <TimeCtx.Provider value={timeValue}>{children}</TimeCtx.Provider>
    </Ctx.Provider>
  );
}

/** Writes the current bass energy (0–1) into the CSS variable `--beat` on the target element. */
export function useBeat(target: RefObject<HTMLElement | null>, enabled: boolean) {
  const { getAnalyser } = usePlayer();
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    if (!enabled) {
      el.style.setProperty("--beat", "0");
      return;
    }
    let raf = 0;
    const data = new Uint8Array(128);
    const loop = () => {
      const an = getAnalyser();
      let v = 0;
      if (an) {
        an.getByteFrequencyData(data);
        let s = 0;
        for (let i = 1; i < 9; i++) s += data[i];
        v = Math.pow(s / (8 * 255), 1.8);
      }
      el.style.setProperty("--beat", v.toFixed(3));
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--beat", "0");
    };
  }, [enabled, getAnalyser, target]);
}
