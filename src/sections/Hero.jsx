import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { ArrowDown } from "@phosphor-icons/react";
import { profile, stats, toolStrip } from "../constants";
import PipelineVisual from "../components/PipelineVisual";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import Magnetic from "../components/Magnetic";
import { reduced } from "../hooks/motion";

const Hero = () => {
  const root = useRef(null);

  // Opening sequence: each hero element rises in turn.
  useEffect(() => {
    const items = root.current?.querySelectorAll("[data-hero]");
    if (!items?.length) return;
    if (reduced()) {
      items.forEach((i) => (i.style.opacity = 1));
      return;
    }
    const anim = animate(items, {
      opacity: [0, 1],
      translateY: [32, 0],
      delay: stagger(110, { start: 150 }),
      duration: 1100,
      ease: "outExpo",
    });
    return () => anim.revert();
  }, []);

  return (
    <section id="top" ref={root} className="pt-32 md:pt-40">
      <div className="wrap flex flex-col items-center text-center">
        <div
          data-hero
          style={{ opacity: 0 }}
          className="flex items-center gap-2 px-3 py-2 border rounded-full bg-s1/70 backdrop-blur-md border-white/10"
        >
          <span className="live-dot size-2 rounded-full bg-live" aria-hidden="true" />
          <span className="caption-1 text-neutral-400">
            {profile.location}, open to remote work worldwide
          </span>
        </div>

        <h1
          data-hero
          style={{ opacity: 0 }}
          className="mt-6 max-w-[680px] heading-1 hero-gradient-text"
        >
          Software engineer building fast, reliable backend systems
        </h1>

        <p data-hero style={{ opacity: 0 }} className="mt-6 max-w-[680px] body-3 text-neutral-400">
          I design multithreaded services, secure APIs, and automated test pipelines. Every project
          below ships with numbers you can check.
        </p>

        <div data-hero style={{ opacity: 0 }} className="mt-8">
          <Magnetic>
            <a href="#work" className="btn-primary">
              See my projects
              <ArrowDown size={16} weight="bold" aria-hidden="true" />
            </a>
          </Magnetic>
        </div>

        <div data-hero style={{ opacity: 0 }} className="w-full mt-16 max-w-3xl">
          <PipelineVisual />
        </div>
      </div>

      {/* Proof strip */}
      <div className="wrap mt-16">
        <Reveal as="ul" className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <li key={s.label} className="p-6 card card-hover">
              <p className="heading-2">
                <CountUp to={s.to} suffix={s.suffix} />
              </p>
              <p className="mt-2 caption-1 text-neutral-300">{s.label}</p>
              <p className="mt-2 caption-5 text-neutral-500">{s.source}</p>
            </li>
          ))}
        </Reveal>
      </div>

      {/* Tool marquee */}
      <div className="mt-16 overflow-hidden fade-x border-y border-white/10" aria-label="Tools I work with">
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
};

export default Hero;
