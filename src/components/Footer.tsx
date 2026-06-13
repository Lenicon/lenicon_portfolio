'use client';

import { useState } from 'react';

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigator.clipboard.writeText('hertzlenin.miscreola@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer id="floor-footer" className="absolute bottom-0 left-0 w-full flex justify-center items-center z-50 pointer-events-none">
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 bg-black/70 px-5 py-3 sm:py-2 border-t border-white/10 shadow-xl pointer-events-auto w-full">
        
        <span className="font-upheaval text-white text-xs tracking-[0.15em] select-none py-1 sm:py-0">
          MADE WITH LOVE {"<3"}
        </span>
        
        <span className="hidden sm:inline text-white/30">|</span>
        
        <button
          onClick={handleCopyEmail}
          className="font-upheaval text-[var(--yellow,yellow)] hover:text-white transition-colors text-xs tracking-[0.15em] cursor-pointer active:scale-95 duration-100 py-1.5 sm:py-0 px-3 w-full sm:w-auto text-center"
        >
          {copied ? 'COPIED!' : 'hertzlenin.miscreola@gmail.com'}
        </button>

        <span className="hidden sm:inline text-white/30">|</span>
        
        <div className="flex items-center justify-center gap-4 sm:gap-3 w-full sm:w-auto border-t border-white/10 pt-2 mt-1 sm:border-0 sm:pt-0 sm:mt-0">
          <a
            href="https://github.com/Lenicon"
            target="_blank"
            rel="noopener noreferrer"
            className="font-upheaval text-[var(--yellow,yellow)] hover:text-white transition-colors text-xs tracking-[0.15em] py-1 px-2 text-center"
          >
            GITHUB
          </a>

          <span className="text-white/30 sm:hidden">|</span>
          <span className="hidden sm:inline text-white/30">|</span>

          <a
            href="https://lenicon.itch.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-upheaval text-[var(--yellow,yellow)] hover:text-white transition-colors text-xs tracking-[0.15em] py-1 px-2 text-center"
          >
            ITCH.IO
          </a>
        </div>
      </div>

    </footer>
  );
}