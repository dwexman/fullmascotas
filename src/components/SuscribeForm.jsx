import "./SuscribeForm.css";
import { FaPaw } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";

/* -------- utils de validación (Chile) -------- */
const CL_PHONE_REGEX = /^\+56\d{9}$/; // +56 seguido de 9 dígitos (ej: +56912345678)

function sanitizePhone(v = "") {
  let s = String(v).replace(/[^\d+]/g, "");
  if (s.includes("+")) s = "+" + s.replace(/\+/g, ""); // colapsa múltiples '+'
  return s;
}
function normalizePhone(v = "") {
  let s = String(v).replace(/\s+/g, "");
  if (!s) return s;
  if (s.startsWith("+569")) return s;
  if (s.startsWith("+56")) return s;
  if (s.startsWith("569")) return "+" + s;
  if (s.startsWith("56")) return "+" + s;
  if (s.startsWith("09")) return "+569" + s.slice(2);
  if (s.startsWith("9"))  return "+569" + s.slice(1);
  return s;
}
function validEmail(v = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export default function SubscribeForm() {
  const actionUrl =
    "https://escuelakairos.us13.list-manage.com/subscribe/post?u=32987657571082e7578640d51&id=4af111f466&f_id=00c303e9f0";

  const alertTheme = "green"; 

  const baseInput = `
    w-full pl-12 pr-5 py-3 rounded-xl
    bg-[#3C0260] border-2 border-white/40
    placeholder-gray-400 text-gray-100
    focus:outline-none focus:border-gray-100 focus:ring-2 focus:ring-gray-300/70
    transition-all duration-300 hover:border-gray-300
    shadow-sm text-base md:text-lg
  `;

  const formRef = useRef(null);
  const [toastOpen, setToastOpen] = useState(false);

  // states de inputs
  const [name, setName]   = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // estados de error (mostramos tras blur o intento de submit)
  const [touched, setTouched] = useState({ name: false, phone: false, email: false });
  const [submitted, setSubmitted] = useState(false);

  // valores normalizados para validar
  const phoneSanitized  = sanitizePhone(phone);
  const phoneNormalized = normalizePhone(phoneSanitized);

  const nameOk  = name.trim().length > 0;
  const phoneOk = CL_PHONE_REGEX.test(phoneNormalized);
  const emailOk = validEmail(email);
  const formOk  = nameOk && phoneOk && emailOk;

  function onBlurPhone() {
    const norm = normalizePhone(sanitizePhone(phone));
    if (norm !== phone) setPhone(norm);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setTouched({ name: true, phone: true, email: true });

    if (!formOk) return; // bloquea envío si hay errores

    // Envío real a Mailchimp en iframe oculto (sin navegar)
    formRef.current?.submit();

    // feedback al usuario
    setToastOpen(true);
    // limpia el form visualmente
    setTimeout(() => formRef.current?.reset(), 0);
    setName(""); setPhone(""); setEmail("");
    setSubmitted(false);
    setTouched({ name: false, phone: false, email: false });
  }

  return (
    <>
      {/* IFRAME oculto: Mailchimp responde aquí sin cambiar de página */}
      <iframe name="mc_iframe" title="mc_iframe" style={{ display: "none" }} />

      <form
        ref={formRef}
        action={actionUrl}
        method="post"
        target="mc_iframe"
        noValidate
        onSubmit={handleSubmit}
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
              className={`${baseInput} ${submitted || touched.name ? (nameOk ? "border-emerald-400" : "border-red-400") : ""}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              autoComplete="name"
            />
          </div>
          {(submitted || touched.name) && !nameOk && (
            <p className="mt-1 text-sm text-red-300">Ingresa tu nombre.</p>
          )}
        </div>

        {/* ——— Teléfono ——— */}
        <div className="input-group">
          <label htmlFor="PHONE" className="block text-gray-200 font-medium mb-1 ml-1">
            Teléfono (WhatsApp) *
          </label>
          <div className="relative">
            <FaPaw className="paw-icon absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              id="PHONE"
              name="PHONE"
              type="tel"
              inputMode="tel"
              placeholder="+56912345678"
              required
              className={`${baseInput} ${submitted || touched.phone ? (phoneOk ? "border-emerald-400" : "border-red-400") : ""}`}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => { setTouched((t) => ({ ...t, phone: true })); onBlurPhone(); }}
              autoComplete="tel"
            />
          </div>
          {(submitted || touched.phone) && !phoneOk && (
            <p className="mt-1 text-sm text-red-300">
              Formato requerido: <b>+56</b> seguido de <b>9 dígitos</b> (ej: <b>+56912345678</b>).
            </p>
          )}
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
              className={`${baseInput} ${submitted || touched.email ? (emailOk ? "border-emerald-400" : "border-red-400") : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              autoComplete="email"
            />
          </div>
          {(submitted || touched.email) && !emailOk && (
            <p className="mt-1 text-sm text-red-300">Ingresa un correo válido.</p>
          )}
        </div>

        {/* Honeypot invisible (Mailchimp) */}
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
          disabled={!formOk}
          className={`
            wiggle-btn self-center mt-4 px-10 py-3 rounded-full
            font-bold text-lg transition-all duration-300 shadow-md hover:shadow-lg
            w-full sm:w-auto
            ${formOk ? "bg-white text-[#AE29FF] hover:bg-gray-100" : "bg-white/60 text-[#AE29FF]/60 cursor-not-allowed"}
          `}
        >
          ¡Suscríbeme!
        </button>
      </form>

      {/* Toast de éxito */}
      <Toast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        theme={alertTheme}
        title="¡Formulario enviado!"
        message="Gracias por suscribirte 🐾"
        duration={4000}
      />
    </>
  );
}

/* ---------- Toast interno ---------- */
function Toast({ open, onClose, theme = "green", title, message, duration = 4000 }) {
  const [show, setShow] = useState(open);

  useEffect(() => setShow(open), [open]);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      setShow(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(t);
  }, [show, duration, onClose]);

  if (!show) return null;

  const t = theme === "pink"
    ? {
        wrapper: "bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white ring-1 ring-fuchsia-300/40 shadow-xl",
        iconWrap: "bg-white/20 text-white",
        bar: "bg-fuchsia-300/70",
      }
    : {
        wrapper: "bg-emerald-600 text-white ring-1 ring-emerald-300/50 shadow-xl",
        iconWrap: "bg-white/20 text-white",
        bar: "bg-emerald-300/70",
      };

  return (
    <div
      className="fixed z-[1000] bottom-6 left-1/2 -translate-x-1/2 px-3 sm:px-0"
      role="status"
      aria-live="polite"
    >
      <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 ${t.wrapper}`}>
        {/* Icono check */}
        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full ${t.iconWrap}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>

        {/* Texto */}
        <div className="text-sm">
          <div className="font-semibold leading-tight">{title}</div>
          {message && <div className="opacity-95 leading-tight">{message}</div>}
        </div>
      </div>

      {/* Barra de tiempo */}
      <div className="h-1 overflow-hidden rounded-b-2xl">
        <div
          className={`h-full ${t.bar} transition-[width] duration-[4000ms] ease-linear`}
          style={{ width: "0%" }}
        />
      </div>
    </div>
  );
}
