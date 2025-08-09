import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="relative h-16 bg-blue-700 text-white flex items-center overflow-hidden">
      {/* Fondo con patrón (overlay) */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
        style={{ backgroundImage: "url('public/fondo-financiero.jpg')" }} // Asegúrate del nombre/ubicación
      />

      {/* Contenido */}
      <div className="relative z-10 w-full">
        {/* Título a la izquierda */}
        <div className="pl-6 font-bold text-lg">TaxRating</div>

        {/* Menú centrado */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex gap-8">
          <Link to="/" className="font-semibold hover:underline">Inicio</Link>
          <Link to="/formulario" className="font-semibold hover:underline">Formulario</Link>
          <Link to="/faqs" className="font-semibold hover:underline">Preguntas frecuentes</Link>
          <Link to="/admin" className="font-semibold hover:underline">Admin</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
