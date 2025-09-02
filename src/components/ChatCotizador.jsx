import React, { useEffect, useMemo, useState } from "react";

/** Lee tu Google Sheet publicado */
const SHEET_ID = "1foqUZfS2adXdXFd2Z3kptwsoP9ITNFwHNIfoJtxp2UM";

/* --------------------- util: fetch CSV de Google Sheets --------------------- */
async function fetchCsv(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    sheetName
  )}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No pude leer la pestaña ${sheetName}`);
  const text = await res.text();
  return csvToObjects(text);
}

function csvToObjects(csv) {
  const rows = [];
  let cur = [], field = "", inQuotes = false;
  const pushField = () => { cur.push(field); field = ""; };
  const pushRow = () => { rows.push(cur); cur = []; };

  for (let i = 0; i < csv.length; i++) {
    const c = csv[i], n = csv[i + 1];
    if (inQuotes) {
      if (c === '"' && n === '"') { field += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { field += c; }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") pushField();
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && n === "\n") i++;
        pushField(); pushRow();
      } else { field += c; }
    }
  }
  if (field.length || cur.length) { pushField(); pushRow(); }

  if (!rows.length) return [];
  const headers = rows[0].map((h) => String(h).trim());
  return rows
    .slice(1)
    .filter((r) => r.some((cell) => String(cell).trim() !== ""))
    .map((r) => {
      const obj = {};
      headers.forEach((h, i) => (obj[h] = r[i] ?? ""));
      return obj;
    });
}

/* --------------------- util: pricing rules --------------------- */
function match(ruleVal, answerVal) {
  const rv = String(ruleVal ?? "").trim().toLowerCase();
  const av = String(answerVal ?? "").trim().toLowerCase();
  return rv === "*" || rv === av;
}
function parseCLP(v) {
  if (v == null) return NaN;
  const s = String(v).replace(/\./g, "").replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}
function computePriceByRules(ans, rules) {
  const cand = rules.filter(
    (r) =>
      match(r.service_key, ans.service) &&
      match(r.size_key, ans.size) &&
      match(r.coat_key, ans.coat_type) &&
      match(r.cond_key, ans.coat_condition)
  );
  if (!cand.length) return 33000; // fallback

  const scored = cand
    .map((r) => {
      const spec =
        (r.service_key !== "*") +
        (r.size_key !== "*") +
        (r.coat_key !== "*") +
        (r.cond_key !== "*");
      const prio = Number(r.priority || 0);
      return { ...r, _spec: spec, _prio: prio };
    })
    .sort((a, b) => b._spec - a._spec || b._prio - a._prio);

  const n = parseCLP(scored[0].price_clp);
  return Number.isFinite(n) ? n : 33000;
}
const CLP = (n) => {
  try { return Number(n).toLocaleString("es-CL"); }
  catch { return String(n); }
};

/* --------------------- util: teléfono CL --------------------- */
const CL_PHONE_REGEX = /^\+56\d{9}$/;
// Limpia todo excepto + y dígitos
function sanitizePhone(v) {
  let s = (v || "").replace(/[^\d+]/g, "");
  // solo un '+' al inicio
  if (s.includes("+")) s = "+" + s.replace(/\+/g, "");
  return s;
}
// Normaliza en blur: 9xxxxxxxx -> +569xxxxxxxx ; 56... -> +56...
function normalizePhone(v) {
  let s = (v || "").replace(/\s+/g, "");
  if (!s) return s;
  if (s.startsWith("+569")) return s;
  if (s.startsWith("+56")) return s;
  if (s.startsWith("569")) return "+" + s;
  if (s.startsWith("56")) return "+" + s;
  if (s.startsWith("09")) return "+569" + s.slice(2);
  if (s.startsWith("9")) return "+569" + s.slice(1);
  return s;
}

/* ========================================================================= */
export default function ChatCotizador({ calendlyUrl, onClose, whatsappUrl }) {
  /* --- datos del sheet --- */
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [services, setServices] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [coatTypes, setCoatTypes] = useState([]);
  const [coatCond, setCoatCond] = useState([]);
  const [rules, setRules] = useState([]);
  const [faqs, setFaqs] = useState([]);


  /* --- conversación --- */
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState("lead"); // empezamos pidiendo datos de contacto
  const [history, setHistory] = useState([]); // pila para volver atrás
  const [free, setFree] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [confirmExit, setConfirmExit] = useState(false);

  /* --- lead --- */
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");

  const phoneSanitized = sanitizePhone(leadPhone);
  const phoneNormalized = normalizePhone(phoneSanitized);
  const phoneValid = CL_PHONE_REGEX.test(phoneNormalized);

  /* --- respuestas --- */
  const [ans, setAns] = useState({
    service: null, size: null, coat_type: null, coat_condition: null, day: null, price: 0,
  });

  /* cargar desde el Sheet */
  useEffect(() => {
    (async () => {
      try {
        const [sv, sz, ct, cc, pr, fq] = await Promise.all([
          fetchCsv("services"),
          fetchCsv("sizes"),
          fetchCsv("coat_types"),
          fetchCsv("coat_condition"),
          fetchCsv("pricing_rules"),
          fetchCsv("faq").catch(() => []),
        ]);
        setServices(sv); setSizes(sz); setCoatTypes(ct); setCoatCond(cc); setRules(pr); setFaqs(fq);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setErr("No pude leer tu Sheet. Asegúrate de publicar el documento completo y revisar nombres de pestaña.");
        setLoading(false);
      }
    })();
  }, []);

  /* helpers chat */
  const pushBot = (html) => setMessages((m) => [...m, { who: "bot", html }]);
  const pushUser = (html) => setMessages((m) => [...m, { who: "user", html }]);

  /* navegación: ir a paso y volver */
  function goTo(next) { setHistory((h) => [...h, step]); setStep(next); }
  function goBack() {
    setHistory((h) => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      setStep(prev);
      return h.slice(0, -1);
    });
  }

  /* saludo del paso lead */
  useEffect(() => {
    if (!loading && !err && step === "lead") {
      setMessages([]);
      pushBot("¡Hola! 👋 Antes de empezar, cuéntame tu <b>nombre</b> y tu <b>WhatsApp</b> (con <b>+56</b>) para registrarte.");
    }
  }, [loading, err, step]);

  /* botones según paso */
  const buttons = useMemo(() => {
    if (step === "menu") {
      return [
        { label: "Cotizar", action: "cotizar" },
        { label: "Ver servicios", action: "servicios" },
        { label: "Preguntas frecuentes", action: "faq" },
      ];
    }
    if (step === "service") return services.map((r) => ({ label: r.label, action: `service:${r.label}` }));
    if (step === "size") return sizes.map((r) => ({ label: r.label, action: `size:${r.label}` }));
    if (step === "coat_type") return coatTypes.map((r) => ({ label: r.label, action: `coat_type:${r.label}` }));
    if (step === "coat_condition") return coatCond.map((r) => ({ label: r.label, action: `coat_condition:${r.label}` }));
    if (step === "faq_menu") return faqs.map((r) => ({ label: r.question, action: `faq_q:${r.question}` }));
    if (step === "confirm") return [{ label: "Sí, agendar", action: "agenda_si" }, { label: "No por ahora", action: "agenda_no" }];
    if (step === "done") return [{ label: "Volver al inicio", action: "reset" }];
    return [];
  }, [step, services, sizes, coatTypes, coatCond, faqs]);

  /* acciones de menú */
  function onClick(action) {
    if (action === "cotizar") {
      setMessages([]); goTo("service");
      pushBot("Perfecto, te ayudo a cotizar. Primero necesito esta info.<br><br><b>1) ¿Qué servicio necesitas?</b>");
      return;
    }
    if (action === "servicios") {
      setMessages([]);
      pushBot("📋 <b>Servicios disponibles</b>");
      services.forEach((r) => pushBot(`• <b>${r.label}</b>${r.desc ? " — " + r.desc : ""}`));
      return;
    }
    if (action === "faq") {
      setMessages([]);
      if (!faqs.length) { pushBot("Aún no hay preguntas frecuentes configuradas."); return; }
      pushBot("Elige una pregunta frecuente:"); goTo("faq_menu"); return;
    }
  }

  /* flujo de cotización */
  function chooseService(label) {
    const row = services.find((r) => (r.label || "").toLowerCase() === label.toLowerCase());
    if (!row) return;
    pushUser(row.label);
    setAns((a) => ({ ...a, service: row.service_key || row.label }));
    goTo("size");
    pushBot("<b>2) ¿Qué tamaño tiene tu perrito?</b>");
  }
  function chooseSize(label) {
    const row = sizes.find((r) => (r.label || "").toLowerCase() === label.toLowerCase());
    if (!row) return;
    pushUser(row.label);
    setAns((a) => ({ ...a, size: row.size_key || row.label }));
    goTo("coat_type");
    pushBot("<b>3) ¿Qué tipo de pelo tiene?</b>");
  }
  function chooseCoatType(label) {
    const row = coatTypes.find((r) => (r.label || "").toLowerCase() === label.toLowerCase());
    if (!row) return;
    pushUser(row.label);
    setAns((a) => ({ ...a, coat_type: row.coat_key || row.label }));
    goTo("coat_condition");
    pushBot("<b>4) ¿Cómo está su pelaje hoy?</b>");
  }
  function chooseCoatCond(label) {
    const row = coatCond.find((r) => (r.label || "").toLowerCase() === label.toLowerCase());
    if (!row) return;
    pushUser(row.label);
    setAns((a) => ({ ...a, coat_condition: row.cond_key || row.label }));
    goTo("day");
    pushBot("<b>5) ¿Para qué día te gustaría agendar?</b><br><i>(Escribe la fecha abajo y pulsa Enviar)</i>");
  }

  /* input libre para la fecha */
  function sendFree() {
    if (!free.trim()) return;
    pushUser(free.trim());
    if (step === "day") {
      const next = { ...ans, day: free.trim() };
      const price = computePriceByRules(next, rules);
      setAns((a) => ({ ...a, day: next.day, price }));
      pushBot(
        `🎯 <b>Resumen</b><br>
        • Nombre: ${leadName || "-"}<br>
        • Contacto: ${phoneNormalized || "-"}<br>
        • Servicio: ${next.service}<br>
        • Tamaño: ${next.size}<br>
        • Pelo: ${next.coat_type}<br>
        • Estado: ${next.coat_condition}<br>
        • Día preferido: ${next.day}<br><br>
        💰 <b>Precio estimado:</b> $${CLP(price)}<br><br>
        ¿Deseas agendar?`
      );
      goTo("confirm");
    }
    setFree("");
  }

  /* manejar botones */
  function handleButtonClick(btn) {
    const { action, label } = btn;

    if (action === "reset") {
      setLeadName(""); setLeadPhone("");
      setAns({ service: null, size: null, coat_type: null, coat_condition: null, day: null, price: 0 });
      setMessages([]); setHistory([]); setStep("lead");
      pushBot("¡Hola! 👋 Antes de empezar, cuéntame tu <b>nombre</b> y tu <b>WhatsApp</b> (con <b>+56</b>) para registrarte.");
      return;
    }
    if (action === "cotizar" || action === "servicios" || action === "faq") return onClick(action);
    if (action.startsWith("service:")) return chooseService(label);
    if (action.startsWith("size:")) return chooseSize(label);
    if (action.startsWith("coat_type:")) return chooseCoatType(label);
    if (action.startsWith("coat_condition:")) return chooseCoatCond(label);
    if (action.startsWith("faq_q:")) {
      const row = faqs.find((r) => (r.question || "").toLowerCase() === label.toLowerCase());
      if (row) { pushUser(row.question); pushBot(row.answer); }
      return;
    }
    if (action === "agenda_si") {
      pushBot("¡Genial! Te llevaré a la agenda para reservar tu hora. 📆");
      if (calendlyUrl) window.open(calendlyUrl, "_blank", "noopener,noreferrer");
      goTo("done"); return;
    }
    if (action === "agenda_no") {
      pushBot("¡Gracias! Te contactaremos por WhatsApp con promociones más adelante. 🐾");
      goTo("done"); return;
    }
  }

  /* pasar del paso lead al menú */
  function startChat() {
    const nameOk = !!leadName.trim();
    if (!nameOk || !phoneValid) {
      if (!nameOk) pushBot("Por favor ingresa tu <b>nombre</b> 🙏");
      if (!phoneValid) pushBot("El WhatsApp debe tener formato <b>+56</b> seguido de <b>9 dígitos</b>. Ej: <b>+56912345678</b>.");
      return;
    }
    // Guardamos normalizado
    if (phoneNormalized !== leadPhone) setLeadPhone(phoneNormalized);
    pushUser(`${leadName} — ${phoneNormalized}`);
    setMessages([]);
    goTo("menu");
    pushBot("¡Listo, gracias! ¿En qué te puedo ayudar?");
  }

  function askConfirm(type) {
    setPendingAction(type); // 'close' o 'back'
    setConfirmExit(true);
  }
  function doProceed() { // ejecutar acción original
    if (pendingAction === "back") goBack();
    if (pendingAction === "close" && onClose) onClose();
    setConfirmExit(false);
    setPendingAction(null);
  }
  function openWhats() {
    if (whatsappUrl) window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    // si quieres además cerrar el widget al abrir WhatsApp, descomenta:
    // if (onClose) onClose();
    setConfirmExit(false);
    setPendingAction(null);
  }

  /* UI */
  if (loading) return <div className="w-full max-w-md mx-auto p-4 rounded-2xl bg-white shadow">Cargando chat…</div>;
  if (err) return <div className="w-full max-w-md mx-auto p-4 rounded-2xl bg-white shadow text-red-600 text-sm">{err}</div>;

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-violet-500 to-fuchsia-600 p-[6px] rounded-3xl shadow-xl">
      <div className="bg-white rounded-[inherit] p-4 flex flex-col h-[620px] relative">
        {/* Header con volver y cerrar (iconos blancos, grandes, sin recuadro) */}
        <div className="relative rounded-2xl p-4 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white mb-3">
          {/* Volver */}
          <button
            type="button"
            onClick={() => history.length > 0 && askConfirm("back")}
            disabled={history.length === 0}
            aria-label="Volver"
            className={
              "absolute left-3 top-3 p-1 text-white cursor-pointer " +
              "hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none"
            }
            style={{ background: "transparent", border: 0, boxShadow: "none", outline: "none" }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-9 h-9"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
            >
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Cerrar */}
          <button
            type="button"
            onClick={() => askConfirm("close")}
            aria-label="Cerrar"
            className="absolute right-3 top-3 p-1 text-white cursor-pointer hover:opacity-90"
            style={{ background: "transparent", border: 0, boxShadow: "none", outline: "none" }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-9 h-9"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
            >
              <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="font-bold text-lg text-center">FULL MASCOTAS — ASISTENTE</div>
          <div className="text-xs opacity-90 text-center">Cotiza y agenda en 1 minuto 🐾</div>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-auto space-y-2 pr-1">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.who === "bot"
                  ? "bg-gray-50 border border-gray-200 p-3 rounded-2xl max-w-[85%]"
                  : "bg-violet-100 text-gray-900 p-3 rounded-2xl max-w-[85%] ml-auto"
              }
              dangerouslySetInnerHTML={{ __html: m.html }}
            />
          ))}
        </div>

        {/* Paso lead */}
        {step === "lead" && (
          <div className="mt-2 space-y-2">
            <input
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full border border-gray-300 rounded-full px-3 py-2 text-sm"
            />
            <input
              type="tel"
              value={leadPhone}
              onChange={(e) => setLeadPhone(sanitizePhone(e.target.value))}
              onBlur={() => setLeadPhone(normalizePhone(leadPhone))}
              placeholder="Tu WhatsApp (ej: +56912345678)"
              className={
                "w-full border rounded-full px-3 py-2 text-sm " +
                (leadPhone && !phoneValid ? "border-red-400" : "border-gray-300")
              }
            />
            {leadPhone && !phoneValid && (
              <div className="text-[11px] text-red-500 px-1">
                Formato requerido: <b>+56</b> seguido de <b>9 dígitos</b> (ej: +56912345678).
              </div>
            )}
            <button
              onClick={startChat}
              disabled={!leadName.trim() || !phoneValid}
              style={{ backgroundColor: "#AE29FF", opacity: (!leadName.trim() || !phoneValid) ? 0.6 : 1 }}
              className="w-full px-4 py-2 rounded-full text-white text-sm shadow-lg hover:brightness-110 disabled:cursor-not-allowed"
            >
              Comenzar chat
            </button>
          </div>
        )}

        {/* Botones (TODOS morados) */}
        {step !== "lead" && (
          <div className="flex flex-wrap gap-2 mt-3">
            {buttons.map((b, i) => (
              <button
                key={i}
                onClick={() => handleButtonClick(b)}
                style={{ backgroundColor: "#AE29FF", borderColor: "#AE29FF" }}
                className="px-3 py-2 rounded-full text-sm border text-white shadow-md hover:brightness-110"
              >
                {b.label}
              </button>
            ))}
          </div>
        )}

        {/* Input libre (fecha) */}
        {step === "day" && (
          <div className="flex gap-2 mt-3">
            <input
              value={free}
              onChange={(e) => setFree(e.target.value)}
              placeholder="Escribe la fecha aquí..."
              className="flex-1 border border-gray-200 rounded-full px-3 py-2 text-sm"
            />
            <button
              onClick={sendFree}
              style={{ backgroundColor: "#AE29FF" }}
              className="px-4 py-2 rounded-full text-white text-sm shadow-md hover:brightness-110"
            >
              Enviar
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="mt-2 text-[11px] text-gray-500">
            Gracias por escribirnos. Tu consulta quedó registrada. 💜
          </div>
        )}

        {/* MODAL de confirmación de salida */}
        {confirmExit && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
            <div className="bg-white w-[92%] max-w-sm rounded-2xl p-5 text-center shadow-2xl">
              <div className="text-lg font-extrabold mb-1">¿Seguro que deseas salir?</div>
              <div className="text-sm text-gray-600 mb-4">
                ¿No prefieres comunicarte con uno de nuestros especialistas por WhatsApp?
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={openWhats}
                  className="flex-1 px-4 py-2 rounded-full text-white font-semibold shadow"
                  style={{ backgroundColor: "#25D366" }}
                >
                  Hablar por WhatsApp
                </button>

                <button
                  onClick={doProceed}
                  className="flex-1 px-4 py-2 rounded-full text-white font-semibold shadow"
                  style={{ backgroundColor: "#AE29FF" }}
                >
                  Salir de todos modos 🥺
                </button>

                <button
                  onClick={() => { setConfirmExit(false); setPendingAction(null); }}
                  className="flex-1 px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-semibold"
                >
                  Seguir en el chat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}