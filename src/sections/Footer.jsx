import { ArrowUp } from "@phosphor-icons/react";
import { profile } from "../constants";

const Footer = () => (
  <footer className="border-t border-white/10">
    <div className="wrap flex flex-wrap items-center justify-between gap-4 py-8">
      <p className="caption-2 text-neutral-400">
        © 2026 {profile.name}. Built in {profile.location}.
      </p>
      <a
        href="#top"
        className="flex items-center gap-2 px-3 py-2 rounded-lg caption-1 text-neutral-400 transition duration-300 ease-base hover:text-white hover:bg-s2 focus-visible:outline-2 focus-visible:outline-white"
      >
        Back to top
        <ArrowUp size={16} weight="bold" aria-hidden="true" />
      </a>
    </div>
  </footer>
);

export default Footer;
