import '../styles/globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Len.icon',
  description: 'Portfolio of Hertz Miscreola (Len.icon) - A computer science graduate experienced in web, game, and software development.',
  keywords: ['Web Developer', 'Next.js', 'Portfolio', 'Hertz Lenin C. Miscreola', 'Len.icon', 'Lenicon', "Game Developer"],
  verification: {
    google: "jt6JJFqMzv_eMk4EEFBJw4Fkre3WHd7G3mzy2KF1EvY"
  },
  openGraph: {
    title: "Len.icon",
    description: "Portfolio of Hertz Miscreola (Len.icon) - A computer science graduate experienced in web and game development.",
    url: "https://lenicondev.web.app",
    siteName: "Len.icon",
    images: [
      {
        url: "https://lenicondev.web.app/images/og-preview.png",
        width: 1200,
        height: 630,
        alt: "Len.icon Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Len.icon",
    description: "Portfolio of Hertz Miscreola (Len.icon) - A computer science graduate experienced in web, game, and software development.",
    images: ["https://lenicondev.web.app/images/og-preview.png"],
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>

        <main>
        {children}
        </main>
      </body>
    </html>
  )
}