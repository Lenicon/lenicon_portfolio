
import styles from '@/styles/projects.module.css';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Projects OS | Len.icon'
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.pageContainer}>
      {children}
    </div>
  );
}