'use client';

import { useEffect, useRef, useState } from 'react';
import Pet from './Pet';


const NAMES = ["Chad", "Shimey", "Seandale", "Riri", "Chris", "Riley", "Jazz", "Gian", "Chass", "Test", "Kyle"];
const COLORS = ["#ff0055", "#00ffaa", "#ffaa00", "#00aaff", "#ff00ff", "#ffffff"];
const MAX_PETS = 20;

interface PetData {
  id: number;
  name: string;
  color: string;
  initialX: number;
}



export default function PetManager() {
  const [pets, setPets] = useState<PetData[]>([]);

  const spawnPet = (id:number = 0) => {
    if (pets.length >= MAX_PETS) return;

    const newPet: PetData = {
      id: id,
      name: NAMES[Math.floor(Math.random() * NAMES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      initialX: Math.random() * (typeof window !== 'undefined' ? window.innerWidth - 100 : 500)
    };

    setPets((prev) => [...prev, newPet]);
  };

  const hasSpawned = useRef(false);
  useEffect(() => {
    console.log("Spawning pets...");
    if (hasSpawned.current) return;
    for (let i = 0; i < MAX_PETS; i++) {
        spawnPet(i);
    }
    hasSpawned.current = true;

  }, []);

  return (
    <>
      <div className="absolute bottom-0 left-0 w-full h-0 pointer-events-none">
        {pets.map(pet => (
          <div key={pet.id} className="pointer-events-auto">
            <Pet name={pet.name} color={pet.color} initialX={pet.initialX} />
          </div>
        ))}
      </div>
    </>
  );
}