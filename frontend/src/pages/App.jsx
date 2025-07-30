import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import Formulario from "./Formulario";
import Faqs from "./Faqs";
import Navbar from "../components/Navbar";

const App = () => {
  useEffect(() => {
    console.log("🧠 Inyectando script de Chatbase...");

    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.setAttribute("chatbotId", "5MOIiTyE40phPFDVMb07R");
    script.setAttribute("domain", "www.chatbase.co");
    script.defer = true;

    script.onload = () => console.log("✅ Chatbase script cargado correctamente");
    script.onerror = () => console.error("❌ Error cargando script de Chatbase");

    document.body.appendChild(script);
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
