import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import Formulario from "./Formulario";
import Faqs from "./Faqs";
import Navbar from "../components/Navbar";

const CHATBASE_ID = import.meta.env.VITE_CHATBASE_ID;

// === Botón propio (launcher) ===
function ChatLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    try {
      if (!window.chatbase) return;
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
      aria-label="Abrir chat"
      onClick={handleClick}
      className="fixed z-[2147483646] bottom-4 right-4 rounded-full shadow-lg transition-transform hover:scale-105 focus:outline-none"
      style={{
        width: 92,       // ⬅️ tamaño del globo (ajusta)
        height: 92,      // ⬅️ tamaño del globo (ajusta)
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
        style={{ width: 90, height: 90, borderRadius: "50%" }}
      />
    </button>
  );
}

function App() {
  useEffect(() => {
    // 1) Inyecta Chatbase una sola vez
    if (!document.querySelector('script[src*="chatbase.co/embed.min.js"]')) {
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.setAttribute("chatbotId", CHATBASE_ID);
      script.setAttribute("domain", "www.chatbase.co");
      script.defer = true;
      document.body.appendChild(script);
    }

    // 2) Regla de seguridad: NO escalar por defecto (restaura la ventana)
    //    y una clase/atributo para ocultar launchers pequeños
    const style = document.createElement("style");
    style.id = "chatbase-hide-native-launcher";
    style.textContent = `
      /* Nunca escalar la ventana */
      iframe[src*="chatbase"] {
        transform: none !important;
        transform-origin: initial !important;
      }
      /* Si marcamos un iframe o su wrapper como launcher, lo ocultamos */
      iframe[data-cb="launcher"], .cb-launcher-wrapper {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);

    // 3) Oculta el/los launchers nativos con varios criterios
    const HIDE_MAX = 120; // umbral de tamaño (px) para considerar “launcher”

    const hideNativeLaunchers = () => {
      // a) Oculta iframes pequeños en esquina inferior derecha
      document.querySelectorAll('iframe[src*="chatbase"]').forEach((el) => {
        if (!(el instanceof HTMLElement)) return;
        const r = el.getBoundingClientRect();

        const isSmall = r.width > 0 && r.height > 0 && r.width <= HIDE_MAX && r.height <= HIDE_MAX;
        const isBottomRight =
          r.bottom >= (window.innerHeight - HIDE_MAX * 2) &&
          r.right >= (window.innerWidth - HIDE_MAX * 2);

        if (isSmall && isBottomRight) {
          // marca y oculta el iframe
          el.setAttribute("data-cb", "launcher");
          el.style.setProperty("display", "none", "important");
          el.style.setProperty("visibility", "hidden", "important");
          el.style.setProperty("opacity", "0", "important");
          el.style.setProperty("pointer-events", "none", "important");

          // intenta ocultar su wrapper si existe
          const parent = el.parentElement;
          if (parent && parent instanceof HTMLElement) {
            parent.classList.add("cb-launcher-wrapper");
          }
        } else {
          // asegúrate de que la ventana no esté escalada
          el.style.removeProperty("display");
          el.style.removeProperty("visibility");
          el.style.removeProperty("opacity");
          el.style.removeProperty("pointer-events");
          if (el.getAttribute("data-cb") !== "launcher") {
            el.style.setProperty("transform", "none", "important");
            el.style.setProperty("transform-origin", "initial", "important");
          }
        }
      });

      // b) Por si Chatbase usa un contenedor DIV para el launcher
      document.querySelectorAll('div[id*="chatbase"],div[class*="chatbase"]').forEach((d) => {
        if (!(d instanceof HTMLElement)) return;
        const r = d.getBoundingClientRect();
        const isSmall = r.width > 0 && r.height > 0 && r.width <= HIDE_MAX && r.height <= HIDE_MAX;
        const isBottomRight =
          r.bottom >= (window.innerHeight - HIDE_MAX * 2) &&
          r.right >= (window.innerWidth - HIDE_MAX * 2);
        if (isSmall && isBottomRight) {
          d.classList.add("cb-launcher-wrapper");
        }
      });
    };

    // Observa el DOM (el iframe aparece tarde o cambia)
    const obs = new MutationObserver(hideNativeLaunchers);
    obs.observe(document.documentElement, { childList: true, subtree: true });

    // Reintentos periódicos + en resize
    const id = window.setInterval(hideNativeLaunchers, 600);
    window.addEventListener("resize", hideNativeLaunchers);

    // Primer pase
    hideNativeLaunchers();

    return () => {
      obs.disconnect();
      window.clearInterval(id);
      window.removeEventListener("resize", hideNativeLaunchers);
      document.getElementById("chatbase-hide-native-launcher")?.remove();
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

      {/* Nuestro botón (globo) personalizado */}
      <ChatLauncher />
    </BrowserRouter>
  );
}

export default App;
