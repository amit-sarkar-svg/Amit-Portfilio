import { Timeline } from "../components/Timeline";
import { experiences } from "../constants";
import ScrollAnimation from "../components/ScrollAnimation";
const Experiences = () => {
  return (
    <section className="c-space section-spacing" id="projects">
      <ScrollAnimation direction="up" delay={0.2}>
        <h2 className="text-heading">Projects</h2>
      </ScrollAnimation>
      <ScrollAnimation direction="up" delay={0.4}>
        <div className="w-full mt-12">
          <Timeline data={experiences} />
        </div>
      </ScrollAnimation>
    </section>
  );
};

export default Experiences;
