import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { reduced } from "../hooks/motion";

const stages = ["Capture", "Balance", "Parse", "Filter"];
const lanes = ["Worker 1", "Worker 2", "Worker 3"];

// An illustration of the pipeline inside the Deep Packet Inspection Engine.
// anime.js drives the packets along each worker lane and pulses the stages in order.
const PipelineVisual = () => {
  const root = useRef(null);

  useEffect(() => {
    if (reduced() || !root.current) return;
    const packets = root.current.querySelectorAll("[data-packet]");
    const chips = root.current.querySelectorAll("[data-stage]");
    const a = animate(packets, {
      translateX: ["-100%", "400%"],
      duration: (_, i) => 2800 + i * 700,
      delay: stagger(450),
      ease: "inOutSine",
      loop: true,
    });
    const b = animate(chips, {
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.05, 1],
      duration: 1800,
      delay: stagger(450),
      ease: "inOutSine",
      loop: true,
    });
    return () => {
      a.revert();
      b.revert();
    };
  }, []);

  return (
    <div ref={root} className="card p-6 text-left">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono caption-4 text-neutral-400">dpi engine / pipeline</p>
        <p className="flex items-center gap-2 font-mono caption-4 text-neutral-400">
          <span className="live-dot size-2 rounded-full bg-live" aria-hidden="true" />
          running
        </p>
      </div>

      <ol className="grid grid-cols-2 gap-3 mt-6 sm:grid-cols-4">
        {stages.map((s, i) => (
          <li
            key={s}
            data-stage
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-s3 border border-white/10"
          >
            <span className="font-mono caption-4 text-neutral-400">0{i + 1}</span>
            <span className="body-5">{s}</span>
          </li>
        ))}
      </ol>

      <div className="grid gap-4 mt-6">
        {lanes.map((label) => (
          <div
            key={label}
            className="grid items-center grid-cols-[4rem_1fr] gap-4 sm:grid-cols-[6rem_1fr]"
          >
            <p className="font-mono caption-4 text-neutral-400">{label}</p>
            <div className="relative h-2 overflow-hidden rounded-full bg-s3" aria-hidden="true">
              <span
                data-packet
                className="absolute inset-y-0 left-0 w-1/5 rounded-full bg-white"
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 caption-5 text-neutral-400">
        Illustration of the pipeline in my Deep Packet Inspection Engine: a load balancer spreads
        traffic across worker threads.
      </p>
    </div>
  );
};

export default PipelineVisual;
