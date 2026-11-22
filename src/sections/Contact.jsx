import { ArrowUpRight, GithubLogo, InstagramLogo, LinkedinLogo, EnvelopeSimple } from "@phosphor-icons/react";
import { profile } from "../constants";
import Reveal from "../components/Reveal";
import Eyebrow from "../components/Eyebrow";
import GooButton from "../components/GooButton";
import CopyButton from "../components/CopyButton";
import TrollButton from "../components/TrollButton";

const links = [
  { label: "GitHub", href: profile.github, Icon: GithubLogo },
  { label: "LinkedIn", href: profile.linkedin, Icon: LinkedinLogo },
  { label: "Instagram", href: profile.instagram, Icon: InstagramLogo },
];

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

const Contact = () => (
  <section id="contact" className="wrap section-pad">
    <Reveal>
      <div className="flex flex-col items-center p-8 text-center border md:p-16 rounded-3xl bg-s1/85 border-white/10">
        <Eyebrow>Let us talk</Eyebrow>
        <h2 className="mt-6 heading-2 max-w-[680px] hero-gradient-text">
          Have a system that needs to be faster or safer?
        </h2>
        <p className="mt-6 max-w-[680px] body-3 text-neutral-400">
          Tell me what you are building. I reply to project and role messages from{" "}
          {profile.location} and work with teams in any time zone.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <GooButton href={profile.linkedin} target="_blank" rel="noreferrer">
            Message me on LinkedIn
            <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
          </GooButton>
          <CopyButton value={profile.linkedin} label="Copy profile link" />
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="btn-ghost">
              <EnvelopeSimple size={16} weight="bold" aria-hidden="true" />
              Email me
            </a>
          )}
        </div>

        <p className="mt-6 caption-2 text-neutral-400">
          No commitment. Free to start a conversation.
        </p>
      </div>
    </Reveal>

    <Reveal delay={100}>
      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <div className="flex flex-col items-start justify-between gap-6 p-6 card">
          <div>
            <h3 className="title-3">A button with a mind of its own</h3>
            <p className="mt-2 body-6 text-neutral-400">
              It dodges your cursor for a few seconds, then gives up. Keyboard users and reduced
              motion get a normal link.
            </p>
          </div>
          <TrollButton href={profile.linkedin} />
        </div>

        <div className="flex flex-col items-start justify-between gap-6 p-6 card">
          <div>
            <h3 className="title-3">Jump anywhere</h3>
            <p className="mt-2 body-6 text-neutral-400">
              Press the shortcut from any part of the page to open quick navigation.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-palette"))}
            className="btn-ghost"
          >
            Quick navigation
            <span className="keycap">{isMac ? "⌘" : "Ctrl"}</span>
            <span className="keycap">K</span>
          </button>
        </div>
      </div>
    </Reveal>

    <ul className="flex flex-wrap justify-center gap-3 mt-8">
      {links.map(({ label, href, Icon }) => (
        <li key={label}>
          <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="btn-ghost">
            <Icon size={16} weight="bold" aria-hidden="true" />
            {label}
          </a>
        </li>
      ))}
    </ul>
  </section>
);

export default Contact;
