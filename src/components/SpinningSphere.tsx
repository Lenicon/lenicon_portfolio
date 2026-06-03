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

        // Map existing materials into MeshBasicMaterial to bypass lighting
        const basicMaterials = materials.map((mat) => {
          const standardMat = mat as THREE.MeshStandardMaterial;

          // Configure the texture filtering if a texture map exists
          if (standardMat.map) {
            standardMat.map.minFilter = THREE.NearestFilter;
            standardMat.map.magFilter = THREE.NearestFilter;
            standardMat.map.generateMipmaps = false;
            standardMat.map.needsUpdate = true;
          }

          // Create flat basic material using the original color and texture map
          return new THREE.MeshBasicMaterial({
            map: standardMat.map,
            color: standardMat.color,
            alphaMap: standardMat.alphaMap,
            transparent: standardMat.transparent,
            opacity: standardMat.opacity,
            side: standardMat.side,
          });
        });

        // Reassign the unlit basic material back to the mesh
        mesh.material = basicMaterials.length === 1 ? basicMaterials[0] : basicMaterials;
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
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
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{toneMapping: THREE.NoToneMapping }}
        flat
        >
        <Scene />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/icon-sphere/icon-sphere.glb');