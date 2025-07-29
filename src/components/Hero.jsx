import foto1pelu from "../assets/images/foto1pelu.png";
import hydra1 from "../assets/images/hydra5.png";
import hydra2 from "../assets/images/hydra1.png";
import hydra3 from "../assets/images/hydra4.png";
import huella from "../assets/images/huellas.png";
import logo from "../assets/images/logofullmasc.png";
import "./Hero.css";

export default function Hero() {
  return (
    <header
      className="relative flex flex-col min-h-screen overflow-hidden text-white"
      style={{ backgroundColor: "#AE29FF" }}
    >
      {/* BURBUJAS */}
      <div className="bubble bubble--sm -left-24  bottom-12   bubble-delay-1" />
      <div className="bubble bubble--md -left-40  bottom-1/4 bubble-delay-2" />
      <div className="bubble bubble--lg -left-48  bottom-1/2 bubble-delay-3" />
      <div className="bubble bubble--sm -left-28  bottom-2/3 bubble-delay-4" />
      <div className="bubble bubble--md -left-36  bottom-[75%] bubble-delay-5" />
      <div className="bubble bubble--lg -left-60  bottom-[85%] bubble-delay-6" />

      {/*  LOGO  */}
      <div className="flex justify-between items-center px-6 py-4">
        <img
          src={logo}
          alt="Full Mascotas logo"
          className="h-40 w-auto rounded-full"
        />
      </div>

      {/* BLOQUE PRINCIPAL */}
      <div className="flex flex-col lg:flex-row flex-1 items-center lg:items-start px-6 lg:px-20 gap-10 lg:gap-16">
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left mt-10 lg:mt-24">
          <h1 className="order-1 slide-in-hero text-4xl sm:text-5xl lg:text-8xl font-extrabold mb-10">
            Full&nbsp;Mascotas Peluquería Canina
          </h1>

          <p className="order-3 lg:order-2 text-lg sm:text-xl lg:text-3xl mb-12 max-w-md lg:max-w-none">
            ¡Baño, corte y mucho cariño! Deja que tu peludo luzca espectacular
            con nuestro servicio profesional de peluquería sin estrés.
          </p>


          <a
            href="#booking"
            className="
    order-4 relative inline-block isolate
    px-10 sm:px-12 py-5
    font-extrabold text-lg sm:text-2xl md:text-3xl lg:text-3xl
    text-white whitespace-nowrap
    bg-[#3C0260]
    rounded-xl                  
    ring-4 ring-pink-400/70 hover:ring-pink-300/80
    shadow-lg hover:bg-[#4B047C]
    transition animate-pulse hover:animate-none
    overflow-hidden             
    group
  "
          >
            {/* TEXTO */}
            <span
              className="
      relative z-20
      drop-shadow-[0_0_4px_rgba(0,0,0,0.6)]
       
    "
            >
              Saber precios y&nbsp;agendamiento
            </span>

            {/* GLOW */}
            <span
              className="
      absolute inset-0
      rounded-xl
      -z-10                   
      blur-md opacity-70
      bg-gradient-to-r from-pink-400 via-fuchsia-500 to-purple-500
      pointer-events-none        
      transition-opacity duration-300
      group-hover:opacity-100
    "
              aria-hidden="true"
            />
          </a>

          <img
            src={huella}
            alt="Huella decorativa"
            className="
              order-5 mt-6
              w-32 sm:w-40 lg:w-48   
              h-auto
              self-center          
              mx-auto              
            "
          />
        </div>

        <div className="order-2 w-full lg:w-1/2 flex justify-center lg:justify-end">
          <img
            src={foto1pelu}
            alt="Perrito luciendo su nuevo corte"
            className="max-w-full h-auto rounded-3xl shadow-xl"
          />
        </div>
      </div>

      {/*  PRODUCTOS HYDRA */}
      <section className="px-6 mt-10 lg:mt-40">
        <h3 className="text-2xl lg:text-4xl font-bold text-center mb-8">
          Solo usamos los mejores productos
        </h3>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
          <img
            src={hydra1}
            alt="Hydra producto 1"
            className="h-40 sm:h-48 lg:h-72 w-auto object-contain rounded-3xl shadow-xl"
          />
          <img
            src={hydra2}
            alt="Hydra producto 2"
            className="h-40 sm:h-48 lg:h-72 w-auto object-contain rounded-3xl shadow-xl"
          />
          <img
            src={hydra3}
            alt="Hydra producto 3"
            className="h-40 sm:h-48 lg:h-72 w-auto object-contain rounded-3xl shadow-xl"
          />
        </div>
      </section>
    </header>
  );
}