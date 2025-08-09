import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      className="relative h-16 flex items-center"
      style={{
        backgroundImage: "url('/fondo-financiero.jpg')", // imagen en public
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Título a la izquierda */}
      <div className="pl-6 text-white font-bold text-lg">
        TaxRating
      </div>

      {/* Menú centrado */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-8">
        <Link to="/" className="text-white font-semibold hover:underline">
          Inicio
        </Link>
        <Link to="/formulario" className="text-white font-semibold hover:underline">
          Formulario
        </Link>
        <Link to="/faqs" className="text-white font-semibold hover:underline">
          Preguntas frecuentes
        </Link>
        <Link to="/admin" className="text-white font-semibold hover:underline">
          Admin
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
