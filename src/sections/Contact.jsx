import { ArrowUpRight, GithubLogo, InstagramLogo, LinkedinLogo, EnvelopeSimple } from "@phosphor-icons/react";
import { profile } from "../constants";
import Reveal from "../components/Reveal";
import Magnetic from "../components/Magnetic";
import SplitHeading from "../components/SplitHeading";

const links = [
  { label: "GitHub", href: profile.github, Icon: GithubLogo },
  { label: "LinkedIn", href: profile.linkedin, Icon: LinkedinLogo },
  { label: "Instagram", href: profile.instagram, Icon: InstagramLogo },
];

const Contact = () => (
  <section id="contact" className="wrap section-pad">
    <Reveal>
      <div className="flex flex-col items-center p-8 text-center border md:p-16 rounded-2xl bg-s1/70 backdrop-blur-md border-white/10">
        <h2 className="heading-2 max-w-[680px] hero-gradient-text">
          Have a system that needs to be faster or safer?
        </h2>
        <p className="mt-6 max-w-[680px] body-3 text-neutral-400">
          Tell me what you are building. I reply to project and role messages from{" "}
          {profile.location} and work with teams in any time zone.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Magnetic>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn-primary">
              Message me on LinkedIn
              <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
            </a>
          </Magnetic>
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

    <ul className="flex flex-wrap justify-center gap-3 mt-8">
      {links.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="btn-ghost"
          >
            <Icon size={16} weight="bold" aria-hidden="true" />
            {label}
          </a>
        </li>
      ))}
    </ul>
  </section>
);

export default Contact;
