import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import Formulario from "./Formulario";
import AdminLogin from "./AdminLogin";

const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/formulario" element={<Formulario />} />
      </Routes>
    </Router>
  );
};

export default App;



