import { ArrowUpRight, CheckCircle } from "@phosphor-icons/react";
import { projects } from "../constants";
import Reveal from "../components/Reveal";
import useStaggerIn from "../hooks/useStaggerIn";
import SplitHeading from "../components/SplitHeading";

const Work = () => {
  const list = useStaggerIn("li[data-point]", { from: 16, step: 60 });
  return (
  <section id="work" ref={list} className="wrap section-pad">
    <Reveal>
      <p className="caption-1 text-neutral-400">Selected work</p>
      <SplitHeading className="mt-2 heading-2 max-w-[680px]">Three projects, measured by what changed</SplitHeading>
    </Reveal>

    <div className="grid gap-6 mt-12">
      {projects.map((p) => (
        <Reveal key={p.index} as="article" className="">
          <div className="grid gap-8 p-6 md:p-8 md:grid-cols-12 card card-hover">
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
        </Reveal>
      ))}
    </div>
  </section>
  );
};

export default Work;
