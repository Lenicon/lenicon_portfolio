"use client";

import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ResumePDFProps {
  resumePath: string;
  containerWidth: number;
}

export default function ResumePDF({ resumePath, containerWidth }: ResumePDFProps) {
  return (
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
  );
}