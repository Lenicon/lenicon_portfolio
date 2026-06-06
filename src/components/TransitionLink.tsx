'use client';

import './../styles/transitionLink.css';


import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link, { LinkProps } from 'next/link';

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  backgroundStyle: string;
}

export default function TransitionLink({ 
  href, 
  children, 
  className, 
  backgroundStyle, 
  ...props 
}: TransitionLinkProps) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [coords, setCoords] = useState({ x: '50%', y: '50%' });

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();
    
    // 2. Compute the exact dead center of the element
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setCoords({
      x: `${centerX}px`,
      y: `${centerY}px`
    });

    setIsTransitioning(true);

    setTimeout(() => {
      router.push(href.toString());
    }, 600);
  };

  return (
    <>
      <Link 
        href={href} 
        onClick={handleClick} 
        className={`${className || ''} ${
          isTransitioning ? 'z-[9997] animate-item-fade pointer-events-none' : ''
        }`} 
        {...props}
      >
        {children}
      </Link>

      {isTransitioning && (
        <div 
          className={"fixed inset-0 z-[9995] pointer-events-none animate-circle-wipe " + backgroundStyle}
          style={{ 
            // backgroundColor: color,
            ['--click-x' as any]: coords.x,
            ['--click-y' as any]: coords.y,
          }}
        />
      )}
    </>
  );
}