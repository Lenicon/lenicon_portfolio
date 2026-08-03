import TransitionLink from "@/components/TransitionLink";
import { yearsFrom, getAge } from "@/lib/utils";
import Link from "next/link";


export default function Page() {
  return (
    <section className="overflow-hidden flex flex-col lg:flex-row items-center lg:items-start lg:justify-start pt-5 px-5 sm:p-10 sm:p-10 gap-10 lg:gap-16 overflow-x-hidden min-h-screen relative">
      
      <div className="w-full lg:w-1/2 ml-5 flex flex-col items-center lg:items-start gap-8 z-10">
        
        {/* NAME CARD */}
        <div className="w-full max-w-[40rem] flex flex-col gap-2 sm:gap-3 text-justify p-8 bg-white border-4 border-black shadow-[-8px_8px_0px_0px_black] sm:shadow-[-12px_12px_0px_0px_black] rounded-lg">
            <p className="text-2xl sm:text-4xl font-extrabold text-center uppercase">Hertz Lenin C. Miscreola</p>
            <p className="text-lg sm:text-xl font-semibold text-center">Game / Web / Software Developer</p>
        </div>

        {/* INFO CARD */}
        <div className="w-full max-w-[40rem] flex flex-col gap-5 text-justify p-8 bg-white border-4 border-black shadow-[-8px_8px_0px_0px_black] sm:shadow-[-12px_12px_0px_0px_black] rounded-lg">
          <p className="text-base sm:text-lg">
            I have honed my craft ever since I touched a book about programming back in elementary and I'm currently <b>{getAge("2006-08-08")} years old</b>, so it's been around <b>{yearsFrom(2016)} years</b> or so.
          </p>
          <p className="text-base sm:text-lg">
            I have built many games in <a href="https://lenicon.itch.io" target="_blank" rel="noopener noreferrer" className="text-[#fa5c5c] font-bold hover:underline">itch.io</a> and have worked on a multitude of projects in <a href="https://github.com/Lenicon" target="_blank" rel="noopener noreferrer" className="text-[#24292E] font-bold hover:underline">Github</a>.
            Most of them were created using a broken 3.85 GB RAM potato laptop passed down from my mother to my sister to me, it could hardly run 2 programs.
            <b> I managed to maximize what I could do with little to no resources</b>.
          </p>
          <p className="text-base sm:text-lg">
            Overall, I'm a simple guy from the Philippines who likes to laugh and create stuff.<b> Hit me up if you need anything!</b> 
          </p>
        </div>

        {/* FOR ICONS  */}
        <div className="w-full max-w-[40rem] flex flex-wrap gap-4 items-center justify-center mt-2">
          
          <svg className="absolute w-0 h-0" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="img-black-outline" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
                <feMorphology in="SourceAlpha" result="expanded" operator="dilate" radius="4" />
                <feFlood floodColor="black" result="black-color" />
                <feComposite in="black-color" in2="expanded" operator="in" result="solid-outline" />
                <feComposite in="SourceGraphic" in2="solid-outline" operator="over" />
              </filter>

              <filter id="img-black-shadow" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
                <feMorphology in="SourceAlpha" result="expanded" operator="dilate" radius="4" />
                <feFlood floodColor="black" result="black-color" />
                <feComposite in="black-color" in2="expanded" operator="in" />
              </filter>
            </defs>
          </svg>

          {[
            { name:'hertzlenin.miscreola@gmail.com', src: 'mail.png', url: 'mailto:hertzlenin.miscreola@gmail.com' },
            { name:'Resume', src: 'resume.png', url: '/resume' },
            { name:'LinkedIn', src: 'linkedin.png', url: 'https://www.linkedin.com/in/hertzleninmiscreola/' },
            { name:'Itch.io', src: 'itchio.png', url: 'https://lenicon.itch.io' },
            { name:'Github', src: 'github_white.png', url: 'https://github.com/Lenicon' }
          ].map((item) => (
            item.url.startsWith('http') || item.url.startsWith('mailto') ?
            <Link 
              key={item.name} 
              href={item.url}
              target='_blank'
              rel="noopener noreferrer"
              className="group relative w-[70px] h-[70px] sm:w-[85px] sm:h-[85px] flex items-center justify-center p-1 cursor-pointer select-none"
            >
              <img 
                src={"/images/about/icons/" + item.src}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none -translate-x-[10px] translate-y-[10px]"
                style={{
                  filter: 'url(#img-black-shadow)'
                }}
              />

              <img 
                title={item.name}
                src={"/images/about/icons/" + item.src}
                alt={item.name}
                className="relative w-full h-full object-contain block group-hover:-translate-y-1 group-hover:translate-x-1"
                style={{
                  filter: 'url(#img-black-outline)'
                }}
              />
            </Link>
            :
            <TransitionLink 
              backgroundStyle="background-resume"
              key={item.name} 
              href={item.url}
              className="group relative w-[70px] h-[70px] sm:w-[85px] sm:h-[85px] flex items-center justify-center p-1 cursor-pointer select-none"
            >
              <img 
                src={"/images/about/icons/" + item.src}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none -translate-x-[10px] translate-y-[10px]"
                style={{
                  filter: 'url(#img-black-shadow)'
                }}
              />

              <img 
                title={item.name}
                src={"/images/about/icons/" + item.src}
                alt={item.name}
                className="relative w-full h-full object-contain block group-hover:-translate-y-1 group-hover:translate-x-1"
                style={{
                  filter: 'url(#img-black-outline)'
                }}
              />
            </TransitionLink>
          ))}
        </div>
      
      </div>

      {/* IMAGE */}
      <div className="w-full lg:w-auto flex justify-center mt-10 mb-[-2rem] sm:mb-0 lg:mt-0 lg:fixed lg:bottom-0 lg:-right-[1rem] lg:z-0">
        
        <img 
          className="
            w-[95%] sm:w-[80%] 
            md:w-[70vw] lg:w-[55vw] 
            max-w-none object-contain block origin-bottom-right
            
            " 
          src="/images/about/dude.webp" 
          alt="Hertz Lenin"
          style={{
            filter: 'drop-shadow(4px 0px 0px black) drop-shadow(-4px 0px 0px black) drop-shadow(0px 4px 0px black) drop-shadow(0px -4px 0px black) drop-shadow(-20px 20px 0px black)'
          }}
        />

      </div>

      {/* HOME BUTTON */}
      <TransitionLink backgroundStyle="background-space" href="/" className="group fixed top-7 right-7 lg:top-5 lg:right-5 w-[30px] h-[30px] lg:w-[50px] lg:h-[50px] z-50 cursor-pointer select-none">
        <img 
          src="/images/about/icons/tent.png" 
          alt=""
          aria-hidden="true"
          className="hidden md:block absolute inset-0 w-full h-full object-contain pointer-events-none -translate-x-[6px] translate-y-[6px]"
          style={{ filter: 'url(#img-black-shadow)' }}
        />

        <img 
          src="/images/about/icons/tent.png" 
          alt="Home"
          className="relative w-full h-full object-contain block group-hover:-translate-y-1 group-hover:translate-x-1"
          style={{ filter: 'url(#img-black-outline)'}}
        />
      </TransitionLink>

    </section>
  )
}