import { skillGroups } from "../constants";
import Reveal from "../components/Reveal";
import useStaggerIn from "../hooks/useStaggerIn";
import SplitHeading from "../components/SplitHeading";

const Skills = () => {
  const list = useStaggerIn("li[data-chip]", { from: 12, step: 35 });
  return (
  <section id="skills" ref={list} className="wrap section-pad">
    <Reveal>
      <p className="caption-1 text-neutral-400">Skills</p>
      <SplitHeading className="mt-2 heading-2 max-w-[680px]">The tools I reach for first</SplitHeading>
    </Reveal>

    <div className="grid gap-4 mt-12 md:grid-cols-2 lg:grid-cols-3">
      {skillGroups.map((g, i) => (
        <Reveal key={g.group} delay={i * 80}>
          <div className="h-full p-6 card card-hover">
            <h3 className="title-3">{g.group}</h3>
            <ul className="flex flex-wrap gap-2 mt-6">
              {g.items.map((s) => (
                <li
                  key={s}
                  data-chip
                  className="px-3 py-1 border rounded-lg caption-4 bg-s3 border-white/10"
                >
                  {s}
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

export default Skills;
