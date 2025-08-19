import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import Formulario from "./Formulario";
import Faqs from "./Faqs";
import Navbar from "../components/Navbar";
// App.jsx (React / Vite)
import { useEffect } from "react";

const CHATBASE_ID = import.meta.env.VITE_CHATBASE_ID;

export default function App() {
  useEffect(() => {
    // 1) Inyecta el script de Chatbase (como ya hacías)
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.setAttribute("chatbotId", CHATBASE_ID);
    script.setAttribute("domain", "www.chatbase.co");
    script.defer = true;
    document.body.appendChild(script);

    // 2) Inyecta un <style> con reglas fuertes (por si los inline ganan)
    const style = document.createElement("style");
    style.id = "chatbase-bubble-style";
    style.textContent = `
      /* Móvil por defecto */
      iframe[src*="chatbase"] {
        transform: scale(1.12) !important;
        transform-origin: bottom right !important;
        right: 12px !important;
        bottom: 12px !important;
      }
      @media (min-width: 640px) {
        iframe[src*="chatbase"] {
          transform: scale(1.22) !important;
          right: 14px !important;
          bottom: 14px !important;
        }
      }
      @media (min-width: 768px) {
        iframe[src*="chatbase"] {
          transform: scale(1.32) !important;
          right: 16px !important;
          bottom: 16px !important;
        }
      }
      @media (min-width: 1024px) {
        iframe[src*="chatbase"] {
          transform: scale(1.42) !important;
          right: 18px !important;
          bottom: 18px !important;
        }
      }
      @media (min-width: 1280px) {
        iframe[src*="chatbase"] {
          transform: scale(1.50) !important;
          right: 20px !important;
          bottom: 20px !important;
        }
      }
    `;
    document.head.appendChild(style);

    // 3) Si el iframe aparece tarde, aplica cuando exista (MutationObserver)
    const ensureApplied = () => {
      const bubble = document.querySelector('iframe[src*="chatbase"]');
      if (bubble) {
        // fuerza un re-cálculo de estilo por si llegó después
        (bubble as HTMLElement).style.transform = (getComputedStyle(bubble).transform || "scale(1.12)");
        return true;
      }
      return false;
    };

    if (!ensureApplied()) {
      const obs = new MutationObserver(() => {
        if (ensureApplied()) obs.disconnect();
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
      return () => obs.disconnect();
    }

    return () => {
      // Limpieza opcional al desmontar
      script.remove();
      document.getElementById("chatbase-bubble-style")?.remove();
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
};

export default App;
