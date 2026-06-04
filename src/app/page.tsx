
import Hero from '@/components/Hero';

export default function Home() {
  return ( 
    <>
      <Hero/>
      <section className="w-full h-screen flex items-center justify-center bg-foreground text-background px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center">
          Welcome to the LEN Portfolio!
        </h2>
      </section>
    </>
  );
}