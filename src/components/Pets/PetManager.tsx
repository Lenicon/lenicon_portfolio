'use client';

import { useState } from 'react';
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

  const spawnPet = () => {
    if (pets.length >= MAX_PETS) return;

    const newPet: PetData = {
      id: Date.now(),
      name: NAMES[Math.floor(Math.random() * NAMES.length)] + Math.floor(Math.random() * 100),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      // Spawn somewhat randomly across the screen width
      initialX: Math.random() * (typeof window !== 'undefined' ? window.innerWidth - 100 : 500)
    };

    setPets((prev) => [...prev, newPet]);
  };

  return (
    <>
      <div className="absolute bottom-0 left-0 w-full h-0 pointer-events-none">
        {pets.map(pet => (
          <div key={pet.id} className="pointer-events-auto">
            <Pet name={pet.name} color={pet.color} initialX={pet.initialX} />
          </div>
        ))}
      </div>

      <button 
        onClick={spawnPet}
        disabled={pets.length >= 10}
        className="absolute bottom-4 right-4 z-50 px-4 py-2 bg-[var(--blue)] text-white font-upheaval rounded text-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pets.length >= MAX_PETS ? "MAX PETS REACHED" : "SPAWN PET"}
      </button>
    </>
  );
}