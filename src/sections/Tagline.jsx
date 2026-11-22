import TaglineReveal from "../components/TaglineReveal";
import { tagline } from "../constants";

const Tagline = () => (
  <section aria-label="Approach" className="bg-warm mt-20 md:mt-24">
    <div className="wrap py-20 md:py-24">
      <TaglineReveal text={tagline} />
    </div>
  </section>
);

export default Tagline;
