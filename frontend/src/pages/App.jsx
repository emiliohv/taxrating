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
        width: 84,  // ⬅️ tamaño del globo (ajusta)
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
    // 1) Inyecta Chatbase una sola vez
    if (!document.querySelector('script[src*="chatbase.co/embed.min.js"]')) {
      const s = document.createElement("script");
      s.src = "https://www.chatbase.co/embed.min.js";
      s.setAttribute("chatbotId", CHATBASE_ID);
      s.setAttribute("domain", "www.chatbase.co");
      s.defer = true;
      document.body.appendChild(s);
    }

    // 2) Nunca escalar la ventana (por si quedó algo residual)
    const style = document.createElement("style");
    style.id = "cb-safety-reset";
    style.textContent = `
      iframe[src*="chatbase"] {
        transform: none !important;
        transform-origin: initial !important;
      }
    `;
    document.head.appendChild(style);

    // 3) Elimina SIEMPRE el botón nativo si aparece/reaparece
    const removeNativeButton = () => {
      const btn = document.getElementById("chatbase-bubble-button");
      if (btn) {
        // mejor eliminarlo que solo ocultarlo, para que no consuma foco ni espacio
        btn.remove();
      }
    };

    // Ejecuta ahora y vigila el DOM por si Chatbase lo reinyecta
    removeNativeButton();
    const obs = new MutationObserver(removeNativeButton);
    obs.observe(document.documentElement, { childList: true, subtree: true });

    // Redundancia ligera por si no hay mutación (algunas versiones lo mueven)
    const intervalId = window.setInterval(removeNativeButton, 800);

    return () => {
      obs.disconnect();
      clearInterval(intervalId);
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
