import { useEffect, useMemo, useRef, useState } from "react";
import { animate, onScroll } from "animejs";
import { reduced } from "../hooks/motion";
import { onScrollingChange } from "../hooks/scrollIdle";

// A living backdrop, all driven by anime.js:
//  - three colour fields that drift and move at different speeds as you scroll
//  - a dot grid whose ripple keeps rolling out from random points and answers the cursor
//  - drifting, twinkling particles at different depths
//  - shooting stars that cross the sky every few seconds
//  - a soft light that follows the cursor
// The 3D scene lives in the hero.

const FIELDS = [
  { pos: { left: -260, top: -260 }, size: 900, rgb: "92,51,204", a: 0.5, par: 180 },
  { pos: { right: -240, top: "30%" }, size: 800, rgb: "51,194,204", a: 0.34, par: 300 },
  { pos: { left: "28%", bottom: -380 }, size: 880, rgb: "202,47,140", a: 0.26, par: 120 },
];
const TINTS = ["#ffffff", "#9fe8ee", "#c9c4ff"];

const measure = () => {
  const w = window.innerWidth;
  const gap = w < 640 ? 56 : 72;
  return { cols: Math.ceil(w / gap), rows: Math.ceil(window.innerHeight / gap) };
};

const Background = () => {
  const [{ cols, rows }, setGrid] = useState(measure);
  const root = useRef(null);
  const gridRef = useRef(null);
  const spot = useRef(null);
  const star = useRef(null);
  const dots = useMemo(() => Array.from({ length: cols * rows }, (_, i) => i), [cols, rows]);
  const specks = useMemo(() => {
    const n = window.innerWidth < 640 ? 22 : 46;
    return Array.from({ length: n }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: 1 + Math.random() * 2.4,
      c: TINTS[(Math.random() * TINTS.length) | 0],
      d: 5 + Math.random() * 9,
    }));
  }, []);

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

  // Dot grid: ripples that keep rolling out from fresh origins, plus a cursor wake
  useEffect(() => {
    const els = Array.from(gridRef.current?.children ?? []);
    if (!els.length || reduced()) return;
    let ripple;
    let alive = true;
    let paused = false;
    let timer;
    const roll = () => {
      if (!alive) return;
      // Pick an origin cell (often the centre) and delay each dot by its distance from it
      const oc = Math.random() < 0.4 ? cols / 2 : Math.random() * cols;
      const or = Math.random() < 0.4 ? rows / 2 : Math.random() * rows;
      ripple = animate(els, {
        scale: [1, 2.6, 1],
        opacity: [0.12, 0.65, 0.12],
        delay: (_, i) => Math.hypot((i % cols) - oc, Math.floor(i / cols) - or) * 120,
        duration: 800,
        ease: "inOutQuad",
        onComplete: () => {
          if (alive) timer = setTimeout(roll, 900);
        },
      });
      if (paused) ripple.pause();
    };
    roll();

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
    const offIdle = onScrollingChange((s) => {
      paused = s;
      if (s) ripple?.pause();
      else ripple?.play();
    });
    return () => {
      alive = false;
      clearTimeout(timer);
      offIdle();
      window.removeEventListener("pointermove", onMove);
      ripple?.revert();
      wake?.revert();
    };
  }, [cols, rows]);

  // Fields, particles, shooting stars, spotlight, scroll parallax
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    if (reduced()) {
      host.style.opacity = 1;
      return;
    }
    const made = [animate(host, { opacity: [0, 1], duration: 1600, ease: "outQuad" })];
    const add = (a) => (made.push(a), a);

    // Colour fields drift and breathe
    host.querySelectorAll("[data-field]").forEach((f, i) => {
      add(
        animate(f, {
          translateX: [0, i % 2 ? -200 : 200, 0],
          translateY: [0, i === 1 ? 160 : -160, 0],
          scale: [1, 1.12, 1],
          duration: 14000 + i * 3500,
          ease: "inOutSine",
          loop: true,
        })
      );
    });

    // Particles drift up and down and twinkle at their own pace
    host.querySelectorAll("[data-speck]").forEach((s, i) => {
      add(
        animate(s, {
          translateY: [0, i % 2 ? -70 : 70, 0],
          translateX: [0, i % 3 ? 24 : -24, 0],
          opacity: [0.15, 0.9, 0.15],
          duration: Number(s.dataset.d) * 1000,
          delay: i * 120,
          ease: "inOutSine",
          loop: true,
        })
      );
    });

    // Scroll parallax: each field moves at its own speed
    const main = document.querySelector("main");
    if (main) {
      host.querySelectorAll("[data-par]").forEach((w) => {
        add(
          animate(w, {
            translateY: [0, -Number(w.dataset.par)],
            ease: "linear",
            autoplay: onScroll({ target: main, enter: "top top", leave: "bottom bottom", sync: true }),
          })
        );
      });
    }

    // Shooting stars
    let timer;
    let alive = true;
    let scrolling = false;
    const shoot = () => {
      if (!alive) return;
      const el = star.current;
      if (el && !scrolling && !document.hidden) {
        el.style.left = `${Math.random() * 70}%`;
        el.style.top = `${Math.random() * 45}%`;
        animate(el, {
          translateX: [0, 520],
          translateY: [0, 300],
          rotate: 30,
          opacity: [0, 1, 0],
          duration: 1100,
          ease: "outQuad",
        });
      }
      timer = setTimeout(shoot, 2500 + Math.random() * 4000);
    };
    timer = setTimeout(shoot, 1800);
    const offIdle = onScrollingChange((s) => (scrolling = s));

    // Cursor light
    let tx = -999, ty = -999, x = -999, y = -999, raf = 0;
    const tick = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      if (spot.current) spot.current.style.transform = `translate(${x - 280}px, ${y - 280}px)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (spot.current) spot.current.style.opacity = 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      alive = false;
      clearTimeout(timer);
      offIdle();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      made.forEach((a) => a.revert?.());
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ opacity: 0, contain: "strict" }}
    >
      {FIELDS.map((f, i) => (
        <div key={i} data-par={f.par} className="absolute inset-0" style={{ willChange: "transform" }}>
          <div
            data-field
            className="absolute rounded-full"
            style={{
              ...f.pos,
              width: f.size,
              height: f.size,
              willChange: "transform",
              background: `radial-gradient(closest-side, rgba(${f.rgb},${f.a}), rgba(${f.rgb},0))`,
            }}
          />
        </div>
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

      {specks.map((s, i) => (
        <span
          key={i}
          data-speck
          data-d={s.d}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            background: s.c,
            opacity: 0.15,
            willChange: "transform, opacity",
          }}
        />
      ))}

      <span
        ref={star}
        className="absolute h-px w-36"
        style={{
          opacity: 0,
          background: "linear-gradient(to right, rgba(255,255,255,0), #ffffff)",
          willChange: "transform, opacity",
        }}
      />

      <div
        ref={spot}
        className="absolute left-0 top-0 rounded-full"
        style={{
          width: 560,
          height: 560,
          opacity: 0,
          transition: "opacity 600ms",
          willChange: "transform",
          background: "radial-gradient(closest-side, rgba(150,130,255,0.2), rgba(150,130,255,0))",
        }}
      />
    </div>
  );
};

export default Background;
