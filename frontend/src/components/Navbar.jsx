import React from "react";
import { Link } from "react-router-dom";
import pattern from "../assets/fondo-financiero.jpg"; // <-- importa la imagen

const Navbar = () => {
  return (
    <nav className="relative h-16 text-white flex items-center overflow-hidden"
         style={{
           backgroundColor: "#1e3a8a",             // azul base (fallback)
           backgroundImage: `url(${pattern})`,     // patrón importado
           backgroundRepeat: "repeat",             // que se repita
           backgroundSize: "480px auto",           // ajusta detalle del icono
           backgroundPosition: "center",           // centrado
         }}>
      {/* Título a la izquierda */}
      <div className="pl-6 font-bold text-lg tracking-wide">
        TaxRating
      </div>

      {/* Menú centrado */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex gap-8">
        <Link to="/" className="font-semibold hover:underline">Inicio</Link>
        <Link to="/formulario" className="font-semibold hover:underline">Formulario</Link>
        <Link to="/faqs" className="font-semibold hover:underline">Preguntas frecuentes</Link>
        <Link to="/admin" className="font-semibold hover:underline">Admin</Link>
      </div>
    </nav>
  );
};

export default Navbar;
