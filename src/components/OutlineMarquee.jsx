import { useEffect, useRef } from "react";
import { reduced } from "../hooks/motion";

const WORDS = ["Backend", "Systems", "Testing", "Cloud", "Security"];

// Heavy outlined type that scrolls sideways and leans with scroll speed.
const OutlineMarquee = () => {
  const lean = useRef(null);

  useEffect(() => {
    const el = lean.current;
    if (!el || reduced()) return;
    let lastY = window.scrollY, skew = 0, target = 0, raf = 0;
    const tick = () => {
      skew += (target - skew) * 0.12;
      target *= 0.9;
      el.style.transform = `skewX(${skew.toFixed(2)}deg)`;
      raf = Math.abs(skew) > 0.02 || Math.abs(target) > 0.02 ? requestAnimationFrame(tick) : 0;
    };
    const onScroll = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      target = Math.max(-14, Math.min(14, -dy * 0.35));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const row = WORDS.map((w) => (
    <span key={w} className="flex items-center gap-8 pr-8">
      <span className="outline-text text-7xl md:text-9xl font-semibold tracking-tight">{w}</span>
      <span className="size-3 rounded-full bg-white/40" aria-hidden="true" />
    </span>
  ));

  return (
    <div aria-hidden="true" className="overflow-hidden py-12 fade-x">
      <div ref={lean}>
        <div className="flex w-max animate-marquee">
          {row}
          {row}
        </div>
      </div>
    </div>
  );
};

export default OutlineMarquee;
