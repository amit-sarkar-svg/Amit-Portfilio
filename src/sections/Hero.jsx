import { Suspense, lazy, useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { ArrowDown } from "@phosphor-icons/react";
import { profile, stats, tagline, toolStrip } from "../constants";
import PipelineVisual from "../components/PipelineVisual";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import GooButton from "../components/GooButton";
import Tilt from "../components/Tilt";
import DragBadge from "../components/DragBadge";
import { reduced } from "../hooks/motion";

const HeroScene = lazy(() => import("../components/HeroScene"));

const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b);
const words = tagline.split(" ");

// The hero is a pinned full screen stage. The 3D core is completely visible on
// arrival; scrolling flies the camera into it, the headline lifts away and the
// tagline lights up word by word. Then the stage releases and the page continues.
const Hero = () => {
  const stage = useRef(null);
  const wrap = useRef(null);
  const text = useRef(null);
  const hint = useRef(null);
  const tag = useRef(null);
  const scene = useRef(null);
  const wordEls = useRef([]);
  const progress = useRef(0);
  const motion = !reduced();

  // Opening sequence
  useEffect(() => {
    const items = stage.current?.querySelectorAll("[data-hero]");
    if (!items?.length) return;
    if (!motion) {
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
  }, [motion]);

  // Bobbing scroll hint
  useEffect(() => {
    if (!motion || !hint.current) return;
    const a = animate(hint.current.querySelector("[data-dot]"), {
      translateY: [0, 10, 0],
      duration: 1800,
      ease: "inOutSine",
      loop: true,
    });
    return () => a.revert();
  }, [motion]);

  // Scroll drives everything on the stage.
  useEffect(() => {
    if (!motion) return;
    let frame = 0;
    let lastCount = -1;
    const update = () => {
      frame = 0;
      const el = wrap.current;
      if (!el) return;
      const runway = el.offsetHeight - window.innerHeight;
      const p = clamp(-el.getBoundingClientRect().top / runway);
      progress.current = p;

      // Headline lifts away
      const out = clamp(p / 0.3);
      if (text.current) {
        text.current.style.opacity = 1 - out;
        text.current.style.transform = `translateY(${-out * 70}px)`;
        text.current.style.pointerEvents = out > 0.6 ? "none" : "";
      }
      if (hint.current) hint.current.style.opacity = 1 - clamp(p / 0.08);
      // Calm the 3D layer while the tagline is being read
      if (scene.current) scene.current.style.opacity = 1 - 0.6 * clamp((p - 0.28) / 0.15);

      // Tagline fades in, words light up in order, then it fades out
      const inP = clamp((p - 0.3) / 0.12);
      const outP = clamp((p - 0.93) / 0.07);
      if (tag.current) {
        tag.current.style.opacity = inP * (1 - outP);
        tag.current.style.transform = `translateY(${(1 - inP) * 24}px)`;
      }
      const count = Math.round(clamp((p - 0.38) / 0.5) * words.length);
      if (count !== lastCount) {
        lastCount = count;
        wordEls.current.forEach((w, i) => w && w.classList.toggle("tag-word-on", i < count));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [motion]);

  return (
    <>
      <section id="top" ref={wrap} className={motion ? "relative h-[300svh]" : "relative"}>
        <div
          ref={stage}
          className={`${motion ? "sticky top-0 h-svh" : "min-h-svh"} overflow-hidden`}
        >
          <div ref={scene} className="absolute inset-0">
            <Suspense fallback={null}>
              <HeroScene progress={progress} />
            </Suspense>
          </div>

          <p className="absolute font-mono left-6 top-24 caption-4 text-neutral-500 max-md:hidden">
            Portfolio 2026
          </p>
          <p className="absolute hidden font-mono right-6 top-24 caption-4 text-neutral-500 sm:block">
            {profile.location} / {profile.timezone}
          </p>

          {/* Headline layer */}
          <div className="absolute inset-0 flex items-center pointer-events-none">
            <div ref={text} className="w-full wrap">
              <div className="flex flex-col items-center pt-16 text-center pointer-events-auto lg:items-start lg:text-left lg:max-w-[600px]">
                <div data-hero style={{ opacity: 0 }} className="eyebrow">
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

                <p
                  data-hero
                  style={{ opacity: 0 }}
                  className="mt-6 max-w-[680px] body-3 text-neutral-400"
                >
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
          </div>

          {/* Tagline layer: revealed by scroll */}
          {motion && (
            <div
              ref={tag}
              className="absolute inset-0 flex items-center justify-center pointer-events-none wrap"
              style={{ opacity: 0 }}
            >
              <p className="heading-2 max-w-[880px] text-center" aria-label={tagline}>
                {words.map((w, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    ref={(el) => (wordEls.current[i] = el)}
                    className="tag-word"
                  >
                    {w}
                    {i < words.length - 1 ? " " : ""}
                  </span>
                ))}
              </p>
            </div>
          )}

          <DragBadge container={stage} />

          {/* Scroll hint */}
          {motion && (
            <div
              ref={hint}
              aria-hidden="true"
              className="absolute inset-x-0 flex flex-col items-center gap-2 bottom-8"
            >
              <span className="caption-4 text-neutral-500">Scroll</span>
              <span className="relative block w-6 h-10 border rounded-full border-white/30">
                <span
                  data-dot
                  className="absolute w-1 h-2 -translate-x-1/2 bg-white rounded-full left-1/2 top-2"
                />
              </span>
            </div>
          )}
        </div>
      </section>

      {!motion && (
        <div className="py-16 wrap">
          <p className="heading-2 max-w-[880px]">{tagline}</p>
        </div>
      )}

      <div className="pt-8 wrap">
        <div className="w-full max-w-3xl mx-auto">
          <Reveal>
            <Tilt>
              <PipelineVisual />
            </Tilt>
          </Reveal>
        </div>
      </div>

      {/* Proof strip */}
      <div className="mt-16 wrap">
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
    </>
  );
};

export default Hero;
