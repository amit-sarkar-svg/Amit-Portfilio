import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { ArrowDown } from "@phosphor-icons/react";
import { profile, stats, toolStrip } from "../constants";
import PipelineVisual from "../components/PipelineVisual";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import GooButton from "../components/GooButton";
import Tilt from "../components/Tilt";
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
    <section id="top" ref={root} className="pt-28 md:pt-32">
      {/* Framed hero panel */}
      <div className="wrap">
        <div className="relative px-4 py-16 border rounded-3xl md:px-8 md:py-24 border-white/10 bg-s1/40">
          <p className="absolute font-mono left-6 top-6 caption-4 text-neutral-500">Portfolio 2026</p>
          <p className="absolute hidden font-mono right-6 top-6 caption-4 text-neutral-500 sm:block">
            {profile.location} / {profile.timezone}
          </p>

          <div className="flex flex-col items-center text-center">
            <div
              data-hero
              style={{ opacity: 0 }}
              className="eyebrow"
            >
              <span className="live-dot size-2 rounded-full bg-live" aria-hidden="true" />
              Open to remote work worldwide
            </div>

            <h1
              data-hero
              style={{ opacity: 0 }}
              className="mt-6 max-w-[680px] heading-1 hero-gradient-text"
            >
              Software engineer building fast, reliable backend systems
            </h1>

            <p data-hero style={{ opacity: 0 }} className="mt-6 max-w-[680px] body-3 text-neutral-400">
              I design multithreaded services, secure APIs, and automated test pipelines. Every
              project below ships with numbers you can check.
            </p>

            <div data-hero style={{ opacity: 0 }} className="mt-10">
              <GooButton href="#work">
                See my projects
                <ArrowDown size={16} weight="bold" aria-hidden="true" />
              </GooButton>
            </div>
          </div>
        </div>

        <div data-hero style={{ opacity: 0 }} className="w-full mx-auto mt-8 max-w-3xl">
          <Tilt>
            <PipelineVisual />
          </Tilt>
        </div>
      </div>

      {/* Proof strip */}
      <div className="wrap mt-16">
        <Reveal as="ul" className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <li key={s.label}>
              <Tilt max={9}>
                <div className="p-6 card card-hover">
                  <p className="heading-2">
                    <CountUp to={s.to} suffix={s.suffix} />
                  </p>
                  <p className="mt-2 caption-1 text-neutral-300">{s.label}</p>
                  <p className="mt-2 caption-5 text-neutral-500">{s.source}</p>
                </div>
              </Tilt>
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
