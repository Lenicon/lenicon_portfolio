'use client';

import { randomIndex } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';

const GRAB_DIALOGUE = ["Release me!", "WAHHH!", "HELP!!", "Drop me gently!", "WOAHHH!", "CAREFUL NOW!"];

const BASE_WIDTH = 28;
const BASE_HEIGHT = 33;

const GRAB_X_ORIGINAL = 13;
const GRAB_Y_ORIGINAL = 10;

export default function Pet({ 
  name, 
  color, 
  initialX, 
  message 
}: { 
  name: string, 
  color: string, 
  initialX: number, 
  message: string 
}) {

  const [petScale, setPetScale] = useState(2.5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setPetScale(1.5); // Small scale
      } else if (window.innerWidth < 1024) {
        setPetScale(2.0); // Medium scale
      } else {
        setPetScale(2.5); // Default desktop scale
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const PET_WIDTH = BASE_WIDTH * petScale;
  const PET_HEIGHT = BASE_HEIGHT * petScale;

  const GRAB_X_SCALED = GRAB_X_ORIGINAL * petScale;
  const GRAB_Y_SCALED = GRAB_Y_ORIGINAL * petScale;

  const EDGE_PADDING = Math.min(90, window.innerWidth * 0.15); 

  const [position, setPosition] = useState({ x: initialX, y: 0 }); 
  const [action, setAction] = useState<'idle' | 'walk' | 'grab' | 'fall'>('idle');
  const [direction, setDirection] = useState<1 | -1>(1); 
  const [speech, setSpeech] = useState<string | null>(null);
  
  const isDragging = useRef(false);

  
  useEffect(() => {
    setPosition((prev) => {
      const maxAvailableX = window.innerWidth - PET_WIDTH - EDGE_PADDING;
      const clampedX = Math.max(EDGE_PADDING, Math.min(maxAvailableX, prev.x));
      return { ...prev, x: clampedX };
    });
  }, [petScale, PET_WIDTH, EDGE_PADDING]);

  // DRAG
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    setAction('grab');
    setSpeech(GRAB_DIALOGUE[randomIndex(GRAB_DIALOGUE.length)]);
    
    const rawX = e.clientX - GRAB_X_SCALED;
    const rawY = window.innerHeight - e.clientY + GRAB_Y_SCALED - PET_HEIGHT;
    
    const clampedX = Math.max(EDGE_PADDING, Math.min(window.innerWidth - PET_WIDTH - EDGE_PADDING, rawX));
    const clampedY = Math.max(0, Math.min(window.innerHeight - PET_HEIGHT, rawY));
    
    setPosition({ x: clampedX, y: clampedY });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    
    const rawX = e.clientX - GRAB_X_SCALED;
    const rawY = window.innerHeight - e.clientY + GRAB_Y_SCALED - PET_HEIGHT;
    
    const clampedX = Math.max(EDGE_PADDING, Math.min(window.innerWidth - PET_WIDTH - EDGE_PADDING, rawX));
    const clampedY = Math.max(0, Math.min(window.innerHeight - PET_HEIGHT, rawY));
    
    setPosition({ x: clampedX, y: clampedY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    setAction('fall');
    setSpeech(null);
  };

  // MOVEMENT
  useEffect(() => {
    const loop = setInterval(() => {
      if (isDragging.current) return;

      setPosition((prev) => {
        let groundY = 0;
        const petCenterX = prev.x + (PET_WIDTH / 2);

        const platforms = document.querySelectorAll('[data-platform="true"]');
        platforms.forEach(plat => {
          const rect = plat.getBoundingClientRect();
          if (petCenterX >= rect.left && petCenterX <= rect.right) {
            const platTopY = window.innerHeight - rect.top;
            if (platTopY <= prev.y + 20 && platTopY > groundY) {
              groundY = platTopY;
            }
          }
        });

        const spherePlatforms = document.querySelectorAll('[data-platform="sphere"]');
        spherePlatforms.forEach(sphere => {
          const rect = sphere.getBoundingClientRect();
          const radius = rect.width / 2;
          const centerX = rect.left + radius;
          const centerY = rect.top + radius;
          const dx = petCenterX - centerX;

          if (Math.abs(dx) < radius) {
            const dy = Math.sqrt((radius * radius) - (dx * dx));
            const circleTopY = window.innerHeight - (centerY - dy);
            if (circleTopY <= prev.y + 25 && circleTopY > groundY) {
              groundY = circleTopY;
            }
          }
        });

        if (prev.y > groundY) {
          if (action !== 'fall') setAction('fall');
          const nextY = Math.max(groundY, prev.y - 15); 
          if (nextY === groundY) setAction('idle');
          return { ...prev, y: nextY };
        }

        if (prev.y < groundY) {
            return { ...prev, y: groundY };
        }

        if (action === 'fall' && prev.y === groundY) {
            setAction('idle');
            return prev;
        }

        if (action === 'walk') {
          let nextX = prev.x + (2 * direction); 
          
          if (nextX < EDGE_PADDING) { 
            nextX = EDGE_PADDING; 
            setDirection(1); 
          }
          if (nextX > window.innerWidth - PET_WIDTH - EDGE_PADDING) { 
            nextX = window.innerWidth - PET_WIDTH - EDGE_PADDING; 
            setDirection(-1); 
          }
          
          return { ...prev, x: nextX };
        }
        
        return prev;
      });
    }, 1000 / 60); 

    return () => clearInterval(loop);
  }, [action, direction, PET_WIDTH, EDGE_PADDING]);

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
        setSpeech(message);
        setTimeout(() => setSpeech(null), 3000); 
      }
    }, 2000); 

    return () => clearInterval(aiLoop);
  }, [action, message]);

  return (
    <div 
      className="absolute flex flex-col items-center justify-end select-none touch-none overscroll-none cursor-grab active:cursor-grabbing"
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
      {/* Speech Bubble*/}
      {speech && (
        <div className="absolute bottom-full mb-4 bg-white text-black px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-fredoka pointer-events-none text-center shadow-md w-max max-w-[160px] sm:max-w-[250px] break-words after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-white">
            {speech}
        </div>
      )}

      {/* Username */}
      <div className="text-[10px] sm:text-[12px] text-center font-upheaval text-white bg-black/50 px-1.5 py-0.5 rounded pointer-events-none mb-1 shadow-sm whitespace-nowrap">
        {name.length > 12 ? `${name.substring(0, 12)}...` : name}
      </div>

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