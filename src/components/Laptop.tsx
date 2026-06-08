'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Center, useGLTF } from '@react-three/drei';

function LaptopScene({ isHovered }: { isHovered: boolean }) {
  const { scene: cachedScene } = useGLTF('/models/laptop.glb');
  
  const { scene, materialsToDispose } = useMemo(() => {
    const clonedScene = cachedScene.clone(true);
    const newMaterials: THREE.Material[] = [];

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const originalMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

        const basicMaterials = originalMaterials.map((mat) => {
          const standardMat = mat as THREE.MeshStandardMaterial;
          if (standardMat.map) {
            standardMat.map.minFilter = THREE.NearestFilter;
            standardMat.map.magFilter = THREE.NearestFilter;
            standardMat.map.generateMipmaps = false;
            standardMat.map.needsUpdate = true;
          }
          
          const basicMat = new THREE.MeshBasicMaterial({
            map: standardMat.map,
            color: standardMat.color,
            alphaMap: standardMat.alphaMap,
            transparent: standardMat.transparent,
            opacity: standardMat.opacity,
            side: THREE.DoubleSide,
          });

          newMaterials.push(basicMat); // Keep a paper trail for garbage collection
          return basicMat;
        });

        mesh.material = basicMaterials.length === 1 ? basicMaterials[0] : basicMaterials;
      }
    });

    return { scene: clonedScene, materialsToDispose: newMaterials };
  }, [cachedScene]);

  const lidRef = useRef<THREE.Object3D | null>(null);
  const tumbleRef = useRef<THREE.Group>(null);
  const continuousYRef = useRef(0);

  useEffect(() => {
    lidRef.current = scene.getObjectByName('lid') || null;

    return () => {
      materialsToDispose.forEach((material) => material.dispose());
    };
  }, [scene, materialsToDispose]);

  useFrame((state, delta) => {
    if (delta > 0.1) return;

    const time = state.clock.getElapsedTime();

    if (tumbleRef.current) {
      if (!isHovered) {
        continuousYRef.current += delta * 1.5;
      } else {
        const currentTurns = Math.round(tumbleRef.current.rotation.y / (Math.PI * 2));
        continuousYRef.current = currentTurns * Math.PI * 2;
      }

      const targetX = isHovered ? 0.3 : Math.sin(time * 2.5) * 0.4 + Math.cos(time * 1.2) * 0.15;
      const targetY = continuousYRef.current;
      const targetZ = isHovered ? 0 : Math.sin(time * 2.0) * 0.25;
      const targetPosY = isHovered ? 0 : Math.sin(time * 2.2) * 0.08;

      tumbleRef.current.rotation.x = THREE.MathUtils.lerp(tumbleRef.current.rotation.x, targetX, delta * 6);
      tumbleRef.current.rotation.y = THREE.MathUtils.lerp(tumbleRef.current.rotation.y, targetY, delta * 6);
      tumbleRef.current.rotation.z = THREE.MathUtils.lerp(tumbleRef.current.rotation.z, targetZ, delta * 6);
      tumbleRef.current.position.y = THREE.MathUtils.lerp(tumbleRef.current.position.y, targetPosY, delta * 6);
    }

    if (!lidRef.current) return;

    const targetLidRotation = isHovered ? -Math.PI * 0.1 : 1.2;

    lidRef.current.rotation.x = THREE.MathUtils.lerp(
      lidRef.current.rotation.x,
      targetLidRotation,
      delta * 9
    );
  });

  return (
    <Center>
      <group ref={tumbleRef}>
        <primitive object={scene} scale={1.8} />
      </group>
    </Center>
  );
}

export default function Laptop() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full h-full cursor-pointer"
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ toneMapping: THREE.NoToneMapping, powerPreference: "high-performance" }}
        flat
      >
        <LaptopScene isHovered={isHovered} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/laptop.glb');