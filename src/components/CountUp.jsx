import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { reduced } from "../hooks/motion";

// Counts from 0 to a target the first time it scrolls into view.
const CountUp = ({ to, suffix = "", className = "" }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.textContent = `${to}${suffix}`;
    if (reduced()) return;
    el.textContent = `0${suffix}`;
    let anim;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const state = { n: 0 };
        anim = animate(state, {
          n: to,
          duration: 1800,
          ease: "outExpo",
          onUpdate: () => {
            el.textContent = `${Math.round(state.n)}${suffix}`;
          },
        });
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      anim?.revert();
    };
  }, [to, suffix]);

  return <span ref={ref} className={className} />;
};

export default CountUp;
