import { useMemo } from "react";
import { motion } from "framer-motion";
import frontis   from "../assets/images/frontis.jpg";
import frontis2  from "../assets/images/frontis2.jpg";
import interior1 from "../assets/images/interior.jpg";
import interior2 from "../assets/images/interior2.jpg";
import interior3 from "../assets/images/interior3.jpg";
import interior4 from "../assets/images/interior4.jpg";
import paw       from "../assets/images/huellita2.png";
import "./Hero.css";

const photos = [frontis, frontis2, interior1, interior2, interior3, interior4];

export default function Gallery() {

  const MIN_DIST = 8; 
 
  const NO_ZONE = { topMin: 25, topMax: 45, leftMin: 25, leftMax: 75 };

  const pawCloud = useMemo(() => {
    const quads = [
      { topMin: 0,  topMax: 45, leftMin: 0,  leftMax: 45 },
      { topMin: 0,  topMax: 45, leftMin: 55, leftMax: 100 },
      { topMin: 55, topMax: 100, leftMin: 0,  leftMax: 45 },
      { topMin: 55, topMax: 100, leftMin: 55, leftMax: 100 }
    ];

    const placed = [];

    const tooClose = (t, l) =>
      placed.some(({ top, left }) => {
        const dx = t - top;
        const dy = l - left;
        return Math.hypot(dx, dy) < MIN_DIST;
      });

    const inNoZone = (t, l) =>
      t >= NO_ZONE.topMin &&
      t <= NO_ZONE.topMax &&
      l >= NO_ZONE.leftMin &&
      l <= NO_ZONE.leftMax;

    quads.forEach(({ topMin, topMax, leftMin, leftMax }) => {
      let count = 0;
      let safety = 0;
      while (count < 10 && safety < 500) {
        safety++;
        const top  = topMin  + Math.random() * (topMax  - topMin);
        const left = leftMin + Math.random() * (leftMax - leftMin);
        if (!tooClose(top, left) && !inNoZone(top, left)) {
          placed.push({
            top: `${top}%`,
            left: `${left}%`,
            size: 36 + Math.random() * 36,
            rot: Math.random() * 360
          });
          count++;
        }
      }
    });
    return placed; 
  }, []);

  return (
    <section
      className="relative text-white py-24 px-6 overflow-hidden"
      style={{ backgroundColor: "#AE29FF" }}
    >
      {/*  BURBUJAS  */}
      <div className="bubble bubble--sm -left-24 bottom-12   bubble-delay-1" />
      <div className="bubble bubble--md -left-40 bottom-1/4 bubble-delay-2" />
      <div className="bubble bubble--lg -left-48 bottom-1/2 bubble-delay-3" />
      <div className="bubble bubble--sm -left-28 bottom-2/3 bubble-delay-4" />
      <div className="bubble bubble--md -left-36 bottom-[75%] bubble-delay-5" />
      <div className="bubble bubble--lg -left-60 bottom-[85%] bubble-delay-6" />

      {/*  HUELLITAS  */}
      {pawCloud.map(({ top, left, size, rot }, idx) => (
        <img
          key={idx}
          src={paw}
          alt=""
          className="absolute pointer-events-none select-none"
          style={{
            top,
            left,
            width: `${size}px`,
            transform: `rotate(${rot}deg)`
          }}
        />
      ))}

      {/* TÍTULO  */}
      <div className="relative z-10 flex justify-center mb-16">
        <h2
          className="
            text-3xl lg:text-5xl font-extrabold text-white
            px-8 py-4 bg-[#AE29FF] rounded-2xl
            shadow-[0_12px_24px_rgba(0,0,0,0.35)]
          "
        >
          ¡Así luce nuestro salón!
        </h2>
      </div>

      {/* GALERÍA 3 × 2 */}
      <div className="relative z-10 grid gap-10 max-w-6xl mx-auto
                      sm:grid-cols-2
                      md:grid-cols-3">
        {photos.map((src, i) => (
          <motion.img
            key={i}
            src={src}
            alt={`Galería ${i + 1}`}
            className="w-full h-72 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -8, boxShadow: "0 24px 40px rgba(0,0,0,0.45)" }}
          />
        ))}
      </div>
    </section>
  );
}
