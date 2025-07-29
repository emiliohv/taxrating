import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import Formulario from "./Formulario";
import Faqs from "./Faqs";
import Navbar from "./components/Navbar"; // Asegúrate que esta ruta es correcta

const App = () => {
  useEffect(() => {
    if (
      !window.chatbase ||
      (typeof window.chatbase === "function" &&
        window.chatbase("getState") !== "initialized")
    ) {
      window.chatbase = (...args) => {
        if (!window.chatbase.q) {
          window.chatbase.q = [];
        }
        window.chatbase.q.push(args);
      };
      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === "q") return target.q;
          return (...args) => target(prop, ...args);
        }
      });
    }

    const onLoad = () => {
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = "chatbase-script";
      script.setAttribute("chatbotId", "5MOIiTyE40phPFDVMb07R"); // ← Sustituye con el ID real
      script.setAttribute("domain", "www.chatbase.co");
      script.defer = true;
      document.body.appendChild(script);
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;
