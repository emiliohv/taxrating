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
    nif: "",
    ratings: {
      "Valoración Global": 0,
      "IRPF": 0,
      "IS": 0,
      "IVA": 0,
      "Consolidación Fiscal": 0,
      "Asesoría Internacional": 0,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.ratings) {
      setFormData((prev) => ({
        ...prev,
        ratings: {
          ...prev.ratings,
          [name]: parseFloat(value),
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
          <label className="block text-sm font-medium">{field.toUpperCase()}</label>
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
      <h3 className="text-lg font-semibold mt-6 mb-2">Valoraciones</h3>
      {Object.keys(formData.ratings).map((key) => (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium">{key}</label>
          <input
            type="number"
            name={key}
            min="0"
            max="5"
            step="0.1"
            value={formData.ratings[key]}
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
