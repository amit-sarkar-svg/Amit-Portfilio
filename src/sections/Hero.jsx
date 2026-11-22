import { ArrowDown, MapPin } from "@phosphor-icons/react";
import { profile, stats, toolStrip } from "../constants";
import PipelineVisual from "../components/PipelineVisual";
import Reveal from "../components/Reveal";

const Hero = () => (
  <section id="top" className="pt-32 md:pt-40 bg-base">
    <div className="wrap flex flex-col items-center text-center">
      <Reveal className="flex items-center gap-2 px-3 py-2 border rounded-full bg-s1 border-white/10">
        <MapPin size={16} weight="bold" aria-hidden="true" />
        <span className="caption-1 text-neutral-400">
          {profile.location}, open to remote work worldwide
        </span>
      </Reveal>

      <Reveal delay={80} as="h1" className="mt-6 max-w-[680px] heading-1 hero-gradient-text">
        Software engineer building fast, reliable backend systems
      </Reveal>

      <Reveal delay={160} as="p" className="mt-6 max-w-[680px] body-3 text-neutral-400">
        I design multithreaded services, secure APIs, and automated test pipelines. Every project
        below ships with numbers you can check.
      </Reveal>

      <Reveal delay={240} className="mt-8">
        <a href="#work" className="btn-primary">
          See my projects
          <ArrowDown size={16} weight="bold" aria-hidden="true" />
        </a>
      </Reveal>

      <Reveal delay={320} className="w-full mt-16 max-w-3xl">
        <PipelineVisual />
      </Reveal>
    </div>

    {/* Proof strip */}
    <div className="wrap mt-16">
      <Reveal as="ul" className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label} className="p-6 card">
            <p className="heading-2">{s.value}</p>
            <p className="mt-2 caption-1 text-neutral-300">{s.label}</p>
            <p className="mt-2 caption-5 text-neutral-500">{s.source}</p>
          </li>
        ))}
      </Reveal>
    </div>

    {/* Tool marquee */}
    <div className="mt-16 overflow-hidden border-y border-white/10" aria-label="Tools I work with">
      <div className="flex w-max animate-marquee py-6">
        {[...toolStrip, ...toolStrip].map((t, i) => (
          <span
            key={i}
            aria-hidden={i >= toolStrip.length}
            className="px-6 title-2 text-neutral-400 whitespace-nowrap"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default Hero;
