import { useEffect, useState } from "react";
import { navLinks, profile } from "../constants";

const ids = navLinks.map((l) => l.href.slice(1));

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  // Mark the section currently in view.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Lock scroll and allow Escape while the mobile panel is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const linkBase =
    "px-3 py-2 rounded-lg title-4 transition duration-300 ease-base focus-visible:outline-2 focus-visible:outline-white";

  return (
    <>
      <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 pointer-events-none">
        <nav
          aria-label="Primary"
          className="pointer-events-auto flex items-center justify-between gap-6 p-2 border rounded-2xl border-white/10 bg-s1/70 backdrop-blur-md max-md:w-full"
        >
          <a
            href="#top"
            className="px-3 py-2 rounded-lg body-4 focus-visible:outline-2 focus-visible:outline-white"
          >
            {profile.name}
          </a>

          <ul className="hidden gap-1 md:flex">
            {navLinks.map((l) => {
              const on = active === l.href.slice(1);
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    aria-current={on ? "true" : undefined}
                    className={`${linkBase} block ${
                      on ? "bg-s3 text-white" : "text-neutral-400 hover:text-white hover:bg-s2"
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <a
            href="#contact"
            className="hidden md:inline-flex px-3 py-2 rounded-lg bg-white text-black button-sm transition duration-300 ease-base hover:bg-[#d9d9d9] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Get in touch
          </a>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="relative z-[60] md:hidden size-10 rounded-lg bg-s2 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
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
        className={`fixed inset-0 z-40 md:hidden bg-base/95 backdrop-blur-2xl transition-opacity duration-500 ease-base ${
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
