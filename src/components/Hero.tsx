'use client';

import dynamic from 'next/dynamic';

const SpinningSphere = dynamic(() => import('./SpinningSphere'), {
  ssr: false,
  loading: () => (
    <div className="w-48 h-48 md:w-80 md:h-80 flex items-center justify-center">
      <div className="w-24 h-24 border-4 border-t-blue-500 border-slate-700 rounded-full animate-spin" />
    </div>
  )
});

export default function Hero() {
  return (
    <section className="w-full h-screen flex items-center justify-center bg-slate-950 text-white px-4 overflow-hidden select-none">
      
      <div className="flex flex-row items-center justify-center gap-4 sm:gap-8 md:gap-12 max-w-full">
        
        <h1 className="text-9xl sm:text-9xl md:text-[10rem] lg:text-[20rem] font-upheaval text-[#f5d151] leading-none m-0 p-0">
          LEN
        </h1>
        
        <div className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-[350px] lg:h-[350px] flex items-center justify-center overflow-visible">
          <SpinningSphere />
        </div>

      </div>

    </section>
  );
}