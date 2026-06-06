import { yearsFrom } from "@/utils";
import Link from "next/link";

export default function Page() {
  return (
    // lg:flex-row splits the screen on desktop. items-start keeps content neat.
    <section className="flex flex-col lg:flex-row items-center lg:items-start justify-center p-5 sm:p-10 gap-10 lg:gap-16 overflow-x-hidden">
      
      {/* LEFT COLUMN: Textboxes & Icons */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-end gap-8">
        
        {/* Name Card */}
        <div className="w-full max-w-[40rem] ml-5 flex flex-col gap-2 sm:gap-3 text-justify p-8 bg-white border-4 border-black shadow-[-8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[-12px_12px_0px_0px_rgba(0,0,0,1)] rounded-lg">
            <p className="text-2xl sm:text-4xl font-extrabold text-center uppercase">Hertz Lenin C. Miscreola</p>
            <p className="text-lg sm:text-xl font-semibold text-center">Game / Web / Software Developer</p>
        </div>

        {/* Story Card */}
        <div className="w-full ml-5 max-w-[40rem] flex flex-col gap-5 text-justify p-8 bg-white border-4 border-black shadow-[-8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[-12px_12px_0px_0px_rgba(0,0,0,1)] rounded-lg">
          <p className="text-base sm:text-lg">
            I have honed my craft ever since I touched a book about programming back in elementary, so it's been around <b>{yearsFrom(2016)} years</b> or so.
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

        {/* Icons Grid */}

          <div className="w-full max-w-[40rem] flex flex-wrap gap-4 items-center justify-center">
            
            {[
              { name: 'mail', url: 'mailto:hertzlenin.miscreola@gmail.com' },
              { name: 'resume', url: '/resume.pdf' },
              { name: 'linkedin', url: 'https://www.linkedin.com/in/hertzleninmiscreola/' },
              { name: 'itch.io', url: 'https://lenicon.itch.io' },
              { name: 'github', url: 'https://github.com/Lenicon' }
            ].map((item) => (
              
              <Link 
                key={item.name} 
                href={item.url}
                target={item.url.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="w-[80px] sm:w-[100px] flex flex-col gap-2 justify-center items-center text-center p-3 sm:p-5 bg-white border-4 border-black shadow-[-6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[-8px_8px_0px_0px_rgba(0,0,0,1)] rounded-lg transition-all duration-150 hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-10px_10px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[-12px_12px_0px_0px_rgba(0,0,0,1)] cursor-pointer select-none"
              >
                {/* <img src={`/icons/${item.name}.png`} alt={item.name} className="w-8 h-8 pointer-events-none" /> */}
                <span className="text-sm sm:text-base font-bold text-black no-underline">
                  {item.name}
                </span>
              </Link>

            ))}

          </div>
      
      </div>

      {/* RIGHT COLUMN: Giant Image */}
      <div className="w-full lg:w-1/2 flex justify-center lg:justify-start items-center mt-6 lg:mt-0 lg:sticky lg:top-10">
        {/* On desktop, lg:sticky will make your photo stay pinned in place nicely while you scroll the text boxes */}
        <img 
          className="w-[75%] sm:w-[60%] lg:w-[90%] max-w-2xl object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)]" 
          src="/images/about/who-am-i.png" 
          alt="Hertz Lenin" 
        />
      </div>

    </section>
  )
}