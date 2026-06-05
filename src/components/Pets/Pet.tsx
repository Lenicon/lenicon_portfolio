'use client';

import { useState, useEffect, useRef } from 'react';

const DIALOGUE = ["This is the longest dialogue I could think of, cool I know. testing testing testing testing testing testing", "Hi guys!", "Look at me! I'm a pet!", "Oten"];

// --- PET DIMENSIONS & SCALE ---
// Adjust the scale to make the pet larger or smaller in the browser.
const PET_SCALE = 2.5; 
const BASE_WIDTH = 28;
const BASE_HEIGHT = 33;

const PET_WIDTH = BASE_WIDTH * PET_SCALE;
const PET_HEIGHT = BASE_HEIGHT * PET_SCALE;

// The exact pixel coordinates where the mouse should pinch the sprite
const GRAB_X_ORIGINAL = 13;
const GRAB_Y_ORIGINAL = 10;

const GRAB_X_SCALED = GRAB_X_ORIGINAL * PET_SCALE;
const GRAB_Y_SCALED = GRAB_Y_ORIGINAL * PET_SCALE;

export default function Pet({ name, color, initialX }: { name: string, color: string, initialX: number }) {
  const [position, setPosition] = useState({ x: initialX, y: 0 }); 
  const [action, setAction] = useState<'idle' | 'walk' | 'grab' | 'fall'>('idle');
  const [direction, setDirection] = useState<1 | -1>(1); 
  const [speech, setSpeech] = useState<string | null>(null);
  
  const isDragging = useRef(false);

  // --- DRAG ---
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    setAction('grab');
    setSpeech("Wah!");
    
    
    const newX = e.clientX - GRAB_X_SCALED;
    // Calculate distance from the bottom of the screen to the bottom of the pet
    const newY = window.innerHeight - e.clientY + GRAB_Y_SCALED - PET_HEIGHT;
    
    setPosition({ x: newX, y: Math.max(0, newY) });
    
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    
    const newX = e.clientX - GRAB_X_SCALED;
    const newY = window.innerHeight - e.clientY + GRAB_Y_SCALED - PET_HEIGHT;
    
    setPosition({ x: newX, y: Math.max(0, newY) });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    setAction('fall');
    setSpeech(null);
  };

  // --- MOVEMENT ---
  useEffect(() => {
    const loop = setInterval(() => {
      if (isDragging.current) return;

      setPosition((prev) => {
        // RAYCAST
        let groundY = 0;
        const petCenterX = prev.x + (PET_WIDTH / 2);

        // Scan all flat platforms
        const platforms = document.querySelectorAll('[data-platform="true"]');
        platforms.forEach(plat => {
          const rect = plat.getBoundingClientRect();
          
          if (petCenterX >= rect.left && petCenterX <= rect.right) {
            // Convert top edge to bottom-up screen coordinates
            const platTopY = window.innerHeight - rect.top;
            
            // Only stand on it if it's below the pet
            if (platTopY <= prev.y + 20 && platTopY > groundY) {
              groundY = platTopY;
            }
          }
        });

        // Scan all sphere platforms, for the icon-sphere
        const spherePlatforms = document.querySelectorAll('[data-platform="sphere"]');
        spherePlatforms.forEach(sphere => {
          const rect = sphere.getBoundingClientRect();
          
          const radius = rect.width / 2;
          const centerX = rect.left + radius;
          const centerY = rect.top + radius;

          const dx = petCenterX - centerX;

          // If the pet is horizontally within the circle's radius
          if (Math.abs(dx) < radius) {
            // dx^2 + dy^2 = r^2 -> dy = sqrt(r^2 - dx^2)
            const dy = Math.sqrt((radius * radius) - (dx * dx));
            
            const circleTopY = window.innerHeight - (centerY - dy);

            // Stand if pet fall onto it
            if (circleTopY <= prev.y + 25 && circleTopY > groundY) {
              groundY = circleTopY;
            }
          }
        });

        // Falling Logic
        if (prev.y > groundY) {
          // Fall if walked off edge
          if (action !== 'fall') setAction('fall');
          
          const nextY = Math.max(groundY, prev.y - 15); 
          if (nextY === groundY) setAction('idle'); // Landed on platform or ground
          return { ...prev, y: nextY };
        }

        // Stop going inside of elements like when you resize windwos
        if (prev.y < groundY) {
            return { ...prev, y: groundY };
        }

        // Wake up if marked fall but already on the ground
        if (action === 'fall' && prev.y === groundY) {
            setAction('idle');
            return prev;
        }

        // Walking Logic
        if (action === 'walk') {
          let nextX = prev.x + (2 * direction); 
          let newDir = direction;
          
          // Flip
          if (nextX < 0) { nextX = 0; newDir = 1; setDirection(1); }
          if (nextX > window.innerWidth - PET_WIDTH) { 
            nextX = window.innerWidth - PET_WIDTH; 
            newDir = -1; 
            setDirection(-1); 
          }
          
          return { ...prev, x: nextX };
        }
        
        return prev;
      });
    }, 1000 / 60); 

    return () => clearInterval(loop);
  }, [action, direction]);

  useEffect(() => {
    const aiLoop = setInterval(() => {
      if (action === 'grab' || action === 'fall') return; 

      if (Math.random() > 0.5) {
        const nextAction = Math.random() > 0.5 ? 'walk' : 'idle';
        setAction(nextAction);
        
        if (nextAction === 'walk') {
          setDirection(Math.random() > 0.5 ? 1 : -1);
        }
      }

      if (Math.random() > 0.9) {
        setSpeech(DIALOGUE[Math.floor(Math.random() * DIALOGUE.length)]);
        setTimeout(() => setSpeech(null), 3000); 
      }
    }, 2000); 

    return () => clearInterval(aiLoop);
  }, [action]);

  return (
    <div 
      className="absolute flex flex-col items-center justify-end select-none touch-none cursor-grab active:cursor-grabbing"
      style={{
        left: `${position.x}px`,
        bottom: `${position.y}px`,
        width: `${PET_WIDTH}px`,
        height: `${PET_HEIGHT}px`,
        zIndex: 50,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Speech Bubble */}
      {speech && (
        <div className="absolute bottom-full mb-6 bg-white text-black px-3 py-2 rounded-xl text-xs font-upheaval pointer-events-none text-center shadow-md w-max max-w-[200px] break-words after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-white">
            {speech}
        </div>
      )}

      {/* Username */}
      <span className="text-[12px] font-upheaval text-white bg-black/50 px-1.5 py-0.5 rounded pointer-events-none mb-1 shadow-sm">
        {name}
      </span>

      {/* Dynamic Color */}
      <div 
        className="pointer-events-none transition-transform duration-200"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: color,
          WebkitMaskImage: `url(/images/pet/${action}.gif)`, 
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'bottom center',
          transform: `scaleX(${direction})`, 
        }}
      />
    </div>
  );
}