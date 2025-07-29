import "./SuscribeForm.css";
import { FaPaw } from "react-icons/fa";

export default function SubscribeForm() {
  const actionUrl =
    "https://escuelakairos.us13.list-manage.com/subscribe/post?u=32987657571082e7578640d51&id=4af111f466&f_id=00c303e9f0";

  const baseInput = `
    w-full pl-12 pr-5 py-3 rounded-xl
    bg-[#3C0260] border-2 border-white/40
    placeholder-gray-400 text-gray-100
    focus:outline-none focus:border-gray-100 focus:ring-2 focus:ring-gray-300/70
    transition-all duration-300 hover:border-gray-300
    shadow-sm text-base md:text-lg
  `;

  return (
    <form
      action={actionUrl}
      method="post"
      target="_blank"          
      noValidate
      className="flex flex-col gap-5 relative"
    >
      {/* ——— Nombre ——— */}
      <div className="input-group">
        <label htmlFor="FNAME" className="block text-gray-200 font-medium mb-1 ml-1">
          Nombre *
        </label>
        <div className="relative">
          <FaPaw className="paw-icon absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            id="FNAME"
            name="FNAME"
            placeholder="Ingresa tu nombre"
            required
            className={baseInput}
          />
        </div>
      </div>

      {/* ——— Teléfono ——— */}
      <div className="input-group">
        <label htmlFor="PHONE" className="block text-gray-200 font-medium mb-1 ml-1">
          Teléfono *
        </label>
        <div className="relative">
          <FaPaw className="paw-icon absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            id="PHONE"
            name="PHONE"         
            type="tel"
            inputMode="tel"
            pattern="^\\+?[0-9]{8,15}$"
            placeholder="+56997835010"
            required
            className={baseInput}
          />
        </div>
      </div>

      {/* ——— Correo ——— */}
      <div className="input-group">
        <label htmlFor="EMAIL" className="block text-gray-200 font-medium mb-1 ml-1">
          Correo electrónico *
        </label>
        <div className="relative">
          <FaPaw className="paw-icon absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            id="EMAIL"
            name="EMAIL"
            type="email"
            placeholder="tucorreo@ejemplo.com"
            required
            className={baseInput}
          />
        </div>
      </div>

      {/*  Honeypot invisible */}
      <div aria-hidden="true" className="absolute -left-[5000px]">
        <input
          name="b_32987657571082e7578640d51_4af111f466" 
          tabIndex="-1"
          defaultValue=""
        />
      </div>

      {/* ——— Botón ——— */}
      <button
        type="submit"
        className="
          wiggle-btn self-center mt-4 px-10 py-3 rounded-full
          font-bold text-lg
          bg-white text-[#AE29FF] hover:bg-gray-100
          transition-all duration-300 shadow-md hover:shadow-lg
          w-full sm:w-auto
        "
      >
        ¡Suscríbeme!
      </button>
    </form>
  );
}
