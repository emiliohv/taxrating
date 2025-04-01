import React, { useState } from "react";
import axios from "axios";

const Formulario = () => {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    website: "",
    location: "",
    province: "",
    email: "",
    nif: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://taxrating-backend.onrender.com/gestorias", formData);
      alert("Gestoría añadida correctamente");
    } catch (err) {
      console.error("Error al enviar el formulario:", err);
      alert("Error al enviar el formulario");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Añadir nueva gestoría</h2>
      {["name", "image", "website", "location", "province", "email", "nif"].map((field) => (
        <div key={field} className="mb-4">
          <label className="block text-sm font-medium">
            {field === "name" && "Nombre"}
            {field === "image" && "URL de la imagen"}
            {field === "website" && "Sitio web"}
            {field === "location" && "Dirección"}
            {field === "province" && "Provincia"}
            {field === "email" && "Correo electrónico"}
            {field === "nif" && "NIF (obligatorio)"}
          </label>
          <input
            type={field === "email" ? "email" : "text"}
            name={field}
            required
            value={formData[field]}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Enviar
      </button>
    </form>
  );
};

export default Formulario;

