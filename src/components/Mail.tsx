'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Center, useGLTF } from '@react-three/drei';

function MailScene({ isHovered }: { isHovered: boolean }) {
  const { scene: cachedScene } = useGLTF('/models/mail.glb');
  
  const coverRef = useRef<THREE.Object3D | null>(null);
  const paperRef = useRef<THREE.Object3D | null>(null);
  const tumbleRef = useRef<THREE.Group>(null);
  const continuousYRef = useRef(0);

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

          newMaterials.push(basicMat);
          return basicMat;
        });

        mesh.material = basicMaterials.length === 1 ? basicMaterials[0] : basicMaterials;
      }
    });

    return { scene: clonedScene, materialsToDispose: newMaterials };
  }, [cachedScene]);

  useEffect(() => {
    coverRef.current = scene.getObjectByName('cover') || null;
    paperRef.current = scene.getObjectByName('paper') || null;

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

      const targetX = isHovered ? 0.7 : Math.sin(time * 2.5) * 0.4 + Math.cos(time * 1.2) * 0.15;
      const targetY = continuousYRef.current;
      const targetZ = isHovered ? 0 : Math.sin(time * 2.0) * 0.25;
      const targetPosY = isHovered ? 0 : Math.sin(time * 2.2) * 0.08 + 0.3;

      tumbleRef.current.rotation.x = THREE.MathUtils.lerp(tumbleRef.current.rotation.x, targetX, delta * 6);
      tumbleRef.current.rotation.y = THREE.MathUtils.lerp(tumbleRef.current.rotation.y, targetY, delta * 6);
      tumbleRef.current.rotation.z = THREE.MathUtils.lerp(tumbleRef.current.rotation.z, targetZ, delta * 6);
      tumbleRef.current.position.y = THREE.MathUtils.lerp(tumbleRef.current.position.y, targetPosY, delta * 6);
    }

    // COVER MOVEMENT
    if (coverRef.current) {
      const targetCoverRotation = isHovered ? -Math.PI * 0.1 : 2.9;
      const coverSpeed = isHovered ? 20 : 7;

      coverRef.current.rotation.z = THREE.MathUtils.lerp(
        coverRef.current.rotation.z,
        targetCoverRotation,
        delta * coverSpeed
      );
    }

    // PAPER MOVEMENT
    if (paperRef.current) {
      const targetPaperPositionY = isHovered ? 0.1 : -0.45;
      const paperSpeed = isHovered ? 7 : 20;

      paperRef.current.position.y = THREE.MathUtils.lerp(
        paperRef.current.position.y,
        targetPaperPositionY,
        delta * paperSpeed
      );
    }
  });

  return (
    <group ref={tumbleRef}>
      <Center>
        <primitive object={scene} scale={1.8} />
      </Center>
    </group>
  );
}

export default function Mail() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full h-full cursor-pointer"
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <Canvas
        camera={{ position: [0, -1, 4], fov: 45 }}
        gl={{ toneMapping: THREE.NoToneMapping, powerPreference: "high-performance" }}
        flat
      >
        <MailScene isHovered={isHovered} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/mail.glb');