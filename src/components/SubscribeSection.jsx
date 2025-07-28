import SubscribeForm from "./SuscribeForm";
import huella from "../assets/images/huellita2.png";

export default function SubscribeSection() {
  return (
    <section
      id="booking"
      className="relative py-24 px-6 bg-[#AE29FF]"
    >
      {/* Huellas decorativas  */}
      <div
        className="
          hidden sm:flex flex-row gap-4    
          absolute left-6 top-1/2
          -translate-y-1/2
          pointer-events-none 
        "
      >
        <img src={huella} alt="" className="w-20 sm:w-24 lg:w-28" />
        <img src={huella} alt="" className="w-20 sm:w-24 lg:w-28" />
        <img src={huella} alt="" className="w-20 sm:w-24 lg:w-28" />
      </div>


      <div
        className="
          hidden sm:flex flex-row gap-4
          absolute right-6 top-1/2
          -translate-y-1/2
          pointer-events-none 
        "
      >
        <img
          src={huella}
          alt=""
          className="w-20 sm:w-24 lg:w-28 -scale-x-100"
        />
        <img
          src={huella}
          alt=""
          className="w-20 sm:w-24 lg:w-28 -scale-x-100"
        />
        <img
          src={huella}
          alt=""
          className="w-20 sm:w-24 lg:w-28 -scale-x-100"
        />
      </div>
   

      <h2 className="text-3xl lg:text-5xl font-bold text-center mb-8 text-white">
        ¡Suscríbete para recibir nuestras promociones!
      </h2>

      <div
        className="
          relative z-10                 
          max-w-xl mx-auto p-8 sm:p-10
          bg-[#3C0260]
          rounded-3xl
          shadow-lg
          border-4 border-gray-50
          overflow-hidden
        "
      >
        <SubscribeForm />
      </div>
    </section>
  );
}
