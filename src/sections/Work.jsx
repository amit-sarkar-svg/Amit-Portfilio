import { useEffect, useRef } from "react";
import { ArrowUpRight, CheckCircle } from "@phosphor-icons/react";
import { projects } from "../constants";
import Reveal from "../components/Reveal";
import Eyebrow from "../components/Eyebrow";
import SplitHeading from "../components/SplitHeading";
import useStaggerIn from "../hooks/useStaggerIn";
import { reduced } from "../hooks/motion";

const Work = () => {
  const list = useStaggerIn("li[data-point]", { from: 16, step: 60 });
  const cards = useRef([]);
  const inner = useRef([]);
  const shade = useRef([]);

  // Stack deck: as the next project slides over a card, the card shrinks and dims.
  useEffect(() => {
    if (reduced()) return;
    const mq = window.matchMedia("(min-width: 768px)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const on = mq.matches;
      cards.current.forEach((el, i) => {
        const next = cards.current[i + 1];
        let p = 0;
        if (on && next && el) {
          const h = el.offsetHeight;
          const top = 96 + i * 24;
          p = Math.min(Math.max(1 - (next.getBoundingClientRect().top - top) / h, 0), 1);
        }
        if (inner.current[i]) inner.current[i].style.transform = `scale(${1 - 0.05 * p})`;
        if (shade.current[i]) shade.current[i].style.opacity = p * 0.55;
      });
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
  }, []);

  return (
    <section id="work" ref={list} className="wrap section-pad">
      <Reveal>
        <Eyebrow>Selected work</Eyebrow>
        <SplitHeading className="mt-4 heading-2 max-w-[680px]">
          Three projects, <span className="text-neutral-500">measured by what changed</span>
        </SplitHeading>
      </Reveal>

      <div className="grid gap-6 mt-12">
        {projects.map((p, i) => (
          <article
            key={p.index}
            ref={(el) => (cards.current[i] = el)}
            className="md:sticky"
            style={{ top: 96 + i * 24 }}
          >
            <Reveal>
              <div
                ref={(el) => (inner.current[i] = el)}
                className="relative origin-top"
                style={{ willChange: "transform" }}
              >
                <div className="grid gap-8 p-6 md:p-8 md:grid-cols-12 card card-hover bg-s1">
                  <div className="md:col-span-5">
                    <p className="font-mono caption-4 text-neutral-400">
                      {p.index} / {p.date}
                    </p>
                    <h3 className="mt-4 heading-4">{p.title}</h3>
                    <p className="mt-2 caption-1 text-neutral-400">{p.kind}</p>
                    <p className="mt-4 body-3 text-neutral-300">{p.summary}</p>

                    <ul className="flex flex-wrap gap-2 mt-6">
                      {p.tags.map((t) => (
                        <li
                          key={t}
                          className="px-3 py-1 border rounded-lg caption-4 bg-s3 border-white/10"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>

                    {p.href && (
                      <a href={p.href} target="_blank" rel="noreferrer" className="mt-6 btn-ghost">
                        View on GitHub
                        <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
                      </a>
                    )}
                  </div>

                  <ul className="grid gap-4 md:col-span-7 content-start">
                    {p.points.map((pt) => (
                      <li key={pt} data-point className="flex gap-3">
                        <CheckCircle
                          size={20}
                          weight="fill"
                          className="mt-1 shrink-0 text-live"
                          aria-hidden="true"
                        />
                        <span className="body-3 text-neutral-300">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <span
                  ref={(el) => (shade.current[i] = el)}
                  aria-hidden="true"
                  className="absolute inset-0 bg-canvas rounded-2xl pointer-events-none"
                  style={{ opacity: 0 }}
                />
              </div>
            </Reveal>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Work;
