import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { reduced } from "../hooks/motion";

// Holographic tilt: the card leans toward the pointer and a soft sheen follows it.
const Tilt = ({ children, max = 7, className = "" }) => {
  const ref = useRef(null);
  const sheen = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || window.matchMedia("(pointer: coarse)").matches) return;
    let anim;
    let last = 0;
    const move = (e) => {
      const now = performance.now();
      if (now - last < 40) return;
      last = now;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      anim?.pause();
      anim = animate(el, {
        rotateY: (px - 0.5) * 2 * max,
        rotateX: -(py - 0.5) * 2 * max,
        duration: 450,
        ease: "outQuad",
      });
      if (sheen.current) {
        sheen.current.style.opacity = 1;
        sheen.current.style.background = `radial-gradient(240px circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.12), transparent 70%)`;
      }
    };
    const leave = () => {
      anim?.pause();
      anim = animate(el, { rotateX: 0, rotateY: 0, duration: 900, ease: "outElastic(1, .6)" });
      if (sheen.current) sheen.current.style.opacity = 0;
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      anim?.pause();
    };
  }, [max]);

  return (
    <div style={{ perspective: 900 }} className={className}>
      <div ref={ref} className="relative h-full" style={{ transformStyle: "preserve-3d" }}>
        {children}
        <span
          ref={sheen}
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 ease-base"
          style={{ opacity: 0 }}
        />
      </div>
    </div>
  );
};

export default Tilt;
