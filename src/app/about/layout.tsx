
import styles from '@/styles/about.module.css';

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.pageContainer}>
      {children}
    </div>
  );
}