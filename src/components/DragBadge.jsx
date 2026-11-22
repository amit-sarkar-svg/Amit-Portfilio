import { useEffect, useRef, useState } from "react";
import { createDraggable } from "animejs";
import { HandGrabbing } from "@phosphor-icons/react";
import { reduced } from "../hooks/motion";

const LINES = ["Drag me", "Wheee", "Nice throw", "Again?", "Keep going"];

// A little sticker you can pick up and throw around the hero. It keeps its momentum.
const DragBadge = ({ container }) => {
  const el = useRef(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!el.current || !container.current || reduced() || window.matchMedia("(pointer: coarse)").matches) return;
    const d = createDraggable(el.current, {
      container: container.current,
      releaseStiffness: 40,
      releaseDamping: 12,
      containerFriction: 0.8,
      onRelease: () => setN((v) => (v + 1) % LINES.length),
    });
    return () => d.revert();
  }, [container]);

  return (
    <div
      ref={el}
      className="absolute z-20 items-center hidden gap-2 px-3 py-2 border cursor-grab active:cursor-grabbing select-none lg:flex rounded-full bg-s1/90 border-white/15 right-10 bottom-28 caption-1 text-neutral-200"
      style={{ touchAction: "none" }}
    >
      <HandGrabbing size={16} weight="bold" aria-hidden="true" />
      {LINES[n]}
    </div>
  );
};

export default DragBadge;
