
import styles from '@/styles/about.module.css';


import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hertz Lenin C. Miscreola | Len.icon'
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.pageContainer}>
      {children}
    </div>
  );
}