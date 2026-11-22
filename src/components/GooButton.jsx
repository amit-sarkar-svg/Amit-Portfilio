import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { reduced } from "../hooks/motion";

// A white lacquer pill. When the cursor comes close, blobs ooze out toward it and
// an SVG goo filter fuses them into the pill. Falls back to a plain pill on touch
// screens and for reduced motion.
const BLOBS = [
  { x: 0.2, y: 0.5, s: 22 },
  { x: 0.4, y: 0.35, s: 18 },
  { x: 0.6, y: 0.65, s: 20 },
  { x: 0.8, y: 0.5, s: 24 },
];
const REACH = 150;

const GooButton = ({ href, children, target, rel, className = "" }) => {
  const wrap = useRef(null);
  const layer = useRef(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el || reduced() || window.matchMedia("(pointer: coarse)").matches) return;
    const blobs = Array.from(layer.current.querySelectorAll("[data-blob]"));
    let anim;
    let near = false;
    let last = 0;

    const onMove = (e) => {
      const now = performance.now();
      if (now - last < 50) return;
      last = now;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const outX = Math.max(Math.abs(dx) - r.width / 2, 0);
      const outY = Math.max(Math.abs(dy) - r.height / 2, 0);
      const gap = Math.hypot(outX, outY);
      if (gap > REACH) {
        if (near) release();
        return;
      }
      near = true;
      const len = Math.hypot(dx, dy) || 1;
      const pull = Math.min(Math.max(REACH - gap, 0) * 0.5, 48);
      anim?.pause();
      anim = animate(blobs, {
        translateX: (_, i) => (dx / len) * pull * (0.5 + i * 0.2),
        translateY: (_, i) => (dy / len) * pull * (0.5 + i * 0.2),
        scale: (_, i) => 1 + (pull / 48) * (0.4 + i * 0.1),
        delay: stagger(35),
        duration: 700,
        ease: "outElastic(1, .55)",
      });
    };
    const release = () => {
      near = false;
      anim?.pause();
      anim = animate(blobs, {
        translateX: 0,
        translateY: 0,
        scale: 1,
        delay: stagger(30),
        duration: 900,
        ease: "outElastic(1, .5)",
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      anim?.pause();
    };
  }, []);

  return (
    <a
      ref={wrap}
      href={href}
      target={target}
      rel={rel}
      className={`relative inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full text-black button-md cursor-pointer select-none transition-transform duration-300 ease-base active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${className}`}
    >
      {/* Goo layer: the pill and the blobs are merged by the SVG filter */}
      <span
        ref={layer}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ filter: "url(#goo)" }}
      >
        <span className="absolute inset-0 rounded-full bg-white" />
        {BLOBS.map((b, i) => (
          <span
            key={i}
            data-blob
            className="absolute rounded-full bg-white"
            style={{
              width: b.s,
              height: b.s,
              left: `calc(${b.x * 100}% - ${b.s / 2}px)`,
              top: `calc(${b.y * 100}% - ${b.s / 2}px)`,
            }}
          />
        ))}
      </span>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </a>
  );
};

export const GooFilter = () => (
  <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
    <defs>
      <filter id="goo" x="-60%" y="-120%" width="220%" height="340%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
        />
      </filter>
    </defs>
  </svg>
);

export default GooButton;
