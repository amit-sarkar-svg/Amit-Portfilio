import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { reduced } from "../hooks/motion";

const VIOLET = "#7a57db";
const CYAN = "#33c2cc";
const FOV = 45;
const BASE_Z = 9.5;

const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b);
const smooth = (t) => t * t * (3 - 2 * t);

// The "data core": nested wireframe spheres, a shell of points, and packets that
// circle on tilted orbit rings. It starts fully in view on the right, then scroll
// progress pulls the camera in and slides the core to the centre.
function Core({ small, wide, still, pointer, progress }) {
  const anchor = useRef();
  const group = useRef();
  const outer = useRef();
  const inner = useRef();
  const shell = useRef();
  const packets = useRef([]);
  const spin = useRef(0);

  const shellPositions = useMemo(() => {
    const n = small ? 450 : 1100;
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 3.3 + Math.random() * 0.9;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      a[i * 3] = r * Math.sin(p) * Math.cos(t);
      a[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      a[i * 3 + 2] = r * Math.cos(p);
    }
    return a;
  }, [small]);

  const rings = useMemo(
    () => [
      { r: 3.0, tilt: [1.2, 0.2, 0], speed: 0.45, color: CYAN },
      { r: 3.6, tilt: [0.5, 0.9, 0.3], speed: -0.3, color: VIOLET },
    ],
    []
  );

  useFrame((state, dt) => {
    const a = anchor.current;
    const g = group.current;
    if (!a || !g) return;
    const p = progress.current;
    const k = Math.min(dt * 6, 1);

    // Where the core rests: fully visible on the right, centred on small screens.
    const aspect = state.camera.aspect;
    const sc = Math.min(1.15, 0.55 + aspect * 0.3);
    const halfW = Math.tan((FOV * Math.PI) / 360) * BASE_Z * aspect;
    const restX = wide ? Math.max(halfW - 2.2 * sc - 0.7, 0.6) : 0;
    const x = restX * (1 - smooth(clamp(p / 0.55)));
    a.position.x += (x - a.position.x) * k;
    a.scale.setScalar(sc);

    // Camera flies in as you scroll.
    const z = BASE_Z - (BASE_Z - 4.6) * smooth(clamp(p / 0.9));
    state.camera.position.z += (z - state.camera.position.z) * k;

    g.rotation.y += (pointer.current.x * 0.5 - g.rotation.y) * Math.min(dt * 2, 1);
    g.rotation.x += (-pointer.current.y * 0.3 - g.rotation.x) * Math.min(dt * 2, 1);
    if (still) return;

    spin.current += dt * (1 + p * 5);
    const t = spin.current;
    outer.current.rotation.y = t * 0.12;
    outer.current.rotation.x = t * 0.05;
    inner.current.rotation.y = -t * 0.2;
    inner.current.rotation.z = t * 0.08;
    shell.current.rotation.y = t * 0.03;
    packets.current.forEach((pk, i) => {
      if (!pk) return;
      const cfg = rings[i];
      const ang = t * cfg.speed + i * 2;
      pk.position.set(Math.cos(ang) * cfg.r, Math.sin(ang) * cfg.r, 0);
    });
  });

  return (
    <group ref={anchor}>
      <group ref={group}>
        <group ref={outer}>
          <mesh>
            <icosahedronGeometry args={[2.2, 2]} />
            <meshBasicMaterial color={VIOLET} wireframe transparent opacity={wide ? 0.55 : 0.3} />
          </mesh>
          <points>
            <icosahedronGeometry args={[2.2, 2]} />
            <pointsMaterial color="#ffffff" size={0.045} transparent opacity={0.85} sizeAttenuation />
          </points>
        </group>
        <mesh ref={inner}>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.55} />
        </mesh>
        <points ref={shell}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[shellPositions, 3]} />
          </bufferGeometry>
          <pointsMaterial color="#c9c4ff" size={0.03} transparent opacity={0.6} sizeAttenuation />
        </points>

        {!small &&
          rings.map((cfg, i) => (
            <group key={i} rotation={cfg.tilt}>
              <mesh>
                <torusGeometry args={[cfg.r, 0.004, 6, 160]} />
                <meshBasicMaterial color={cfg.color} transparent opacity={0.55} />
              </mesh>
              <mesh ref={(el) => (packets.current[i] = el)}>
                <sphereGeometry args={[0.07, 12, 12]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          ))}
      </group>
    </group>
  );
}

const HeroScene = ({ progress }) => {
  const wrap = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const small = typeof window !== "undefined" && window.innerWidth < 768;
  const wide = typeof window !== "undefined" && window.innerWidth >= 1024;
  const still = reduced();

  // Only render while the hero stage is on screen.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    if (wrap.current) io.observe(wrap.current);
    const move = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <div ref={wrap} aria-hidden="true" className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, BASE_Z], fov: FOV }}
        dpr={[1, 1.5]}
        frameloop={visible && !still ? "always" : "demand"}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <Core small={small} wide={wide} still={still} pointer={pointer} progress={progress} />
      </Canvas>
    </div>
  );
};

export default HeroScene;
