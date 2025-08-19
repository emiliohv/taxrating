import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import Formulario from "./Formulario";
import Faqs from "./Faqs";
import Navbar from "../components/Navbar";

import { useEffect } from "react";

const CHATBASE_ID = import.meta.env.VITE_CHATBASE_ID;

function App() {
  useEffect(() => {
    // 1) Inyecta el script de Chatbase una sola vez
    if (!document.querySelector('script[src*="chatbase.co/embed.min.js"]')) {
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.setAttribute("chatbotId", CHATBASE_ID);
      script.setAttribute("domain", "www.chatbase.co");
      script.defer = true;
      document.body.appendChild(script);
    }

    // 2) Inyecta estilos fuertes para escalar el bubble (responsive)
    if (!document.getElementById("chatbase-bubble-style")) {
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
    }

    // 3) Asegura aplicación cuando el iframe aparezca (sin TypeScript)
    const applyInline = () => {
      const bubble = document.querySelector('iframe[src*="chatbase"]');
      if (bubble && bubble instanceof HTMLElement) {
        // Por si hiciera falta reforzar inline:
        bubble.style.transform = "scale(1.12)";
        bubble.style.transformOrigin = "bottom right";
        bubble.style.right = "12px";
        bubble.style.bottom = "12px";
        return true;
      }
      return false;
    };

    if (!applyInline()) {
      const obs = new MutationObserver(() => {
        if (applyInline()) obs.disconnect();
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
      return () => obs.disconnect();
    }
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
