import { process } from "../constants";
import Reveal from "../components/Reveal";
import Eyebrow from "../components/Eyebrow";
import SplitHeading from "../components/SplitHeading";

const Process = () => (
  <section id="process" className="wrap section-pad">
    <Reveal>
      <Eyebrow>How I work</Eyebrow>
      <SplitHeading className="mt-2 heading-2 max-w-[680px]">Three habits <span className="text-neutral-500">behind every release</span></SplitHeading>
    </Reveal>

    <ol className="grid gap-4 mt-12 md:grid-cols-3">
      {process.map((s, i) => (
        <Reveal key={s.step} as="li" delay={i * 100}>
          <div className="h-full p-6 card card-hover">
            <p className="font-mono caption-4 text-neutral-400">{s.step}</p>
            <h3 className="mt-6 heading-6">{s.title}</h3>
            <p className="mt-2 body-3 text-neutral-400">{s.body}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  </section>
);

export default Process;
