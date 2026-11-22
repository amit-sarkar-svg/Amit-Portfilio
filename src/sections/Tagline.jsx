import OutlineMarquee from "../components/OutlineMarquee";

// The tagline itself now lives in the pinned hero stage; this keeps the outlined strip.
const Tagline = () => (
  <section aria-label="Approach" className="mt-20 md:mt-24">
    <OutlineMarquee />
  </section>
);

export default Tagline;
