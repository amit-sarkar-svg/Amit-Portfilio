import { useEffect, useRef } from "react";
import { animate, splitText, stagger } from "animejs";
import { reduced } from "../hooks/motion";

// Headline whose words slide up out of a clip mask when it scrolls into view.
const SplitHeading = ({ as: Tag = "h2", className = "", children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      el.style.opacity = 1;
      return;
    }
    el.style.opacity = 0;
    let split, anim;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        split = splitText(el, { words: { wrap: "clip" } });
        el.style.opacity = 1;
        anim = animate(split.words, {
          translateY: ["110%", "0%"],
          opacity: [0, 1],
          delay: stagger(70),
          duration: 900,
          ease: "outExpo",
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      anim?.revert();
      split?.revert();
    };
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
};

export default SplitHeading;
