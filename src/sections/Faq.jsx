import { Plus } from "@phosphor-icons/react";
import { faqs } from "../constants";
import Reveal from "../components/Reveal";
import Eyebrow from "../components/Eyebrow";
import SplitHeading from "../components/SplitHeading";

const Faq = () => (
  <section id="faq" className="wrap section-pad">
    <div className="grid gap-12 md:grid-cols-12">
      <Reveal className="md:col-span-5">
        <Eyebrow>FAQ</Eyebrow>
        <SplitHeading className="mt-2 heading-3">Questions people ask <span className="text-neutral-500">before we talk</span></SplitHeading>
      </Reveal>

      <div className="grid gap-2 md:col-span-7 content-start">
        {faqs.map((f, i) => (
          <Reveal key={f.q} delay={i * 60}>
            <details className="group card transition duration-500 ease-base open:bg-s2">
              <summary className="flex items-center justify-between gap-4 p-4 list-none cursor-pointer rounded-2xl title-3 focus-visible:outline-2 focus-visible:outline-white [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-3">
                  <span className="font-mono caption-4 text-neutral-500">0{i + 1}</span>
                  {f.q}
                </span>
                <Plus
                  size={20}
                  weight="bold"
                  aria-hidden="true"
                  className="shrink-0 transition duration-500 ease-base group-open:rotate-45"
                />
              </summary>
              <p className="px-4 pb-4 body-3 text-neutral-400 pl-12">{f.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Faq;
