import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { WebGLErrorBoundary } from "./WebGLErrorBoundary";

function IcosahedronMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const wireframeRef = useRef<THREE.LineSegments>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.15;
      meshRef.current.rotation.y = t * 0.2;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x = t * 0.15;
      wireframeRef.current.rotation.y = t * 0.2;
      // Slight pulse in scale
      const scale = 1 + Math.sin(t * 2) * 0.05;
      wireframeRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Inner solid mesh */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.5, 1]} />
        <MeshDistortMaterial 
          color="#002244"
          emissive="#001122"
          distort={0.2}
          speed={2}
          roughness={0.2}
          metalness={1}
        />
      </mesh>

      {/* Outer wireframe */}
      <lineSegments ref={wireframeRef}>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(2.6, 1)]} />
        <lineBasicMaterial color="#00ffff" transparent opacity={0.6} />
      </lineSegments>
      
      {/* Outer points */}
      <points>
        <icosahedronGeometry args={[2.6, 1]} />
        <pointsMaterial color="#ffffff" size={0.1} sizeAttenuation transparent opacity={0.8} />
      </points>
    </group>
  );
}

const TechFallback = () => (
  <div className="h-[600px] w-full flex items-center justify-center">
    <div className="relative w-72 h-72">
      <div className="absolute inset-0 border-2 border-cyan-500/40 rotate-45 animate-spin" style={{ animationDuration: '8s', borderRadius: '20%' }} />
      <div className="absolute inset-8 border border-blue-500/30 rotate-12 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse', borderRadius: '30%' }} />
      <div className="absolute inset-16 bg-cyan-500/5 border border-cyan-400/20 rounded-full animate-pulse" />
    </div>
  </div>
);

export function TechSection3D() {
  return (
    <div className="h-[600px] w-full relative z-10">
      <WebGLErrorBoundary fallback={<TechFallback />}>
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 5, 5]} intensity={2} color="#00ffff" />
          <directionalLight position={[-5, -5, 5]} intensity={1} color="#0066ff" />
          
          <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <IcosahedronMesh />
          </Float>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
