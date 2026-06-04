'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Center, useGLTF } from '@react-three/drei';

function Scene() {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/icon-sphere/icon-sphere.glb'); 

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

        const basicMaterials = materials.map((mat) => {
          const standardMat = mat as THREE.MeshStandardMaterial;

          if (standardMat.map) {
            standardMat.map.minFilter = THREE.NearestFilter;
            standardMat.map.magFilter = THREE.NearestFilter;
            standardMat.map.generateMipmaps = false;
            standardMat.map.needsUpdate = true;
          }

          return new THREE.MeshBasicMaterial({
            map: standardMat.map,
            color: standardMat.color,
            alphaMap: standardMat.alphaMap,
            transparent: standardMat.transparent,
            opacity: standardMat.opacity,
            side: standardMat.side,
          });
        });

        mesh.material = basicMaterials.length === 1 ? basicMaterials[0] : basicMaterials;
      }
    });
  }, [scene]);

  const animProgressRef = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (state.clock.getElapsedTime() < 1.0) return;

    animProgressRef.current += delta * 0.5; // speed of spin

    const currentSegment = Math.floor(animProgressRef.current);
    const segmentProgress = animProgressRef.current % 1;

    const spinWindow = 0.35;  // time to pause
    const adjustedProgress = Math.min(segmentProgress / spinWindow, 1.0);

    const smoothSpin = adjustedProgress * adjustedProgress * (3 - 2 * adjustedProgress);

    const targetRotation = (currentSegment + smoothSpin) * Math.PI;

    meshRef.current.rotation.y = targetRotation;
  });

  return (
    <Center>
      <primitive 
        ref={meshRef} 
        object={scene} 
        scale={1.5} 
      />
    </Center>
  );
}

export default function SpinningSphere() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, -4], fov: 45 }}
        gl={{toneMapping: THREE.NoToneMapping }}
        flat
        >
        <Scene />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/icon-sphere/icon-sphere.glb');