import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import Formulario from "./Formulario";
import Faqs from "./Faqs";
import Navbar from "../components/Navbar";

const CHATBASE_ID = import.meta.env.VITE_CHATBASE_ID;

/** ===== Botón propio (launcher) ===== */
function ChatLauncher({ ready }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (!ready || !window.chatbase) return; // evita clics hasta que esté listo
    try {
      if (isOpen) {
        window.chatbase.close?.();
        setIsOpen(false);
      } else {
        window.chatbase.open?.();
        setIsOpen(true);
      }
    } catch {}
  };

  return (
    <button
      aria-label={ready ? "Abrir chat" : "Cargando chat…"}
      onClick={handleClick}
      disabled={!ready}
      className="fixed z-[2147483646] bottom-4 right-4 rounded-full shadow-lg transition-transform hover:scale-105 focus:outline-none disabled:opacity-60"
      style={{
        width: 84,   // ⬅️ tamaño del globo (ajusta)
        height: 84,
        background: "#ffffff",
        border: "2px solid #E5E7EB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: ready ? "pointer" : "not-allowed",
      }}
    >
      <img
        src="https://backend.chatbase.co/storage/v1/object/public/chat-icons/cdc61a71-1b81-4ae1-83bd-44689198b57b/VTEhXbJb3iE8D7aHM8AV4.webp"
        alt="TaxRating"
        style={{ width: 82, height: 82, borderRadius: "50%" }}
      />
    </button>
  );
}

function App() {
  const [chatbaseReady, setChatbaseReady] = useState(false);

  useEffect(() => {
    // 1) Inyecta el SDK una sola vez y marca "ready" al cargar
    let loaded = !!window.chatbase;
    if (!document.querySelector('script[src*="chatbase.co/embed.min.js"]')) {
      const s = document.createElement("script");
      s.src = "https://www.chatbase.co/embed.min.js";
      s.setAttribute("chatbotId", CHATBASE_ID);
      s.setAttribute("domain", "www.chatbase.co");
      s.defer = true;
      s.onload = () => {
        loaded = true;
        setChatbaseReady(true);
        // por si quieres abrir programáticamente:
        // window.chatbase?.close?.();
      };
      document.body.appendChild(s);
    } else if (loaded) {
      setChatbaseReady(true);
    }

    // 2) Seguridad: nunca escalar la ventana (contenido normal)
    const safety = document.createElement("style");
    safety.id = "cb-safety-reset";
    safety.textContent = `
      iframe[src*="chatbase"] { transform: none !important; transform-origin: initial !important; }
      /* Oculta el launcher nativo si aparece */
      #chatbase-bubble-button { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; }
    `;
    document.head.appendChild(safety);

    // 3) Oculta SIEMPRE el botón nativo cuando aparezca/reaparezca
    const hideNative = () => {
      const btn = document.getElementById("chatbase-bubble-button");
      if (btn) {
        btn.style.setProperty("display", "none", "important");
        btn.style.setProperty("visibility", "hidden", "important");
        btn.style.setProperty("opacity", "0", "important");
        btn.style.setProperty("pointer-events", "none", "important");
      }
      // Marca ready si el SDK ya está disponible
      if (!chatbaseReady && window.chatbase) setChatbaseReady(true);
    };

    hideNative();
    const obs = new MutationObserver(hideNative);
    obs.observe(document.documentElement, { childList: true, subtree: true });

    const intervalId = window.setInterval(() => {
      if (!chatbaseReady && window.chatbase) setChatbaseReady(true);
      hideNative();
    }, 500);

    return () => {
      obs.disconnect();
      clearInterval(intervalId);
      document.getElementById("cb-safety-reset")?.remove();
    };
  }, [chatbaseReady]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {/* Nuestro launcher personalizado (solo abre si ready) */}
      <ChatLauncher ready={chatbaseReady} />
    </BrowserRouter>
  );
}

export default App;
