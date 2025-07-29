import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-900 text-white py-4 shadow-md flex justify-center gap-10">
      <Link to="/" className="hover:underline text-lg font-semibold">
        Inicio
      </Link>
      <Link to="/formulario" className="hover:underline text-lg font-semibold">
        Formulario
      </Link>
      <Link to="/faqs" className="over:underline text-lg font-semibold">
      Preguntas frecuentes
      </Link>
      <Link to="/admin" className="hover:underline text-lg font-semibold">
        Admin
      </Link>
    </nav>
  );
};

export default Navbar;

