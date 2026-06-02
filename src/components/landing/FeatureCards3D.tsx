import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";
import { Brain, Cpu, Zap, Activity, Layers, Infinity as InfinityIcon } from "lucide-react";
import { WebGLErrorBoundary } from "./WebGLErrorBoundary";

const features = [
  { icon: Brain, title: "Neural Processing", desc: "Advanced cognitive pathways mimicking human logic structures." },
  { icon: Cpu, title: "Quantum Reasoning", desc: "Solving complex multi-dimensional problems in milliseconds." },
  { icon: Zap, title: "Adaptive Learning", desc: "Self-optimizing algorithms that evolve with every interaction." },
  { icon: Layers, title: "Multimodal Intelligence", desc: "Seamless understanding across text, image, audio, and code." },
  { icon: Activity, title: "Real-time Synthesis", desc: "Instantaneous data assimilation and insight generation." },
  { icon: InfinityIcon, title: "Infinite Scale", desc: "Boundless architectural capacity for planetary-scale operations." },
];

function CardMesh({ position, feature }: { position: [number, number, number], feature: any }) {
  const group = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (group.current) {
      // Smoothly interpolate rotation towards target on hover
      const targetRotationX = hovered ? 0 : 0.2;
      const targetRotationY = hovered ? 0 : -0.2;
      
      group.current.rotation.x += (targetRotationX - group.current.rotation.x) * 0.1;
      group.current.rotation.y += (targetRotationY - group.current.rotation.y) * 0.1;
      
      // Slight continuous floating rotation even when not hovered
      if (!hovered) {
        group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.05;
      } else {
        group.current.rotation.z += (0 - group.current.rotation.z) * 0.1;
      }
    }
  });

  return (
    <group 
      ref={group} 
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh>
        <boxGeometry args={[3, 4, 0.1]} />
        <meshPhysicalMaterial 
          color={hovered ? "#00ffff" : "#003366"} 
          metalness={0.8}
          roughness={0.2}
          transmission={0.5}
          opacity={0.8}
          transparent
          emissive={hovered ? "#00ffff" : "#000000"}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
        
        {/* Glow effect border */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(3, 4, 0.1)]} />
          <lineBasicMaterial color={hovered ? "#00ffff" : "#0066cc"} transparent opacity={0.8} />
        </lineSegments>

        <Html transform position={[0, 0, 0.06]} occlude="blending" style={{ width: '280px', height: '380px' }}>
          <div className="w-full h-full p-6 flex flex-col justify-between text-white pointer-events-none">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-300 ${hovered ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.4)]' : 'bg-white/5 border-white/10'}`}>
              <feature.icon size={32} className={hovered ? "text-cyan-400" : "text-white/70"} />
            </div>
            
            <div className="mt-8">
              <h3 className="font-orbitron text-xl font-bold mb-2 tracking-wide">{feature.title}</h3>
              <p className="text-gray-400 font-sans text-sm leading-relaxed">{feature.desc}</p>
            </div>
            
            <div className={`h-1 w-full mt-6 rounded-full transition-all duration-500 ${hovered ? 'bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.8)]' : 'bg-white/10'}`} />
          </div>
        </Html>
      </mesh>
    </group>
  );
}

const FeatureCardFallback = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
    {features.map((feature, i) => (
      <div
        key={i}
        className="glass-panel neon-border rounded-2xl p-8 flex flex-col gap-4 group hover:border-cyan-400/60 transition-all duration-300"
        data-testid={`feature-card-${i}`}
      >
        <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
          <feature.icon size={28} className="text-cyan-400" />
        </div>
        <h3 className="font-orbitron text-lg font-bold text-white">{feature.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
        <div className="h-px w-full bg-gradient-to-r from-cyan-500/50 to-transparent mt-auto" />
      </div>
    ))}
  </div>
);

export function FeatureCards3D() {
  return (
    <WebGLErrorBoundary fallback={<FeatureCardFallback />}>
      <div className="h-[800px] w-full relative z-10">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />
          
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <group position={[0, 0, 0]}>
              {/* Top row */}
              <CardMesh position={[-3.5, 2.2, 0]} feature={features[0]} />
              <CardMesh position={[0, 2.2, 0]} feature={features[1]} />
              <CardMesh position={[3.5, 2.2, 0]} feature={features[2]} />
              
              {/* Bottom row */}
              <CardMesh position={[-3.5, -2.2, 0]} feature={features[3]} />
              <CardMesh position={[0, -2.2, 0]} feature={features[4]} />
              <CardMesh position={[3.5, -2.2, 0]} feature={features[5]} />
            </group>
          </Float>
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
