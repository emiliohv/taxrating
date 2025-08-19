import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import Formulario from "./Formulario";
import Faqs from "./Faqs";
import Navbar from "../components/Navbar";

const CHATBASE_ID = import.meta.env.VITE_CHATBASE_ID;

function App() {
  useEffect(() => {
    // Inyecta Chatbase (si aún no está)
    if (!document.querySelector('script[src*="chatbase.co/embed.min.js"]')) {
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.setAttribute("chatbotId", CHATBASE_ID);
      script.setAttribute("domain", "www.chatbase.co");
      script.defer = true;
      document.body.appendChild(script);
    }

    // Elimina estilos antiguos que pudieran estar escalando la ventana
    const oldStyle = document.getElementById("chatbase-bubble-style");
    if (oldStyle) oldStyle.remove();

    // Función que escala SOLO si es el globo (launcher)
    const SCALE = 1.4;          // <- ajusta el tamaño del botón aquí
    const PAD = 16;             // separación a las esquinas

    const applyOnlyOnLauncher = () => {
      const iframes = Array.from(document.querySelectorAll('iframe[src*="chatbase"]'));
      iframes.forEach((el) => {
        if (!(el instanceof HTMLElement)) return;
        const r = el.getBoundingClientRect();
        const isLauncher = r.width > 0 && r.height > 0 && r.width <= 90 && r.height <= 90;
        if (isLauncher) {
          // Escala solo el botón
          el.style.transform = `scale(${SCALE})`;
          el.style.transformOrigin = "bottom right";
          el.style.right = `${PAD}px`;
          el.style.bottom = `${PAD}px`;
        } else {
          // Restablece cuando es la ventana abierta
          el.style.transform = "";
          el.style.transformOrigin = "";
          // No tocamos right/bottom para no interferir con el layout del popup
        }
      });
    };

    // Observa cambios en el DOM (el iframe aparece tarde y cambia de tamaño)
    const obs = new MutationObserver(applyOnlyOnLauncher);
    obs.observe(document.documentElement, { childList: true, subtree: true });

    // Reaplica en eventos típicos
    window.addEventListener("resize", applyOnlyOnLauncher);
    const id = window.setInterval(applyOnlyOnLauncher, 400); // pequeño “poll” por si el tamaño cambia sin mutación

    // Primer intento inmediato
    applyOnlyOnLauncher();

    return () => {
      obs.disconnect();
      window.removeEventListener("resize", applyOnlyOnLauncher);
      window.clearInterval(id);
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
