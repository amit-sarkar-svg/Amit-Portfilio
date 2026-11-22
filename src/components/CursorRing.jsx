import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { reduced } from "../hooks/motion";

// A soft ring that trails the cursor and swells over anything clickable.
const CursorRing = () => {
  const ring = useRef(null);

  useEffect(() => {
    const el = ring.current;
    if (!el || reduced() || !window.matchMedia("(pointer: fine)").matches) return;
    let tx = -100, ty = -100, x = -100, y = -100, raf = 0, scaleAnim;
    let big = false;
    const tick = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      el.style.transform = `translate(${x - 16}px, ${y - 16}px)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      el.style.opacity = 1;
      if (!raf) raf = requestAnimationFrame(tick);
      const hot = !!e.target.closest?.("a, button, summary, input, [role='button']");
      if (hot !== big) {
        big = hot;
        scaleAnim?.pause();
        scaleAnim = animate(el.firstElementChild, { scale: hot ? 1.9 : 1, duration: 500, ease: "outElastic(1, .6)" });
      }
    };
    const onLeave = () => (el.style.opacity = 0);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ring}
      aria-hidden="true"
      className="fixed left-0 top-0 z-[95] pointer-events-none"
      style={{ opacity: 0, willChange: "transform", transition: "opacity 300ms" }}
    >
      <div className="size-8 rounded-full border border-white/50" />
    </div>
  );
};

export default CursorRing;
