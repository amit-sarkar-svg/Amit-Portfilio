import { useEffect, useMemo, useRef, useState } from "react";
import { animate, onScroll, stagger, svg } from "animejs";
import { reduced } from "../hooks/motion";

// Everything here is driven by anime.js: a dot grid with a ripple that radiates from the centre
// and answers the cursor, circuit traces that draw themselves while packets ride along them,
// slowly rotating orbit rings, drifting colour fields, and scroll linked parallax.
// Nothing blinks: every loop is a smooth eased wave.

const VIOLET = "#7a57db";
const CYAN = "#33c2cc";

const TRACES = [
  "M -20 120 H 380 L 440 180 H 820 L 880 120 H 1620",
  "M -20 260 H 220 L 300 340 H 700 L 760 400 H 1100 L 1160 340 H 1620",
  "M 200 -20 V 140 L 260 200 V 520 L 320 580 V 1020",
  "M 1380 -20 V 220 L 1320 280 V 600 L 1380 660 V 1020",
  "M -20 560 H 500 L 560 620 H 900 L 960 560 H 1300 L 1360 620 H 1620",
  "M -20 820 H 160 L 220 880 H 640 L 700 820 H 1180 L 1240 880 H 1620",
  "M 700 -20 V 80 L 760 140 V 460 L 700 520 V 1020",
  "M 1000 1020 V 760 L 1060 700 V 420 L 1120 360 V -20",
];

const measure = () => {
  const w = window.innerWidth;
  const gap = w < 640 ? 44 : 56;
  return { cols: Math.ceil(w / gap), rows: Math.ceil(window.innerHeight / gap) };
};

const Background = () => {
  const [{ cols, rows }, setGrid] = useState(measure);
  const root = useRef(null);
  const gridRef = useRef(null);
  const traceLayer = useRef(null);
  const dots = useMemo(() => Array.from({ length: cols * rows }, (_, i) => i), [cols, rows]);

  // Rebuild the grid when the viewport changes shape.
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

  // Dot grid: centre ripple plus a cursor wake.
  useEffect(() => {
    const els = Array.from(gridRef.current?.children ?? []);
    if (!els.length || reduced()) return;

    const ripple = animate(els, {
      scale: [1, 2.6, 1],
      opacity: [0.14, 0.7, 0.14],
      delay: stagger(55, { grid: [cols, rows], from: "center" }),
      duration: 1600,
      ease: "inOutQuad",
      loop: true,
      loopDelay: 3000,
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
      for (let y = Math.max(0, r - 4); y <= Math.min(rows - 1, r + 4); y++) {
        for (let x = Math.max(0, c - 4); x <= Math.min(cols - 1, c + 4); x++) {
          const d = Math.hypot(x - c, y - r);
          if (d <= 4) {
            hit.push(els[y * cols + x]);
            dist.push(d);
          }
        }
      }
      wake?.pause();
      wake = animate(hit, {
        translateY: [0, -8, 0],
        backgroundColor: ["#ffffff", CYAN, "#ffffff"],
        delay: (_, i) => dist[i] * 50,
        duration: 900,
        ease: "outQuad",
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      ripple.revert();
      wake?.revert();
    };
  }, [cols, rows]);

  // Traces, packets, orbits, colour fields, entrance and scroll parallax.
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const $ = (s) => Array.from(host.querySelectorAll(s));
    if (reduced()) {
      host.style.opacity = 1;
      return;
    }
    const made = [];
    const add = (a) => (made.push(a), a);

    add(animate(host, { opacity: [0, 1], duration: 1800, ease: "outQuad" }));

    // Circuit traces draw themselves in and out, one after another.
    add(
      animate(svg.createDrawable(".trace-draw"), {
        draw: ["0 0", "0 1", "1 1"],
        duration: (_, i) => 5200 + i * 500,
        delay: stagger(650),
        ease: "inOutQuad",
        loop: true,
      })
    );

    // Packets ride along each trace.
    $(".packet").forEach((pk, i) => {
      const path = host.querySelector(`#trace-${i}`);
      pk.style.opacity = 1;
      add(
        animate(pk, {
          ...svg.createMotionPath(path),
          duration: 6500 + i * 900,
          delay: i * 700,
          ease: "linear",
          loop: true,
        })
      );
    });

    // Orbit rings turn at different speeds.
    $(".orbit").forEach((ring, i) => {
      add(
        animate(ring, {
          rotate: i % 2 ? -360 : 360,
          duration: 60000 + i * 25000,
          ease: "linear",
          loop: true,
        })
      );
    });

    // Colour fields drift slowly and breathe in size.
    $(".field").forEach((f, i) => {
      add(
        animate(f, {
          translateX: [0, i % 2 ? -140 : 140, 0],
          translateY: [0, i === 1 ? 120 : -120, 0],
          scale: [1, 1.25, 1],
          duration: 22000 + i * 6000,
          ease: "inOutSine",
          loop: true,
        })
      );
    });

    // Scroll linked parallax: layers move at different speeds as the page scrolls.
    const main = document.querySelector("main");
    if (main) {
      const sync = { target: main, enter: "top top", leave: "bottom bottom", sync: true };
      add(
        animate(traceLayer.current, {
          translateY: [0, -320],
          ease: "linear",
          autoplay: onScroll(sync),
        })
      );
      add(
        animate(gridRef.current, {
          translateY: [0, -90],
          ease: "linear",
          autoplay: onScroll({ ...sync }),
        })
      );
    }

    return () => made.forEach((a) => a.revert?.());
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ opacity: 0 }}
    >
      {/* Colour fields: flat shapes softened by blur, drifting with anime.js */}
      <div className="field absolute -left-40 -top-40 size-[640px] rounded-full bg-[#5c33cc] opacity-30 blur-[140px]" />
      <div className="field absolute -right-40 top-1/4 size-[560px] rounded-full bg-[#33c2cc] opacity-20 blur-[140px]" />
      <div className="field absolute left-1/3 -bottom-60 size-[620px] rounded-full bg-[#ca2f8c] opacity-15 blur-[150px]" />

      {/* Dot grid */}
      <div
        ref={gridRef}
        className="absolute inset-x-0 top-0 grid h-[calc(100%+96px)]"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {dots.map((i) => (
          <span
            key={i}
            className="size-[3px] rounded-full bg-white place-self-center"
            style={{ opacity: 0.14 }}
          />
        ))}
      </div>

      {/* Traces, packets and orbits */}
      <svg
        ref={traceLayer}
        className="absolute inset-x-0 top-0 w-full h-[calc(100%+320px)]"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <g className="orbits">
          {[170, 290, 420].map((r, i) => (
            <circle
              key={r}
              className="orbit"
              cx="1180"
              cy="330"
              r={r}
              fill="none"
              stroke={i === 1 ? CYAN : VIOLET}
              strokeOpacity="0.35"
              strokeWidth="1"
              strokeDasharray={["2 14", "120 210", "1 22"][i]}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          ))}
        </g>

        {TRACES.map((d, i) => (
          <g key={i}>
            <path
              id={`trace-${i}`}
              d={d}
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.07"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="trace-draw"
              d={d}
              fill="none"
              stroke={i % 2 ? CYAN : VIOLET}
              strokeOpacity="0.8"
              strokeWidth="1.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}

        {TRACES.map((_, i) => (
          <g key={i} className="packet" style={{ opacity: 0 }}>
            <circle r="9" fill={i % 2 ? CYAN : VIOLET} fillOpacity="0.28" />
            <circle r="3" fill="#ffffff" />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default Background;
