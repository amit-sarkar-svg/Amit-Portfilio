import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { reduced } from "../hooks/motion";

// A link that dodges the cursor until it runs out of stamina, then gives up and
// lets itself be clicked. Keyboard users and reduced motion get a normal link.
const TrollButton = ({
  href,
  label = "Hire me",
  surrenderLabel = "Fine, hire me",
  giveUpAfter = 3500,
  fleeRadius = 56,
  range = 130,
  resetAfter = 1800,
  className = "",
}) => {
  const slot = useRef(null);
  const btn = useRef(null);
  const bar = useRef(null);
  const off = useRef({ x: 0, y: 0 });
  const move = useRef();
  const tire = useRef();
  const [state, setState] = useState("fleeing");
  const evasive = state === "fleeing" && !reduced();

  const goTo = (x, y, lean = 0) => {
    off.current = { x, y };
    move.current?.pause();
    move.current = animate(btn.current, {
      translateX: x,
      translateY: y,
      rotate: lean,
      duration: 650,
      ease: "outElastic(1, .7)",
    });
  };

  const startTiring = () => {
    if (tire.current) return;
    tire.current = animate(bar.current, {
      scaleX: [1, 0],
      opacity: [1, 1],
      duration: giveUpAfter,
      ease: "linear",
      onComplete: () => {
        goTo(0, 0, 0);
        setState("tired");
      },
    });
  };

  const dodge = (px, py, force = false) => {
    const r = slot.current.getBoundingClientRect();
    const { x: ox, y: oy } = off.current;
    const cx = r.left + r.width / 2 + ox;
    const cy = r.top + r.height / 2 + oy;
    const dx = cx - px;
    const dy = cy - py;
    const gap = Math.hypot(Math.max(Math.abs(dx) - r.width / 2, 0), Math.max(Math.abs(dy) - r.height / 2, 0));
    if (!force && gap >= fleeRadius) return;
    let ux = dx;
    let uy = dy;
    if (!ux && !uy) {
      // Pointer exactly on the centre: pick any direction to slip away.
      const a = Math.random() * Math.PI * 2;
      ux = Math.cos(a);
      uy = Math.sin(a);
    }
    const len = Math.hypot(ux, uy) || 1;
    const push = fleeRadius - gap + 24;
    let nx = ox + (ux / len) * push;
    let ny = oy + (uy / len) * push;
    if (Math.abs(nx) > range || Math.abs(ny) > range * 0.6) {
      nx = -Math.sign(ox || dx || 1) * range * 0.7;
      ny = -oy * 0.5;
    }
    goTo(nx, ny, Math.max(-10, Math.min(10, (nx - ox) * 0.15)));
    startTiring();
  };

  useEffect(() => {
    if (!evasive) return;
    const onMove = (e) => e.pointerType !== "touch" && dodge(e.clientX, e.clientY);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  });

  useEffect(
    () => () => {
      move.current?.pause();
      tire.current?.pause();
    },
    []
  );

  const onPointerDown = (e) => {
    if (evasive && e.pointerType === "touch") dodge(e.clientX, e.clientY, true);
  };

  const onClick = (e) => {
    // Mouse clicks bounce off while it is still fleeing. Keyboard (detail 0) always works.
    if (evasive && e.detail !== 0) {
      e.preventDefault();
      return;
    }
    if (state === "tired") {
      setTimeout(() => {
        tire.current = null;
        if (bar.current) bar.current.style.transform = "scaleX(1)";
        setState("fleeing");
      }, resetAfter);
    }
  };

  // Squash when it gives up
  useEffect(() => {
    if (state === "tired" && btn.current && !reduced()) {
      animate(btn.current, { scaleX: [1, 1.08, 0.97, 1], scaleY: [1, 0.9, 1.04, 1], duration: 600, ease: "outQuad" });
    }
  }, [state]);

  const current = state === "tired" ? surrenderLabel : label;

  return (
    <span ref={slot} className="relative inline-flex">
      <a
        ref={btn}
        href={href}
        target="_blank"
        rel="noreferrer"
        onPointerDown={onPointerDown}
        onClick={onClick}
        className={`btn-ghost relative overflow-hidden ${className}`}
      >
        <span className="inline-grid">
          {[label, surrenderLabel].map((t) => (
            <span
              key={t}
              aria-hidden={t !== current}
              className={`col-start-1 row-start-1 whitespace-nowrap ${t === current ? "" : "invisible"}`}
            >
              {t}
            </span>
          ))}
        </span>
        <span
          ref={bar}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-white/40"
          style={{ opacity: state === "fleeing" ? 1 : 0 }}
        />
      </a>
    </span>
  );
};

export default TrollButton;
