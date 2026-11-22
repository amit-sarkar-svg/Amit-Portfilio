import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { reduced } from "../hooks/motion";

const GLYPHS = "01<>/{}[]#$%&*+=";

// Text that decodes from random characters on hover. Plain text for reduced motion.
const Scramble = ({ as: Tag = "span", children, className = "", ...rest }) => {
  const ref = useRef(null);
  const anim = useRef();
  const text = String(children);

  useEffect(() => () => anim.current?.pause(), []);

  const run = () => {
    const el = ref.current;
    if (!el || reduced()) return;
    anim.current?.pause();
    const state = { p: 0 };
    anim.current = animate(state, {
      p: 1,
      duration: 650,
      ease: "outQuad",
      onUpdate: () => {
        const reveal = Math.floor(state.p * text.length);
        el.textContent = text
          .split("")
          .map((c, i) => (c === " " || i < reveal ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join("");
      },
      onComplete: () => (el.textContent = text),
    });
  };

  return (
    <Tag ref={ref} className={className} onPointerEnter={run} onFocus={run} {...rest}>
      {text}
    </Tag>
  );
};

export default Scramble;
