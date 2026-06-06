
import styles from '@/styles/projects.module.css';

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.pageContainer}>
      {children}
    </div>
  );
}