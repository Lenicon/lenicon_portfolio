'use client';

import { isAprilFools, isBirthday, isChristmas, isHalloween } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function DudeImage() {
  const [dudeEvent, setDudeEvent] = useState('');
  
  useEffect(() => {
    if (isBirthday()) setDudeEvent('_birthday')
    else if (isAprilFools()) setDudeEvent('_aprilfools')
    else if (isChristmas()) setDudeEvent('_christmas')
    else if (isHalloween()) setDudeEvent('_halloween')
    else setDudeEvent('')
  }, []);

  return (
      <div className="w-full lg:w-auto flex justify-center mt-10 mb-[-2rem] sm:mb-0 lg:mt-0 lg:fixed lg:bottom-0 lg:-right-[1rem] lg:z-0">
        
        <img 
          className="w-[95%] sm:w-[80%] md:w-[70vw] lg:w-[55vw] max-w-none object-contain block origin-bottom-right" 
          src={`/images/about/dudes/dude${dudeEvent}.webp`} 
          alt="Hertz Lenin"
          style={{
            filter: 'drop-shadow(4px 0px 0px black) drop-shadow(-4px 0px 0px black) drop-shadow(0px 4px 0px black) drop-shadow(0px -4px 0px black) drop-shadow(-20px 20px 0px black)'
          }}
        />

      </div>
  );
}