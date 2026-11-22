import { useEffect, useRef } from "react";
import { reduced } from "../hooks/motion";

// Dock style magnification: children grow as the pointer gets close to them.
const Magnify = ({ children, className = "", radius = 90, gain = 0.3 }) => {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || reduced() || window.matchMedia("(pointer: coarse)").matches) return;
    let frame = 0;
    let pt = null;
    const apply = () => {
      frame = 0;
      Array.from(root.children).forEach((c) => {
        if (!pt) {
          c.style.transform = "";
          c.style.zIndex = "";
          return;
        }
        const r = c.getBoundingClientRect();
        const d = Math.hypot(pt.x - (r.left + r.width / 2), pt.y - (r.top + r.height / 2));
        const k = Math.max(0, 1 - d / radius);
        c.style.transform = k ? `scale(${1 + gain * k})` : "";
        c.style.zIndex = k > 0.5 ? 1 : "";
      });
    };
    const move = (e) => {
      pt = { x: e.clientX, y: e.clientY };
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const leave = () => {
      pt = null;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerleave", leave);
    return () => {
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
    };
  }, [radius, gain]);

  return (
    <ul ref={ref} className={className}>
      {children}
    </ul>
  );
};

export default Magnify;
