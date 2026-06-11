'use client';

import { useRef } from 'react';
import Link, { LinkProps } from 'next/link';

interface IconLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  style?: any;
  onPointerDown?: (e: React.PointerEvent<HTMLAnchorElement>) => void;
  onPointerMove?: (e: React.PointerEvent<HTMLAnchorElement>) => void;
  onPointerUp?: (e: React.PointerEvent<HTMLAnchorElement>) => void;
}

export default function IconLink({ 
  href, 
  children, 
  className,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  ...props 
}: IconLinkProps) {

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


    setTimeout(() => {
      window.open(href.toString(), '_blank', 'noopener,noreferrer');
    }, 100);
  };

  return (
      <Link
        target='_blank'
        href={href}
        onClick={handleClick} 
        onPointerDown={handleInternalPointerDown}
        onPointerMove={handleInternalPointerMove}
        onPointerUp={handleInternalPointerUp}
        className={`${className || ''}`} 
        {...props}
      >
        {children}
      </Link>
  );
}