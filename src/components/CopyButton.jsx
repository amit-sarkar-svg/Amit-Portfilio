import { useRef, useState } from "react";
import { animate } from "animejs";
import { Check, Copy } from "@phosphor-icons/react";
import { reduced } from "../hooks/motion";

// Copies a value to the clipboard. A chip pops up above the button to confirm.
// Width never changes between states, and the result is announced to screen readers.
const CopyButton = ({ value, label = "Copy link", doneLabel = "Copied", className = "" }) => {
  const [state, setState] = useState("idle");
  const chip = useRef(null);
  const timer = useRef();

  const copy = async () => {
    let ok = true;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const t = document.createElement("textarea");
      t.value = value;
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      ok = document.execCommand("copy");
      t.remove();
    }
    setState(ok ? "done" : "error");
    if (chip.current && !reduced()) {
      animate(chip.current, {
        opacity: [0, 1],
        translateY: [8, -8],
        scale: [0.9, 1],
        duration: 500,
        ease: "outBack",
      });
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (chip.current && !reduced()) {
        animate(chip.current, { opacity: 0, translateY: -16, duration: 300, ease: "outQuad" });
      }
      setState("idle");
    }, 1600);
  };

  const text = { idle: label, done: doneLabel, error: "Copy failed" };

  return (
    <span className="relative inline-flex">
      <button type="button" onClick={copy} className={`btn-ghost ${className}`}>
        {state === "done" ? (
          <Check size={16} weight="bold" aria-hidden="true" />
        ) : (
          <Copy size={16} weight="bold" aria-hidden="true" />
        )}
        <span className="inline-grid">
          {Object.entries(text).map(([k, v]) => (
            <span
              key={k}
              aria-hidden={k !== state}
              className={`col-start-1 row-start-1 whitespace-nowrap ${k === state ? "" : "invisible"}`}
            >
              {v}
            </span>
          ))}
        </span>
      </button>
      <span
        ref={chip}
        aria-hidden="true"
        className="absolute left-1/2 -top-8 -translate-x-1/2 px-3 py-1 rounded-lg bg-white text-black caption-3 pointer-events-none whitespace-nowrap"
        style={{ opacity: 0 }}
      >
        Link on your clipboard
      </span>
      <span role="status" className="sr-only">
        {state === "done" ? doneLabel : state === "error" ? "Copy failed" : ""}
      </span>
    </span>
  );
};

export default CopyButton;
