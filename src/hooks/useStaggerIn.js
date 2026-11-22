import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { reduced } from "./motion";

// Staggers the matching children in once the container scrolls into view.
export default function useStaggerIn(selector, { from = 24, step = 70 } = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = root.querySelectorAll(selector);
    if (reduced() || !items.length) return;
    items.forEach((i) => (i.style.opacity = 0));
    let anim;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        anim = animate(items, {
          opacity: [0, 1],
          translateY: [from, 0],
          delay: stagger(step),
          duration: 800,
          ease: "outExpo",
        });
      },
      { threshold: 0.2 }
    );
    io.observe(root);
    return () => {
      io.disconnect();
      anim?.revert();
      items.forEach((i) => (i.style.opacity = ""));
    };
  }, [selector, from, step]);
  return ref;
}
