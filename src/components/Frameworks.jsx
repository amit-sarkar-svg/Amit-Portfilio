import { OrbitingCircles } from "./OrbitingCircles";

export function Frameworks() {
  // Web development tech stack (logos must exist in /public/assets/logos)
  const technologies = [
    { label: "HTML", logo: "html5" },
    { label: "CSS", logo: "css3" },
    { label: "JavaScript", logo: "javascript" },
    { label: "React", logo: "react" },
    { label: "Tailwind CSS", logo: "tailwindcss" },
    { label: "Vite", logo: "vitejs" },
    { label: "Three.js", logo: "threejs" },
    { label: "Git", logo: "git" },
    { label: "GitHub", logo: "github" },
    { label: "Visual Code", logo: "visualstudiocode" },
    { label: "WordPress", logo: "wordpress" },
    { label: "Auth0", logo: "auth0" },
    { label: "Azure", logo: "azure" },
    { label: "SQL Server", logo: "microsoftsqlserver" },
    { label: "SQLite", logo: "sqlite" },
    { label: "Stripe", logo: "stripe" },
  ];

  // Split technologies into three groups to prevent overlap
  const outerTechnologies = technologies.slice(0, 7);
  const middleTechnologies = technologies.slice(7, 13);
  const innerTechnologies = technologies.slice(13);

  return (
    <div className="relative flex h-[24rem] w-full flex-col items-center justify-center">
      <OrbitingCircles iconSize={32} radius={200} duration={35}>
        {outerTechnologies.map((tech, index) => (
          <TechIcon key={`outer-${tech.label}-${index}`} tech={tech} />
        ))}
      </OrbitingCircles>
      <OrbitingCircles iconSize={26} radius={140} reverse speed={1.2} duration={28}>
        {middleTechnologies.map((tech, index) => (
          <TechIcon key={`middle-${tech.label}-${index}`} tech={tech} small />
        ))}
      </OrbitingCircles>
      <OrbitingCircles iconSize={22} radius={80} duration={22}>
        {innerTechnologies.map((tech, index) => (
          <TechIcon key={`inner-${tech.label}-${index}`} tech={tech} small />
        ))}
      </OrbitingCircles>
    </div>
  );
}

const TechIcon = ({ tech, small }) => {
  if (tech.logo) {
    return (
      <img
        src={`assets/logos/${tech.logo}.svg`}
        alt={tech.label}
        className={`rounded-sm duration-200 hover:scale-110 ${small ? "h-5 w-5" : "h-8 w-8"}`}
      />
    );
  }
  return (
    <span
      className={`whitespace-nowrap rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs text-white/80 backdrop-blur-sm ${small ? "scale-75" : "scale-90"}`}
    >
      {tech.label}
    </span>
  );
};
