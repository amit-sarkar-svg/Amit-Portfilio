import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { navLinks, profile } from "../constants";
import { reduced } from "../hooks/motion";
import Scramble from "../components/Scramble";

const ids = [...navLinks.map((l) => l.href.slice(1)), "contact"];
const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const group = useRef(null);
  const pill = useRef(null);
  const anim = useRef();
  const placed = useRef(false);

  // Section currently in view
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id === "contact" ? "" : e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Slide the highlight to a link, stretching as it travels so it feels gooey.
  const moveTo = (link) => {
    const el = pill.current;
    if (!el) return;
    if (!link) {
      anim.current?.pause();
      anim.current = animate(el, { opacity: 0, duration: 250, ease: "outQuad" });
      return;
    }
    // Measure against the list, not the link's own wrapper
    const base = group.current.getBoundingClientRect();
    const box = link.getBoundingClientRect();
    const left = box.left - base.left;
    const width = box.width;
    if (reduced() || !placed.current) {
      el.style.transform = `translateX(${left}px)`;
      el.style.width = `${width}px`;
      el.style.opacity = 1;
      placed.current = true;
      return;
    }
    anim.current?.pause();
    anim.current = animate(el, {
      translateX: left,
      width,
      opacity: 1,
      scaleY: [1.12, 1],
      duration: 700,
      ease: "outElastic(1, .65)",
    });
  };

  const restToActive = () => {
    const link = group.current?.querySelector(`[data-id="${active}"]`);
    moveTo(link || null);
  };

  useEffect(restToActive, [active]);

  // Keep the highlight aligned if the window is resized
  useEffect(() => {
    const onResize = () => {
      placed.current = false;
      restToActive();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const openPalette = () => window.dispatchEvent(new Event("open-palette"));

  return (
    <>
      <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 pointer-events-none">
        <nav aria-label="Primary" className="pointer-events-auto flex items-center gap-2 max-md:w-full max-md:justify-between">
          {/* Brand + search pill */}
          <div className="flex items-center gap-2 p-2 border rounded-2xl border-white/10 bg-s1/70 backdrop-blur-md">
            <a
              href="#top"
              className="px-3 py-2 rounded-lg body-4 focus-visible:outline-2 focus-visible:outline-white"
            >
              <Scramble>{profile.name}</Scramble>
            </a>
            <button
              type="button"
              onClick={openPalette}
              aria-label="Open quick navigation"
              className="items-center hidden gap-2 px-2 py-1 transition duration-300 rounded-lg cursor-pointer lg:flex bg-s2 text-neutral-400 ease-base hover:text-white hover:bg-s3"
            >
              <MagnifyingGlass size={16} aria-hidden="true" />
              <span className="keycap">{isMac ? "⌘" : "Ctrl"}</span>
              <span className="keycap">K</span>
            </button>
          </div>

          {/* Links with a sliding highlight */}
          <div className="hidden p-2 border md:block rounded-2xl border-white/10 bg-s1/70 backdrop-blur-md">
            <ul ref={group} className="relative flex" onPointerLeave={restToActive}>
              <span
                ref={pill}
                aria-hidden="true"
                className="absolute left-0 top-0 h-full rounded-lg bg-s4 border border-white/10"
                style={{ width: 0, opacity: 0 }}
              />
              {navLinks.map((l) => {
                const id = l.href.slice(1);
                const on = active === id;
                return (
                  <li key={l.href} className="relative">
                    <a
                      href={l.href}
                      data-id={id}
                      aria-current={on ? "true" : undefined}
                      onPointerEnter={(e) => moveTo(e.currentTarget)}
                      onFocus={(e) => moveTo(e.currentTarget)}
                      className={`block px-3 py-2 rounded-lg title-4 transition-colors duration-300 ease-base focus-visible:outline-2 focus-visible:outline-white ${
                        on ? "text-white" : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="hidden p-2 border md:block rounded-2xl border-white/10 bg-s1/70 backdrop-blur-md">
            <a
              href="#contact"
              className="inline-flex px-3 py-2 text-black bg-white rounded-lg button-sm transition duration-300 ease-base hover:bg-[#d9d9d9] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get in touch
            </a>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="relative z-[60] md:hidden size-12 rounded-2xl border border-white/10 bg-s1/70 backdrop-blur-md cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            <span
              className={`absolute left-3 right-3 top-1/2 h-0.5 bg-white rounded-full transition duration-500 ease-base ${
                open ? "rotate-45" : "-translate-y-1"
              }`}
            />
            <span
              className={`absolute left-3 right-3 top-1/2 h-0.5 bg-white rounded-full transition duration-500 ease-base ${
                open ? "-rotate-45" : "translate-y-1"
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile panel: full height, high opacity base surface with strong blur */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-0 z-40 md:hidden bg-canvas/95 backdrop-blur-2xl transition-opacity duration-500 ease-base ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col justify-center h-full gap-4 px-6">
          {[...navLinks, { label: "Contact", href: "#contact" }].map((l, i) => (
            <li
              key={l.href}
              style={{ transitionDelay: open ? `${Math.min(i * 60, 400)}ms` : "0ms" }}
              className={`transition duration-500 ease-base ${
                open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2 heading-3 focus-visible:outline-2 focus-visible:outline-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
