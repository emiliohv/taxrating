import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import Formulario from "./Formulario";
import Faqs from "./Faqs";
import Navbar from "../components/Navbar";

const CHATBASE_ID = import.meta.env.VITE_CHATBASE_ID;

/** ===== Botón propio (launcher) ===== */
function ChatLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    try {
      if (!window.chatbase) return;
      if (isOpen) {
        window.chatbase.close?.();  // API oficial
        setIsOpen(false);
      } else {
        window.chatbase.open?.();   // API oficial
        setIsOpen(true);
      }
    } catch {}
  };

  return (
    <button
      aria-label="Abrir chat"
      onClick={handleClick}
      className="fixed z-[2147483646] bottom-4 right-4 rounded-full shadow-lg transition-transform hover:scale-105 focus:outline-none"
      style={{
        width: 84,                 // ⬅️ tamaño del globo (ajusta)
        height: 84,
        background: "#ffffff",
        border: "2px solid #E5E7EB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
  useEffect(() => {
    // 1) Inyecta Chatbase solo una vez
    if (!document.querySelector('script[src*="chatbase.co/embed.min.js"]')) {
      const s = document.createElement("script");
      s.src = "https://www.chatbase.co/embed.min.js";
      s.setAttribute("chatbotId", CHATBASE_ID);
      s.setAttribute("domain", "www.chatbase.co");
      s.defer = true;
      document.body.appendChild(s);
    }

    // 2) Inyecta estilos de seguridad: no escalar nada por defecto
    //    (restaura tamaño normal de la ventana del chat)
    const style = document.createElement("style");
    style.id = "cb-safety-reset";
    style.textContent = `
      iframe[src*="chatbase"] {
        transform: none !important;
        transform-origin: initial !important;
      }
      /* si marcamos un host como launcher nativo, lo ocultamos */
      .cb-native-launcher-host { display: none !important; }
    `;
    document.head.appendChild(style);

    /** 3) Oculta el launcher nativo aun cuando esté en Shadow DOM
     * - Busca iframes pequeños en esquina (método 1).
     * - Busca hosts con shadowRoot que contengan el avatar/imagen de Chatbase (método 2).
     */
    const HIDE_MAX = 120; // px

    const hideNativeLauncher = () => {
      // método 1: iframes pequeños en esquina
      document.querySelectorAll('iframe[src*="chatbase"]').forEach((el) => {
        if (!(el instanceof HTMLElement)) return;
        const r = el.getBoundingClientRect();
        const isSmall = r.width > 0 && r.height > 0 && r.width <= HIDE_MAX && r.height <= HIDE_MAX;
        const isBottomRight =
          r.bottom >= (window.innerHeight - HIDE_MAX * 2) &&
          r.right >= (window.innerWidth - HIDE_MAX * 2);
        if (isSmall && isBottomRight) {
          el.style.setProperty("display", "none", "important");
          el.style.setProperty("visibility", "hidden", "important");
          el.style.setProperty("opacity", "0", "important");
          el.style.setProperty("pointer-events", "none", "important");
        }
      });

      // método 2: hosts con Shadow DOM
      // escaneamos elementos que podrían ser el host del shadow de Chatbase
      const candidates = Array.from(document.body.querySelectorAll("div,span,section"));
      for (const host of candidates) {
        const anyEl = host;
        // @ts-ignore - propiedad no tipada en JS puro
        const sr = anyEl && anyEl.shadowRoot;
        if (!sr) continue;

        // Dentro del shadow, buscamos señales del launcher:
        // - imágenes que vengan de chatbase/backends
        // - botones con aria-label típico
        const match =
          sr.querySelector('img[src*="chatbase.co"], img[src*="backend.chatbase.co"]') ||
          sr.querySelector('button[aria-label*="chat"], button[aria-label*="Chat"]');

        if (match) {
          host.classList.add("cb-native-launcher-host");
        }
      }
    };

    const obs = new MutationObserver(hideNativeLauncher);
    obs.observe(document.documentElement, { childList: true, subtree: true });

    const intervalId = window.setInterval(hideNativeLauncher, 600);
    window.addEventListener("resize", hideNativeLauncher);

    // primer pase
    hideNativeLauncher();

    return () => {
      obs.disconnect();
      window.clearInterval(intervalId);
      window.removeEventListener("resize", hideNativeLauncher);
      document.getElementById("cb-safety-reset")?.remove();
    };
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {/* Nuestro launcher personalizado */}
      <ChatLauncher />
    </BrowserRouter>
  );
}

export default App;
