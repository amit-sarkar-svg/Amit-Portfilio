import { Plus } from "@phosphor-icons/react";
import { faqs } from "../constants";
import Reveal from "../components/Reveal";

const Faq = () => (
  <section id="faq" className="wrap section-pad">
    <div className="grid gap-12 md:grid-cols-12">
      <Reveal className="md:col-span-5">
        <p className="caption-1 text-neutral-400">FAQ</p>
        <h2 className="mt-2 heading-3">Questions people ask before we talk</h2>
      </Reveal>

      <div className="grid gap-2 md:col-span-7 content-start">
        {faqs.map((f, i) => (
          <Reveal key={f.q} delay={i * 60}>
            <details className="group card transition duration-500 ease-base open:bg-s2">
              <summary className="flex items-center justify-between gap-4 p-4 list-none cursor-pointer rounded-2xl title-3 focus-visible:outline-2 focus-visible:outline-white [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus
                  size={20}
                  weight="bold"
                  aria-hidden="true"
                  className="shrink-0 transition duration-500 ease-base group-open:rotate-45"
                />
              </summary>
              <p className="px-4 pb-4 body-3 text-neutral-400">{f.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Faq;
