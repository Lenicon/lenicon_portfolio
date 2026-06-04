'use client';

import dynamic from 'next/dynamic';
import Laptop from './Laptop';
import Link from 'next/link';

const IconSphere = dynamic(() => import('./IconSphere'), {
  ssr: false,
  loading: () => (
    <img className="w-full h-full" src="/images/icon-sphere-placeholder.png" alt="Icon Sphere" />
  )
});

export default function Hero() {
  return (
    <section className="w-full h-screen flex items-center justify-center text-white px-4 overflow-hidden select-none background-space">

      <div className="flex flex-row items-center justify-center gap-4 sm:gap-8 md:gap-12 max-w-full">
        
        <h1 className="text-9xl sm:text-[12rem] md:text-[15rem] lg:text-[20rem] font-upheaval text-[var(--yellow)] leading-none m-0 p-0">
          LEN
        </h1>
        

        {/* ICON SPHERE */}
        <Link href="/about" className="group block relative">
          <div className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-[350px] lg:h-[350px] items-center justify-center overflow-visible">
            <IconSphere />
            
          </div>

          <div className="absolute -bottom-16 sm:-bottom-24 md:-bottom-28 lg:-bottom-32 left-1/2 -translate-x-1/2 w-[200%] h-24 sm:h-32 md:h-40 pointer-events-none overflow-visible opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out">
            
            <svg 
              viewBox="0 0 500 200" 
              className="w-full h-full overflow-visible"
            >
              <defs>
                <path 
                  id="textCurveResponsive" 
                  d="M 25,35 Q 250,155 475,35" 
                  fill="transparent" 
                />
              </defs>
              
              <text className="fill-[var(--yellow)] font-upheaval text-[28px] sm:text-[42px] md:text-[52px] lg:text-[64px] tracking-[0.1em]">
                <textPath href="#textCurveResponsive" startOffset="50%" textAnchor="middle">
                  WHO AM I?
                </textPath>
              </text>
            </svg>

          </div>

        </Link>

      </div>


      {/* LAPTOP */}
      <Link 
        href="/projects" 
        className="group absolute top-4 right-4 sm:top-8 sm:right-8 md:top-12 md:right-12 block"
      >
        <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex items-center justify-center overflow-visible">
          <Laptop/>
        </div>

        <div className="absolute bottom-0 sm:bottom-0 md:bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-[var(--blue)] font-upheaval tracking-[0.1em] text-center pointer-events-none opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out text-[14px] sm:text-[18px] md:text-[22px] lg:text-[26px]">
          PROJECTS
        </div>
      </Link>

    </section>
  );
}