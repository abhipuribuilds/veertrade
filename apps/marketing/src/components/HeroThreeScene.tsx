import { useMemo, useRef, useEffect, useState, type JSX } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { BufferGeometry, BufferAttribute, Line, LineBasicMaterial, Mesh } from "three";

const pointsCount = 120;

function getY(i: number, time: number): number {
  return (
    Math.sin(i * 0.3 - time) * 0.8 +
    Math.sin(i * 0.1 - time * 1.3) * 1.2 +
    Math.cos(i * 0.05 - time * 0.7) * 0.5
  );
}

function ChartLine() {
  const lineObj = useMemo(() => {
    const pos = new Float32Array(pointsCount * 3);
    for (let i = 0; i < pointsCount; i++) {
      pos[i * 3] = (i / pointsCount) * 16 - 8;
      pos[i * 3 + 1] = getY(i, 0);
      pos[i * 3 + 2] = 0;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    const mat = new LineBasicMaterial({
      color: "#10b981",
      transparent: true,
      opacity: 0.6,
    });
    return new Line(geo, mat);
  }, []);

  const glowObj = useMemo(() => {
    const pos = new Float32Array(pointsCount * 3);
    for (let i = 0; i < pointsCount; i++) {
      pos[i * 3] = (i / pointsCount) * 16 - 8;
      pos[i * 3 + 1] = getY(i, 0);
      pos[i * 3 + 2] = 0;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    const mat = new LineBasicMaterial({
      color: "#10b981",
      transparent: true,
      opacity: 0.15,
    });
    return new Line(geo, mat);
  }, []);

  const headDot = useRef<Mesh>(null);
  const glowDot = useRef<Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime * 0.4;

    const attr = lineObj.geometry.getAttribute("position");
    if (attr) {
      const pos = attr.array as Float32Array;
      for (let i = 0; i < pointsCount; i++) {
        pos[i * 3 + 1] = getY(i, time);
      }
      attr.needsUpdate = true;
    }

    const glowAttr = glowObj.geometry.getAttribute("position");
    if (glowAttr) {
      const gpos = glowAttr.array as Float32Array;
      for (let i = 0; i < pointsCount; i++) {
        gpos[i * 3 + 1] = getY(i, time);
      }
      glowAttr.needsUpdate = true;
    }

    const headIdx = Math.floor(
      ((time * 40) % pointsCount + pointsCount) % pointsCount
    );
    const x = (headIdx / pointsCount) * 16 - 8;
    const y = getY(headIdx, time);

    if (headDot.current) {
      headDot.current.position.set(x, y, 0);
    }
    if (glowDot.current) {
      glowDot.current.position.set(x, y, 0);
    }
  });

  return (
    <>
      <primitive object={glowObj} />
      <primitive object={lineObj} />
      <mesh ref={glowDot}>
        <circleGeometry args={[0.18, 16]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.25} />
      </mesh>
      <mesh ref={headDot}>
        <circleGeometry args={[0.07, 16]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.95} />
      </mesh>
    </>
  );
}

function Scene(): JSX.Element {
  return <ChartLine />;
}

export default function HeroScene(): JSX.Element | null {
  const [lowPerf, setLowPerf] = useState(false);

  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const hasLowMemory = "deviceMemory" in navigator && (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined
      && (navigator as Navigator & { deviceMemory?: number }).deviceMemory! < 4;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobile || hasLowMemory || prefersReduced) {
      setLowPerf(true);
    }
  }, []);

  if (lowPerf) return null;

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ opacity: 0.7 }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
