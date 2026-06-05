'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Center, useGLTF } from '@react-three/drei';

function Scene({ isHovered }:{ isHovered: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/icon-sphere.glb'); 
  const globalMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      globalMouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      globalMouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  const targetRotationRef = useRef(0);
  const wasHoveredRef = useRef(false);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;

    if (delta > 0.1) return;
    
    if (isHovered !== wasHoveredRef.current) {
      const currentTurn = Math.floor(meshRef.current.rotation.y / Math.PI);
      const isSittingOnFrontFace = Math.abs(currentTurn) % 2 === 0;

      if (isHovered) {
        targetRotationRef.current = isSittingOnFrontFace ? (currentTurn - 1) * Math.PI : (currentTurn - 2) * Math.PI;
      } else {
        targetRotationRef.current = !isSittingOnFrontFace ? (currentTurn - 1) * Math.PI : (currentTurn - 2) * Math.PI;
      }

      wasHoveredRef.current = isHovered;
    }

    const mouseTargetX = isHovered ? -0.05 : globalMouseRef.current.y * -0.3; 
    const mouseTargetY = isHovered ? 0.042 : globalMouseRef.current.x * 0.35 - 0.15;

    const finalTargetX = mouseTargetX;
    const finalTargetY = targetRotationRef.current + mouseTargetY;

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, finalTargetX, delta * 6);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, finalTargetY, delta * 6);
  });

  return (
    <group ref={meshRef}>
      <Center>
        <primitive 
          object={scene} 
          scale={1.5} 
        />
      </Center>
    </group>
  );
}

export default function IconSphere() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full h-full cursor-pointer"
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ toneMapping: THREE.NoToneMapping }}
        flat
      >
        <Scene isHovered={isHovered} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/icon-sphere.glb');