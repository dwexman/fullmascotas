import { FaBath, FaCut, FaPaw } from "react-icons/fa";
import { GiDogBowl, GiComb } from "react-icons/gi";
import { motion } from "framer-motion";

import lavadoImg from "../assets/images/lavado.png";
import unasImg from "../assets/images/unas.png";
import deslanadoImg from "../assets/images/deslanado.png";
import secadoImg from "../assets/images/secado.png";

const services = [
  {
    title: "Baño",
    Icon: FaBath,
    img: lavadoImg,        
    desc: "Gran baño de higiene y relajación",
    colorFrom: "from-pink-400",
    colorTo: "to-fuchsia-600",
  },
  {
    title: "Corte de Pelo Fashion",
    Icon: FaCut,
    img: unasImg,          
    desc: "Cortes según su raza",
    colorFrom: "from-orange-400",
    colorTo: "to-amber-600",
  },
  {
    title: "Secado Especial",
    Icon: GiComb,
    img: secadoImg,
    desc: "Turbina silenciosa",
    colorFrom: "from-cyan-400",
    colorTo: "to-teal-600",
  },
  {
    title: "Deslanado peludito",
    Icon: GiDogBowl,
    img: deslanadoImg,
    desc: "Eliminamos el exceso de pelo muerto",
    colorFrom: "from-lime-400",
    colorTo: "to-emerald-600",
  },
  {
    title: "Perfilado peludito",
    Icon: FaPaw,
    desc: "Recorte fino para mantener la forma",
    colorFrom: "from-violet-400",
    colorTo: "to-indigo-600",
  },
  {
    title: "Limpieza Oídos",
    Icon: FaPaw,
    desc: "Con mucho cuidado y delicadeza",
    colorFrom: "from-sky-400",
    colorTo: "to-blue-600",
  },
];

export default function Services() {
  return (
    <section className="py-24 px-6 bg-gray-50" id="services">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-16">
        Nuestros Servicios
      </h2>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {services.map(
          ({ title, Icon, img, desc, colorFrom, colorTo }) => (
            <motion.article
              key={title}
              whileHover={{ y: -8, rotate: -1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className={`${colorFrom} ${colorTo} bg-gradient-to-br rounded-3xl p-[3px] shadow-lg`}
            >
              {/* inner card */}
              <div className="bg-white rounded-[inherit] h-full p-8 flex flex-col text-center">
                <div className="mx-auto mb-6 grid place-items-center h-60 w-60 rounded-full bg-gradient-to-br from-white/50 to-white/10 overflow-hidden">
                  {img ? (
                    <img
                      src={img}
                      alt={title}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Icon className="text-4xl text-gray-800" />
                  )}
                </div>

                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                <p className="text-gray-600 flex-1">{desc}</p>
              </div>
            </motion.article>
          )
        )}
      </div>
    </section>
  );
}
