import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { reduced } from "../hooks/motion";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const COLORS = ["#7a57db", "#33c2cc", "#ca2f8c", "#ffffff", "#57db96", "#d6995c"];
const SKIP = "a, button, input, textarea, summary, select, [role='dialog'], [role='button']";

// Hidden delights: sparks on every click, a console hello for developers,
// the Konami code, and typing the word "hire" for a confetti burst.
const Surprises = () => {
  const layer = useRef(null);
  const [toast, setToast] = useState("");
  const toastEl = useRef(null);
  const toastTimer = useRef();

  const say = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    requestAnimationFrame(() => {
      if (toastEl.current && !reduced()) {
        animate(toastEl.current, { opacity: [0, 1], translateY: [24, 0], scale: [0.95, 1], duration: 600, ease: "outBack" });
      }
    });
    toastTimer.current = setTimeout(() => {
      if (toastEl.current && !reduced()) {
        animate(toastEl.current, { opacity: 0, translateY: 12, duration: 400, ease: "outQuad", onComplete: () => setToast("") });
      } else setToast("");
    }, 3600);
  };

  const confetti = () => {
    const host = layer.current;
    if (!host || reduced()) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < 90; i++) {
      const p = document.createElement("span");
      const s = 6 + Math.random() * 8;
      p.style.cssText = `position:absolute;left:${w / 2}px;top:${h * 0.85}px;width:${s}px;height:${s * 0.5}px;background:${COLORS[i % COLORS.length]};border-radius:1px;will-change:transform,opacity`;
      host.appendChild(p);
      const dx = (Math.random() - 0.5) * w * 0.9;
      const peak = -(h * (0.35 + Math.random() * 0.5));
      animate(p, {
        translateX: dx,
        translateY: [{ to: peak, duration: 700, ease: "outQuad" }, { to: h * 0.2, duration: 1300, ease: "inQuad" }],
        rotate: (Math.random() - 0.5) * 900,
        opacity: [1, 1, 0],
        duration: 2000,
        onComplete: () => p.remove(),
      });
    }
  };

  const sparks = (x, y) => {
    const host = layer.current;
    if (!host || reduced()) return;
    const ring = document.createElement("span");
    ring.style.cssText = `position:absolute;left:${x - 10}px;top:${y - 10}px;width:20px;height:20px;border:1px solid rgba(255,255,255,0.7);border-radius:9999px`;
    host.appendChild(ring);
    animate(ring, { scale: [0.3, 5], opacity: [0.9, 0], duration: 800, ease: "outExpo", onComplete: () => ring.remove() });
    for (let i = 0; i < 9; i++) {
      const dot = document.createElement("span");
      dot.style.cssText = `position:absolute;left:${x - 2}px;top:${y - 2}px;width:4px;height:4px;border-radius:9999px;background:${COLORS[i % COLORS.length]}`;
      host.appendChild(dot);
      const a = (i / 9) * Math.PI * 2 + Math.random() * 0.5;
      const d = 40 + Math.random() * 50;
      animate(dot, {
        translateX: Math.cos(a) * d,
        translateY: Math.sin(a) * d,
        opacity: [1, 0],
        scale: [1, 0.2],
        duration: 700 + Math.random() * 300,
        ease: "outExpo",
        onComplete: () => dot.remove(),
      });
    }
  };

  useEffect(() => {
    // For developers who open the console
    console.log(
      "%cHello, fellow engineer.%c\nThis portfolio runs on React, anime.js and three.js. Try the Konami code, or type the word hire.",
      "font-size:16px;font-weight:600;color:#7a57db",
      "font-size:12px;color:#9b9b9b"
    );

    let konami = 0;
    let typed = "";
    const onKey = (e) => {
      if (e.target.closest?.("input, textarea")) return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      konami = k === KONAMI[konami] ? konami + 1 : k === KONAMI[0] ? 1 : 0;
      if (konami === KONAMI.length) {
        konami = 0;
        confetti();
        say("Konami code accepted. Party mode on.");
      }
      if (e.key.length === 1) {
        typed = (typed + k).slice(-4);
        if (typed === "hire") {
          typed = "";
          confetti();
          say("Great idea. The LinkedIn button is waiting.");
        }
      }
    };
    const onDown = (e) => {
      if (e.button !== 0 || e.target.closest?.(SKIP)) return;
      sparks(e.clientX, e.clientY);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
      clearTimeout(toastTimer.current);
    };
  }, []);

  return (
    <>
      <div ref={layer} aria-hidden="true" className="fixed inset-0 z-[96] overflow-hidden pointer-events-none" />
      <div role="status" aria-live="polite" className="fixed inset-x-0 z-[97] flex justify-center bottom-8 pointer-events-none">
        {toast && (
          <p
            ref={toastEl}
            className="px-4 py-2 border rounded-2xl bg-s1 border-white/15 body-5"
            style={{ opacity: 0 }}
          >
            {toast}
          </p>
        )}
      </div>
    </>
  );
};

export default Surprises;
