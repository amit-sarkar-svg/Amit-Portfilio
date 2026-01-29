import { Canvas, useFrame } from "@react-three/fiber";
import HeroText from "../components/HeroText";
import { Particles } from "../components/Particles";
import ParallaxBackground from "../components/parallaxBackground";
import { Float } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { easing } from "maath";
import { Suspense, lazy } from "react";
import Loader from "../components/Loader";

// Lazy load heavy 3D components
const LazyAstronaut = lazy(() =>
  import("../components/Astronaut").then((m) => ({ default: m.Astronaut }))
);

const Hero = () => {
  const isMobile = useMediaQuery({ maxWidth: 853 });
  return (
    <section id="home" className="relative flex items-start justify-center min-h-screen overflow-hidden md:items-start md:justify-start c-space bg-gradient-to-br from-[#0B0F17] via-[#0A0E14] to-[#070B12]">
      <HeroText />
      <ParallaxBackground />
      <Particles
        className="absolute inset-0 -z-0"
        quantity={isMobile ? 15 : 30}
        ease={80}
        size={0.4}
        color="#E6F1FF"
        vx={0.01}
        vy={0.003}
      />
      <div
        className="absolute inset-0 -z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(600px 400px at 40% 35%, rgba(0,229,255,0.10), rgba(0,229,255,0) 60%)",
        }}
      />
      <div
        className="absolute inset-0 -z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(1200px 700px at 50% 40%, rgba(0,0,0,0), rgba(0,0,0,0.35) 70%)",
        }}
      />
      <figure
        className="absolute inset-0"
        style={{ width: "100vw", height: "100vh" }}
      >
        <Canvas 
          camera={{ position: [0, 1, 3] }}
          performance={{ min: 0.5 }}
          dpr={isMobile ? 1 : [1, 1.5]}
          gl={{ antialias: false, powerPreference: "high-performance" }}
        >
          <Suspense fallback={<Loader />}>
            <ambientLight intensity={0.2} />
            <directionalLight position={[2, 3, 2]} color="#00E5FF" intensity={1.2} />
            <directionalLight position={[-2, 1, 1]} color="#FF3CAC" intensity={0.6} />
            <Float>
              <LazyAstronaut
                scale={isMobile && 0.23}
                position={isMobile && [0, -1.5, 0]}
              />
            </Float>
            <Rig />
          </Suspense>
        </Canvas>
      </figure>
    </section>
  );
};

function Rig() {
  return useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [state.mouse.x / 14, 1 + state.mouse.y / 14, 3],
      0.5,
      delta
    );
  });
}

export default Hero;
