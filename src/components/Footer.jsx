import logo from "../assets/images/logofullmasc.png";

export default function Footer() {
  return (
    <footer className="relative bg-gray-50 py-12 px-6">
      <img
        src={logo}
        alt="Full Mascotas"
        className="
          absolute left-6 top-6          
          w-22 h-22 sm:w-66 sm:h-66      
          rounded-full object-cover
          shadow-lg border-4 border-gray-200/60
        "
      />

      {/* Contenido centrado (título + mapa) */}
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
        {/* Título */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[#AE29FF] mt-4 sm:mt-0">
          Encuéntranos en
        </h2>

        {/* Mapa — tamaño compacto (4 : 3) */}
        <div className="w-full max-w-lg aspect-[4/3] overflow-hidden rounded-3xl shadow-lg border-4 border-gray-200/60">
          <iframe
            title="Ubicación Full Mascotas"
            src="https://maps.google.com/maps?q=Pedro%20de%20Oña%20071,%20Ñuñoa,%20Santiago%20de%20Chile&z=16&output=embed"
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </footer>
  );
}
