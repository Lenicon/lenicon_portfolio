import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import styles from '@/styles/home.module.css';

export default function Home() {
  return ( 
    <div className={styles.pageContainer}>
      <Hero/>
      <Footer/>
    </div>
  );
}