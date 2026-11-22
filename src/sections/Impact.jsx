import { useEffect, useRef, useState } from "react";
import { BarChart } from "@/components/charts/bar-chart";
import { Bar } from "@/components/charts/bar";
import { BarXAxis } from "@/components/charts/bar-x-axis";
import { Grid } from "@/components/charts/grid";
import { ChartTooltip } from "@/components/charts/tooltip";
import { RingChart } from "@/components/charts/ring-chart";
import { Ring } from "@/components/charts/ring";
import { RingCenter } from "@/components/charts/ring-center";
import { impact } from "../constants";
import Reveal from "../components/Reveal";
import SplitHeading from "../components/SplitHeading";

const data = [...impact].sort((a, b) => b.value - a.value);
const ring = [{ label: "API reliability", value: 95, maxValue: 100 }];

// Mounts its children the first time it scrolls into view so chart animations play on screen.
const WhenVisible = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      {on ? children : null}
    </div>
  );
};

const Impact = () => (
  <section id="impact" className="wrap section-pad">
    <Reveal>
      <p className="caption-1 text-neutral-400">Impact</p>
      <SplitHeading className="mt-2 heading-2 max-w-[680px]">
        The numbers behind the work
      </SplitHeading>
    </Reveal>

    <div className="grid gap-4 mt-12 lg:grid-cols-12">
      <Reveal className="lg:col-span-8">
        <div className="h-full p-6 card">
          <h3 className="title-3">Improvement by metric</h3>
          <p className="mt-2 caption-2 text-neutral-400">
            Percent change reported in each project. Hover a bar for detail.
          </p>
          <WhenVisible className="mt-6 min-h-[280px]">
            <BarChart data={data} xDataKey="name" aspectRatio="16 / 9">
              <Grid horizontal />
              <Bar
                dataKey="value"
                fill="var(--chart-line-primary)"
                lineCap="round"
                showValue
                valueLabelFormatter={(v) => `${v}%`}
              />
              <BarXAxis />
              <ChartTooltip />
            </BarChart>
          </WhenVisible>
        </div>
      </Reveal>

      <Reveal delay={120} className="lg:col-span-4">
        <div className="flex flex-col h-full p-6 card">
          <h3 className="title-3">API reliability</h3>
          <p className="mt-2 caption-2 text-neutral-400">
            Reached with GitHub Actions and Docker workflows in the API Test Automation Framework.
          </p>
          <WhenVisible className="flex items-center justify-center flex-1 mt-6 min-h-[240px]">
            <RingChart data={ring} size={220} strokeWidth={16}>
              <Ring index={0} />
              <RingCenter defaultLabel="Reliable" suffix="%" />
            </RingChart>
          </WhenVisible>
        </div>
      </Reveal>
    </div>
  </section>
);

export default Impact;
