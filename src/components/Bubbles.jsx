import { useMemo } from "react";

/**
 * Genera `count` burbujas, cada una con tamaño, posición,
 * delay y duración aleatorios.
 */
export default function Bubbles({ count = 40 }) {
  const bubbles = useMemo(() => {
    const sizes = ["sm", "md", "lg"];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: sizes[Math.floor(Math.random() * sizes.length)],
      left: Math.random() * 100,             // %
      top: 70 + Math.random() * 25,          // 70-95 % → parte baja
      delay: Math.random() * 20,             // 0-20 s
      duration: 12 + Math.random() * 12,     // 12-24 s
    }));
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {bubbles.map(({ id, size, left, top, delay, duration }) => (
        <div
          key={id}
          className={`bubble bubble--${size}`}
          style={{
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        />
      ))}
    </div>
  );
}
