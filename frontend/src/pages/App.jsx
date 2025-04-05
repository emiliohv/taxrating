import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Formulario from "./pages/Formulario";
import AdminLogin from "./pages/AdminLogin";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;


