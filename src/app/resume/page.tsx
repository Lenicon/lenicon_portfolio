"use client";

import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import TransitionLink from "@/components/TransitionLink";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

export default function PageComponent() {
  const resumePath = "/resume.pdf";
  const [isMounted, setIsMounted] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        const paddingOffset = 16; 
        const calculatedWidth = containerRef.current.clientWidth - paddingOffset;
        
        setContainerWidth(calculatedWidth > 0 ? calculatedWidth : 600);
      }
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [isMounted]);

  return ( 
  <section className="overflow-hidden h-full flex flex-col justify-center items-center pt-5 px-5 sm:p-10 gap-10 lg:gap-16 overflow-x-hidden min-h-screen relative">

    <div className="w-full max-w-[60rem] bg-white border-4 border-black shadow-[-8px_8px_0px_0px_black] sm:shadow-[-12px_12px_0px_0px_black] rounded-lg overflow-hidden flex flex-col">
      <div className="w-full bg-black text-white px-4 py-2 font-dos text-sm tracking-wide select-none">
        Resume-Hertz-Lenin-C.-Miscreola-GENERAL.PDF
      </div>
      
      <div 
        ref={containerRef}
        className="w-full p-2 bg-[#f0f0f0] overflow-x-auto flex justify-center min-h-[500px]"
      >
        {isMounted ? (
          <Document
            file={resumePath}
            externalLinkTarget="_blank"
            loading={<p className="font-dos text-sm p-4 text-center mt-10">Loading interactive UI...</p>}
          >
            <Page 
              {...({
                pageNumber: 1,
                renderAnnotationLayer: true,
                renderTextLayer: true,
                width: containerWidth,
                className: "max-w-full"
              } as any)}
            />
          </Document>
        ) : (
          <p className="font-dos text-sm p-4 text-center mt-10">Initializing document viewer...</p>
        )}
      </div>
    </div>

    {/* FOR ICONS */}
    <div className="w-full max-w-[40rem] flex flex-wrap gap-4 items-center justify-center mt-2">
      <svg className="absolute w-0 h-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* FOREGROUND OUTLINE */}
          <filter id="img-black-outline" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feMorphology in="SourceAlpha" result="expanded" operator="dilate" radius="4" />
            <feFlood floodColor="black" result="black-color" />
            <feComposite in="black-color" in2="expanded" operator="in" result="solid-outline" />
            <feComposite in="SourceGraphic" in2="solid-outline" operator="over" />
          </filter>

          {/* BACKGROUND SHADOW */}
          <filter id="img-black-shadow" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feMorphology in="SourceAlpha" result="expanded" operator="dilate" radius="4" />
            <feFlood floodColor="black" result="black-color" />
            <feComposite in="black-color" in2="expanded" operator="in" />
          </filter>
        </defs>
      </svg>
    </div>

    {/* DOWNLOAD BUTTON */}
    <a 
      href={resumePath} 
      download="Resume-Hertz-Lenin-C.-Miscreola-GENERAL.pdf" 
      className="group fixed top-5 right-18 lg:top-5 lg:right-25 w-[30px] h-[30px] lg:w-[50px] lg:h-[50px] z-50 cursor-pointer select-none"
    >
      <img 
        src="/images/about/icons/download.png" 
        alt=""
        aria-hidden="true"
        className="hidden md:block absolute inset-0 w-full h-full object-contain pointer-events-none -translate-x-[6px] translate-y-[6px]"
        style={{ filter: 'url(#img-black-shadow)' }}
      />

      <img 
        src="/images/about/icons/download.png" 
        alt="Download Resume"
        className="relative w-full h-full object-contain block group-hover:-translate-y-1 group-hover:translate-x-1"
        style={{ filter: 'url(#img-black-outline)'}}
      />
    </a>

    {/* HOME BUTTON */}
    <TransitionLink backgroundStyle="background-space" href="/" className="group fixed top-5 right-7 lg:top-5 lg:right-5 w-[30px] h-[30px] lg:w-[50px] lg:h-[50px] z-50 cursor-pointer select-none">
      <img 
        src="/images/about/icons/tent.png" 
        alt=""
        aria-hidden="true"
        className="hidden md:block absolute inset-0 w-full h-full object-contain pointer-events-none -translate-x-[6px] translate-y-[6px]"
        style={{ filter: 'url(#img-black-shadow)' }}
      />

      <img 
        src="/images/about/icons/tent.png" 
        alt="Home"
        className="relative w-full h-full object-contain block group-hover:-translate-y-1 group-hover:translate-x-1"
        style={{ filter: 'url(#img-black-outline)'}}
      />
    </TransitionLink>
  </section>
  );
}