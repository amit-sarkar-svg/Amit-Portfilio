import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { reduced } from "../hooks/motion";

// Pulls its child slightly toward the cursor, then springs back.
const Magnetic = ({ children, strength = 0.25, className = "" }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || window.matchMedia("(pointer: coarse)").matches) return;
    let anim;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      anim?.pause();
      anim = animate(el, { translateX: x, translateY: y, duration: 400, ease: "outExpo" });
    };
    const leave = () => {
      anim?.pause();
      anim = animate(el, { translateX: 0, translateY: 0, duration: 900, ease: "outElastic(1, .5)" });
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      anim?.pause();
    };
  }, [strength]);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
};

export default Magnetic;
