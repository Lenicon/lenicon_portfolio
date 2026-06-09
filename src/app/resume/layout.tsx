
import styles from '@/styles/resume.module.css';

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.pageContainer}>
      {children}
    </div>
  );
}