import { useEffect, useRef, useState } from "react";

// Words go from muted to full color one at a time as they cross a trigger line.
const TaglineReveal = ({ text }) => {
  const words = text.split(" ");
  const refs = useRef([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.72;
      let count = 0;
      refs.current.forEach((el) => {
        if (el && el.getBoundingClientRect().top < line) count += 1;
      });
      setActive((prev) => (prev === count ? prev : count));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <p className="heading-2 max-w-[880px]" aria-label={text}>
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden="true"
          ref={(el) => (refs.current[i] = el)}
          className={`tag-word ${i < active ? "tag-word-on" : ""}`}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
};

export default TaglineReveal;
