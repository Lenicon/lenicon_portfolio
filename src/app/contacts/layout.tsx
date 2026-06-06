
import styles from '@/styles/contacts.module.css';

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.pageContainer}>
      {children}
    </div>
  );
}