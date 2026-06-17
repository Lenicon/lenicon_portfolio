import '../styles/globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Len.icon',
  description: 'A whimsical portfolio created by Hertz Miscreola (Len.icon), Builder of Dreams. Come visit and write a letter!',
  keywords: ['Web Developer', 'Next.js', 'Portfolio', 'Hertz Miscreola', 'Len.icon', 'Lenicon', "Game Developer", "Developer", "Games", "Fun", "Len"],
  verification: {
    google: "jt6JJFqMzv_eMk4EEFBJw4Fkre3WHd7G3mzy2KF1EvY"
  },

  openGraph: {
    title: "Len.icon",
    description: "A whimsical portfolio created by Hertz Miscreola (Len.icon), Builder of Dreams. Come visit and write a letter!",
    url: "https://lenicondev.web.app",
    siteName: "Len.icon",
    images: [
      {
        url: "https://lenicondev.web.app/images/og-preview.png",
        width: 1918,
        height: 1078,
        alt: "Len.icon Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },

  twitter: {
    card: "summary_large_image",
    title: "Len.icon",
    description: "A whimsical portfolio created by Hertz Miscreola (Len.icon), Builder of Dreams. Come visit and write a letter!",
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              'name': 'Len.icon',
              'alternateName': 'LeniconDev',
              'url': 'https://lenicondev.web.app/',
            }),
          }}
        />
      </head>
      <body>

        <main>
        {children}
        </main>
      </body>
    </html>
  )
}