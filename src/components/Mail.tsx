'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Center, useGLTF } from '@react-three/drei';


function MailScene({ isHovered }: { isHovered: boolean }) {
  const { scene } = useGLTF('/models/mail.glb');
  
  const coverRef = useRef<THREE.Object3D | null>(null);
  const paperRef = useRef<THREE.Object3D | null>(null);
  const tumbleRef = useRef<THREE.Group>(null);
  const continuousYRef = useRef(0);

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
            side: THREE.DoubleSide,
          });
        });
        mesh.material = basicMaterials.length === 1 ? basicMaterials[0] : basicMaterials;
      }

      if (child.name === 'cover') coverRef.current = child;
      if (child.name === 'paper') paperRef.current = child;

    });
  }, [scene]);

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

      // to twist or not to twist
      const targetX = isHovered ? 0.7 : Math.sin(time * 2.5) * 0.4 + Math.cos(time * 1.2) * 0.15;
      const targetY = continuousYRef.current;
      const targetZ = isHovered ? 0 : Math.sin(time * 2.0) * 0.25;
      const targetPosY = isHovered ? 0 : Math.sin(time * 2.2) * 0.08;

      // twisty turny
      tumbleRef.current.rotation.x = THREE.MathUtils.lerp(tumbleRef.current.rotation.x, targetX, delta * 6);
      tumbleRef.current.rotation.y = THREE.MathUtils.lerp(tumbleRef.current.rotation.y, targetY, delta * 6);
      tumbleRef.current.rotation.z = THREE.MathUtils.lerp(tumbleRef.current.rotation.z, targetZ, delta * 6);
      tumbleRef.current.position.y = THREE.MathUtils.lerp(tumbleRef.current.position.y, targetPosY, delta * 6);
    }


    // COVER MOVEMENT
    if (!coverRef.current) return;

    const targetCoverRotation = isHovered ? -Math.PI * 0.1 : 2.9;
    const coverSpeed = isHovered ? 20 : 9;

    coverRef.current.rotation.z = THREE.MathUtils.lerp(
      coverRef.current.rotation.z,
      targetCoverRotation,
      delta * coverSpeed
    );


    // PAPER MOVEMENT
    if (!paperRef.current) return;
    const targetPaperPositionY = isHovered ? 0.4 : 0;
    const paperSpeed = isHovered ? 7 : 20;

    paperRef.current.position.y = THREE.MathUtils.lerp(
      paperRef.current.position.y,
      targetPaperPositionY,
      delta * paperSpeed
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

export default function Mail() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full h-full cursor-pointer"
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <Canvas
        camera={{ position: [0, -2, 4], fov: 45 }}
        gl={{ toneMapping: THREE.NoToneMapping }}
        flat
      >
        <MailScene isHovered={isHovered} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/mail.glb');