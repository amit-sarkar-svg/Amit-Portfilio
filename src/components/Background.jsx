import { useEffect, useMemo, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { reduced } from "../hooks/motion";
import { onScrollingChange } from "../hooks/scrollIdle";

// A calm page backdrop: three drifting colour fields and a dot grid whose ripple
// radiates from the centre and answers the cursor. The 3D scene lives in the hero.

const FIELDS = [
  { pos: { left: -260, top: -260 }, size: 900, rgb: "92,51,204", a: 0.42 },
  { pos: { right: -240, top: "30%" }, size: 800, rgb: "51,194,204", a: 0.26 },
  { pos: { left: "28%", bottom: -380 }, size: 880, rgb: "202,47,140", a: 0.2 },
];

const measure = () => {
  const w = window.innerWidth;
  const gap = w < 640 ? 56 : 72;
  return { cols: Math.ceil(w / gap), rows: Math.ceil(window.innerHeight / gap) };
};

const Background = () => {
  const [{ cols, rows }, setGrid] = useState(measure);
  const root = useRef(null);
  const gridRef = useRef(null);
  const dots = useMemo(() => Array.from({ length: cols * rows }, (_, i) => i), [cols, rows]);

  useEffect(() => {
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => setGrid(measure()), 250);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Dot grid ripple and cursor wake
  useEffect(() => {
    const els = Array.from(gridRef.current?.children ?? []);
    if (!els.length || reduced()) return;
    const ripple = animate(els, {
      scale: [1, 2.4, 1],
      opacity: [0.12, 0.6, 0.12],
      delay: stagger(55, { grid: [cols, rows], from: "center" }),
      duration: 1600,
      ease: "inOutQuad",
      loop: true,
      loopDelay: 3600,
    });
    let wake;
    let last = 0;
    const onMove = (e) => {
      const now = performance.now();
      if (now - last < 110) return;
      last = now;
      const c = Math.floor((e.clientX / window.innerWidth) * cols);
      const r = Math.floor((e.clientY / window.innerHeight) * rows);
      const hit = [];
      const dist = [];
      for (let y = Math.max(0, r - 3); y <= Math.min(rows - 1, r + 3); y++) {
        for (let x = Math.max(0, c - 3); x <= Math.min(cols - 1, c + 3); x++) {
          const d = Math.hypot(x - c, y - r);
          if (d <= 3) {
            hit.push(els[y * cols + x]);
            dist.push(d);
          }
        }
      }
      wake?.pause();
      wake = animate(hit, {
        translateY: [0, -8, 0],
        backgroundColor: ["#ffffff", "#33c2cc", "#ffffff"],
        delay: (_, i) => dist[i] * 50,
        duration: 900,
        ease: "outQuad",
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const offIdle = onScrollingChange((s) => (s ? ripple.pause() : ripple.play()));
    return () => {
      offIdle();
      window.removeEventListener("pointermove", onMove);
      ripple.revert();
      wake?.revert();
    };
  }, [cols, rows]);

  // Entrance and field drift
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    if (reduced()) {
      host.style.opacity = 1;
      return;
    }
    const made = [animate(host, { opacity: [0, 1], duration: 1800, ease: "outQuad" })];
    host.querySelectorAll(".field").forEach((f, i) => {
      made.push(
        animate(f, {
          translateX: [0, i % 2 ? -140 : 140, 0],
          translateY: [0, i === 1 ? 120 : -120, 0],
          duration: 22000 + i * 6000,
          ease: "inOutSine",
          loop: true,
        })
      );
    });
    return () => made.forEach((a) => a.revert?.());
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ opacity: 0, contain: "strict" }}
    >
      {FIELDS.map((f, i) => (
        <div
          key={i}
          className="field absolute rounded-full"
          style={{
            ...f.pos,
            width: f.size,
            height: f.size,
            willChange: "transform",
            background: `radial-gradient(closest-side, rgba(${f.rgb},${f.a}), rgba(${f.rgb},0))`,
          }}
        />
      ))}
      <div
        ref={gridRef}
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {dots.map((i) => (
          <span
            key={i}
            className="size-[3px] rounded-full bg-white place-self-center"
            style={{ opacity: 0.12 }}
          />
        ))}
      </div>
    </div>
  );
};

export default Background;
