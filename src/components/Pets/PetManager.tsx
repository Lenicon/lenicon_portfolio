'use client';

import { useEffect, useRef, useState } from 'react';
import Pet from './Pet';
import { db } from '@/lib/firebase'; // Adjust this path to your firebase config
import { doc, getDoc } from 'firebase/firestore';

const MAX_PETS = 20;

interface CommentData {
  username: string;
  message: string;
  color: string;
  date: string;
}

interface PetData {
  id: string;
  name: string;
  color: string;
  message: string;
  initialX: number;
}

export default function PetManager() {
  const [pets, setPets] = useState<PetData[]>([]);
  const hasSpawned = useRef(false);

  useEffect(() => {
    if (hasSpawned.current) return;
    hasSpawned.current = true;

    const fetchAndSpawnPets = async () => {
      try {
        // 1. Get the current highest shard from metadata
        const metaRef = doc(db, 'letters', '_metadata');
        const metaSnap = await getDoc(metaRef);
        
        let highestShard = 1;
        if (metaSnap.exists()) {
          highestShard = metaSnap.data().highestShard || 1;
        }

        // 2. Pick a random shard between 1 and the highest shard for variety
        const randomShardId = Math.floor(Math.random() * highestShard) + 1;
        
        // 3. Fetch that specific shard
        const shardRef = doc(db, 'letters', randomShardId.toString());
        const shardSnap = await getDoc(shardRef);

        if (shardSnap.exists()) {
          const data = shardSnap.data();
          const batch: string[] = data.batch || [];
          
          // 4. Parse the JSON strings into objects
          const parsedComments: CommentData[] = batch.map((item) => JSON.parse(item));

          // 5. Shuffle the array and pick up to MAX_PETS
          const shuffled = parsedComments.sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, MAX_PETS);

          // 6. Map to PetData format
          const newPets: PetData[] = selected.map((comment, index) => ({
            id: `${randomShardId}-${index}`,
            name: comment.username || 'Anonymous',
            color: comment.color || '#ffffff',
            message: comment.message || '...',
            initialX: Math.random() * (typeof window !== 'undefined' ? window.innerWidth - 100 : 500)
          }));

          setPets(newPets);
        } else {
          console.warn("Selected shard has no data yet.");
        }
      } catch (error) {
        console.error("Failed to fetch pets:", error);
      }
    };

    fetchAndSpawnPets();
  }, []);

  return (
    <>
      <div className="absolute bottom-0 left-0 w-full h-0 pointer-events-none">
        {pets.map(pet => (
          <div key={pet.id} className="pointer-events-auto">
            <Pet 
              name={pet.name} 
              color={pet.color} 
              initialX={pet.initialX} 
              message={pet.message}
            />
          </div>
        ))}
      </div>
    </>
  );
}