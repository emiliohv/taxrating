import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import Formulario from "./Formulario";
import Faqs from "./Faqs";
import Navbar from "../components/Navbar";

const CHATBASE_ID = import.meta.env.VITE_CHATBASE_ID;

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

    // 2) Elimina estilos antiguos que pudieran escalar la ventana
    document.querySelectorAll('#chatbase-bubble-style, #chatbase-force-reset')
      .forEach(n => n.remove());

    // 3) Inyecta estilos:
    //    - Por defecto: SIN escala (restaura la ventana normal).
    //    - Solo si el iframe está marcado como "bubble": se escala el botón.
    const style = document.createElement("style");
    style.id = "chatbase-force-reset";
    style.textContent = `
      iframe[src*="chatbase"] {
        transform: none !important;
        transform-origin: initial !important;
      }
      iframe[src*="chatbase"][data-chatbase="bubble"] {
        transform: scale(2.5) !important;
        transform-origin: bottom right !important;
        right: 16px !important;
        bottom: 16px !important;
      }
    `;
    document.head.appendChild(style);

    // 4) Marca cada iframe como "bubble" (botón) o "popup" (ventana) por su tamaño
    const markBubbleOrPopup = () => {
      const iframes = document.querySelectorAll('iframe[src*="chatbase"]');
      iframes.forEach((el) => {
        if (!(el instanceof HTMLElement)) return;
        const r = el.getBoundingClientRect();
        // Umbral típico del launcher ~56-64px; usamos <= 90px para ir holgados
        const isBubble = r.width > 0 && r.height > 0 && r.width <= 90 && r.height <= 90;
        el.setAttribute("data-chatbase", isBubble ? "bubble" : "popup");
      });
    };

    // Observa cambios (el iframe aparece/cambia tarde), y reevalúa periódicamente
    const obs = new MutationObserver(markBubbleOrPopup);
    obs.observe(document.documentElement, { childList: true, subtree: true });

    const intervalId = window.setInterval(markBubbleOrPopup, 400);
    window.addEventListener("resize", markBubbleOrPopup);

    // Primer pase
    markBubbleOrPopup();

    return () => {
      obs.disconnect();
      window.clearInterval(intervalId);
      window.removeEventListener("resize", markBubbleOrPopup);
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
    </BrowserRouter>
  );
}

export default App;
