import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import Formulario from "./Formulario";
import Faqs from "./Faqs";
import Navbar from "../components/Navbar";

const CHATBASE_ID = import.meta.env.VITE_CHATBASE_ID;

// Botón propio (launcher)
function ChatLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  // Abrir/cerrar usando la API pública de Chatbase
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
      className="fixed z-50 bottom-4 right-4 rounded-full shadow-lg transition-transform hover:scale-105 focus:outline-none"
      style={{
        width: 84,        // ⬅️ cambia el tamaño del globo aquí
        height: 84,       // ⬅️ idem
        background: "#ffffff",
        border: "2px solid #E5E7EB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Tu icono. Si prefieres, usa el .webp que pasaste */}
      <img
        src="https://backend.chatbase.co/storage/v1/object/public/chat-icons/cdc61a71-1b81-4ae1-83bd-44689198b57b/VTEhXbJb3iE8D7aHM8AV4.webp"
        alt="TaxRating"
        style={{ width: 64, height: 64, borderRadius: "50%" }}
      />
    </button>
  );
}

function App() {
  useEffect(() => {
    // 1) Inyecta Chatbase solo una vez
    if (!document.querySelector('script[src*="chatbase.co/embed.min.js"]')) {
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.setAttribute("chatbotId", CHATBASE_ID);
      script.setAttribute("domain", "www.chatbase.co");
      script.defer = true;
      document.body.appendChild(script);
    }

    // 2) Asegura que la ventana no se vea escalada (restaura transform)
    //    y oculta el launcher nativo (para usar el nuestro).
    const normalizeAndHideNative = () => {
      const iframes = document.querySelectorAll('iframe[src*="chatbase"]');
      iframes.forEach((el) => {
        const r = el.getBoundingClientRect();
        const isSmall = r.width > 0 && r.height > 0 && r.width <= 100 && r.height <= 100;
        if (isSmall) {
          // Oculta el launcher nativo
          el.style.setProperty("display", "none", "important");
        } else {
          // Restablece transform en la ventana
          el.style.setProperty("transform", "none", "important");
          el.style.setProperty("transform-origin", "initial", "important");
        }
      });
    };

    const obs = new MutationObserver(normalizeAndHideNative);
    obs.observe(document.documentElement, { childList: true, subtree: true });

    const id = window.setInterval(normalizeAndHideNative, 600);
    window.addEventListener("resize", normalizeAndHideNative);
    normalizeAndHideNative();

    return () => {
      obs.disconnect();
      window.clearInterval(id);
      window.removeEventListener("resize", normalizeAndHideNative);
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

      {/* Nuestro botón grande y bonito */}
      <ChatLauncher />
    </BrowserRouter>
  );
}

export default App;
