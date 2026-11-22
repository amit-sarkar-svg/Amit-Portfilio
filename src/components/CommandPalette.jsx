import { useEffect, useMemo, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { ArrowBendDownLeft, GithubLogo, LinkedinLogo, MagnifyingGlass, Hash } from "@phosphor-icons/react";
import { navLinks, profile } from "../constants";
import { reduced } from "../hooks/motion";

const sections = [...navLinks, { label: "Contact", href: "#contact" }].map((l) => ({
  label: `Go to ${l.label}`,
  hint: l.href,
  Icon: Hash,
  run: () => (window.location.hash = l.href),
}));
const links = [
  { label: "Open GitHub", hint: "github.com", Icon: GithubLogo, run: () => window.open(profile.github, "_blank", "noreferrer") },
  { label: "Open LinkedIn", hint: "linkedin.com", Icon: LinkedinLogo, run: () => window.open(profile.linkedin, "_blank", "noreferrer") },
];
const ALL = [...sections, ...links];

// Press Ctrl or Cmd plus K from anywhere. Also opens from the search pill in the nav.
const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const panel = useRef(null);
  const list = useRef(null);
  const input = useRef(null);
  const prevFocus = useRef(null);

  const items = useMemo(
    () => ALL.filter((i) => i.label.toLowerCase().includes(q.trim().toLowerCase())),
    [q]
  );

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    prevFocus.current = document.activeElement;
    setQ("");
    setIdx(0);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => input.current?.focus());
    if (!reduced()) {
      animate(panel.current, { opacity: [0, 1], scale: [0.96, 1], translateY: [-12, 0], duration: 450, ease: "outExpo" });
      animate(list.current.children, { opacity: [0, 1], translateY: [8, 0], delay: stagger(30, { start: 120 }), duration: 450, ease: "outExpo" });
    }
    return () => {
      document.body.style.overflow = "";
      prevFocus.current?.focus?.();
    };
  }, [open]);

  const run = (item) => {
    setOpen(false);
    item?.run();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, items.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter") { e.preventDefault(); run(items[idx]); }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-24" role="presentation">
      <button
        type="button"
        aria-label="Close search"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-canvas/80 cursor-default"
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Quick navigation"
        className="relative w-full max-w-xl overflow-hidden border rounded-2xl bg-s1 border-white/10"
      >
        <div className="flex items-center gap-3 px-4 border-b border-white/10">
          <MagnifyingGlass size={20} className="text-neutral-400" aria-hidden="true" />
          <input
            ref={input}
            value={q}
            onChange={(e) => { setQ(e.target.value); setIdx(0); }}
            onKeyDown={onKeyDown}
            placeholder="Jump to a section or open a link"
            aria-label="Search"
            className="w-full py-4 bg-transparent outline-none body-3 placeholder:text-neutral-500"
          />
          <span className="keycap">Esc</span>
        </div>
        <ul ref={list} className="p-2 max-h-80 overflow-auto">
          {items.length === 0 && <li className="px-3 py-4 body-6 text-neutral-400">Nothing matches that search.</li>}
          {items.map((it, i) => (
            <li key={it.label}>
              <button
                type="button"
                onMouseEnter={() => setIdx(i)}
                onClick={() => run(it)}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left transition duration-200 ease-base ${
                  i === idx ? "bg-s3 text-white" : "text-neutral-300"
                }`}
              >
                <it.Icon size={20} aria-hidden="true" />
                <span className="flex-1 body-5">{it.label}</span>
                <span className="font-mono caption-4 text-neutral-500">{it.hint}</span>
                {i === idx && <ArrowBendDownLeft size={16} aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommandPalette;
