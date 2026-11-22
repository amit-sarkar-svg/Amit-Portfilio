const stages = ["Capture", "Balance", "Parse", "Filter"];
const lanes = [
  { label: "Worker 1", delay: "0s", speed: "3.6s" },
  { label: "Worker 2", delay: "-1.2s", speed: "4.2s" },
  { label: "Worker 3", delay: "-2.4s", speed: "3.2s" },
];

// An illustration of the pipeline inside the Deep Packet Inspection Engine.
const PipelineVisual = () => (
  <div className="card p-6 text-left">
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
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-s3 border border-white/10"
        >
          <span className="font-mono caption-4 text-neutral-400">0{i + 1}</span>
          <span className="body-5">{s}</span>
        </li>
      ))}
    </ol>

    <div className="grid gap-4 mt-6">
      {lanes.map((lane) => (
        <div key={lane.label} className="grid items-center grid-cols-[4rem_1fr] gap-4 sm:grid-cols-[6rem_1fr]">
          <p className="font-mono caption-4 text-neutral-400">{lane.label}</p>
          <div className="relative h-2 overflow-hidden rounded-full bg-s3" aria-hidden="true">
            <span
              className="absolute inset-y-0 left-0 w-1/5 rounded-full bg-white animate-lane"
              style={{ animationDelay: lane.delay, animationDuration: lane.speed }}
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

export default PipelineVisual;
