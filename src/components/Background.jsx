import { useEffect, useMemo, useRef, useState } from "react";
import { animate, onScroll, stagger, svg } from "animejs";
import { reduced } from "../hooks/motion";
import { onScrollingChange } from "../hooks/scrollIdle";

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
];

// Pre-rendered radial fields: rasterised once, then only translated (no live blur).
const FIELDS = [
  { pos: { left: -260, top: -260 }, size: 900, rgb: "92,51,204", a: 0.5 },
  { pos: { right: -240, top: "22%" }, size: 800, rgb: "51,194,204", a: 0.32 },
  { pos: { left: "28%", bottom: -380 }, size: 880, rgb: "202,47,140", a: 0.24 },
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
    const offIdle = onScrollingChange((s) => (s ? ripple.pause() : ripple.play()));

    return () => {
      offIdle();
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
    const heavy = [];
    const add = (a) => (made.push(a), a);

    add(animate(host, { opacity: [0, 1], duration: 1800, ease: "outQuad" }));

    // Circuit traces draw themselves in and out, one after another.
    heavy.push(
      add(
      animate(svg.createDrawable(".trace-draw"), {
        draw: ["0 0", "0 1", "1 1"],
        duration: (_, i) => 5200 + i * 500,
        delay: stagger(650),
        ease: "inOutQuad",
        loop: true,
      })
    ));

    // Packets ride along each trace.
    $(".packet").forEach((pk, i) => {
      const path = host.querySelector(`#trace-${i}`);
      pk.style.opacity = 1;
      heavy.push(
        add(
          animate(pk, {
            ...svg.createMotionPath(path),
            duration: 6500 + i * 900,
            delay: i * 700,
            ease: "linear",
            loop: true,
          })
        )
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
    }

    const offIdle = onScrollingChange((s) => heavy.forEach((a) => (s ? a.pause() : a.play())));

    return () => {
      offIdle();
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
      {/* Colour fields: flat shapes softened by blur, drifting with anime.js */}
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

      {/* Orbit rings: each is its own layer so rotation never repaints the page */}
      <div className="absolute" style={{ left: "74%", top: "33%", width: 0, height: 0 }}>
        {[170, 290, 420].map((r, i) => (
          <div
            key={r}
            className="orbit absolute"
            style={{ width: r * 2, height: r * 2, left: -r, top: -r, willChange: "transform" }}
          >
            <svg viewBox={`0 0 ${r * 2} ${r * 2}`} width="100%" height="100%">
              <circle
                cx={r}
                cy={r}
                r={r - 1}
                fill="none"
                stroke={i === 1 ? CYAN : VIOLET}
                strokeOpacity="0.35"
                strokeDasharray={["2 14", "120 210", "1 22"][i]}
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Traces and packets */}
      <svg
        ref={traceLayer}
        className="absolute inset-x-0 top-0 w-full h-[calc(100%+320px)]"
        style={{ willChange: "transform" }}
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
      >
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
