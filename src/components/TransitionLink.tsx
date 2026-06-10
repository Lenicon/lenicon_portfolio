'use client';

import './../styles/transitionLink.css';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link, { LinkProps } from 'next/link';

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  backgroundStyle: string;
  style?: any;
  onPointerDown?: (e: React.PointerEvent<HTMLAnchorElement>) => void;
  onPointerMove?: (e: React.PointerEvent<HTMLAnchorElement>) => void;
  onPointerUp?: (e: React.PointerEvent<HTMLAnchorElement>) => void;
}

export default function TransitionLink({ 
  href, 
  children, 
  className, 
  backgroundStyle,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  ...props 
}: TransitionLinkProps) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [coords, setCoords] = useState({ x: '50%', y: '50%' });

  const startCoords = useRef<{ x: number; y: number } | null>(null);
  const wasDragged = useRef(false);

  const handleInternalPointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    startCoords.current = { x: e.clientX, y: e.clientY };
    wasDragged.current = false;
    
    if (onPointerDown) onPointerDown(e);
  };

  const handleInternalPointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (startCoords.current) {
      const distance = Math.hypot(
        e.clientX - startCoords.current.x,
        e.clientY - startCoords.current.y
      );

      if (distance > 5) {
        wasDragged.current = true;
      }
    }

    if (onPointerMove) onPointerMove(e);
  };

  const handleInternalPointerUp = (e: React.PointerEvent<HTMLAnchorElement>) => {
    startCoords.current = null;
    if (onPointerUp) onPointerUp(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (wasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    
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
        onPointerDown={handleInternalPointerDown}
        onPointerMove={handleInternalPointerMove}
        onPointerUp={handleInternalPointerUp}
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
            ['--click-x' as any]: coords.x,
            ['--click-y' as any]: coords.y,
          }}
        />
      )}
    </>
  );
}