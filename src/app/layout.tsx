import './globals.css'

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Len.icon',
  description: 'Portfolio of Hertz Miscreola (Len.icon) - A computer science graduate experienced in web and game development.',
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