import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import Formulario from "./Formulario";
import Faqs from "./Faqs";


//import AdminLogin from "./AdminLogin"; <Route path="/admin-login" element={<AdminLogin />} />
import Navbar from "../components/Navbar";

const App = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.setAttribute("chatbotId", "5MOIiTyE40phPFDVMb07R"); // 🔁 Sustituye por tu ID real
    script.setAttribute("domain", "https://www.chatbase.co");
    script.defer = true;
    document.body.appendChild(script);
  }, [])
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
