import React, { useState } from "react";
import axios from "axios";

const Formulario = () => {
  const [form, setForm] = useState({
    name: "",
    image: "",
    website: "",
    location: "",
    province: "",
    email: "",
    nif: "",
    promocode: ""
  });

  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const validarNIF = (nif) => {
    nif = nif.toUpperCase();
    const dniRegex = /^[0-9]{8}[A-Z]$/;
    const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;
    const cifRegex = /^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/;

    if (dniRegex.test(nif)) {
      const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
      const numero = parseInt(nif.substring(0, 8), 10);
      const letraCalculada = letras[numero % 23];
      return nif.charAt(8) === letraCalculada;
    } else if (nieRegex.test(nif)) {
      const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
      const nie = nif.replace("X", "0").replace("Y", "1").replace("Z", "2");
      const numero = parseInt(nie.substring(0, 8), 10);
      const letraCalculada = letras[numero % 23];
      return nif.charAt(8) === letraCalculada;
    } else if (cifRegex.test(nif)) {
      return true; // Valid basic format
    }
    return false;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.province || !form.email || !form.nif) {
      setError("Por favor, completa los campos obligatorios.");
      return;
    }
    if (!validarNIF(form.nif)) {
      setError("NIF no válido. Verifica el formato de DNI, NIE o CIF.");
      return;
    }
    try {
      await axios.post("https://taxrating-backend.onrender.com/gestorias", form);
      setEnviado(true);
      setError("");
    } catch {
      setError("Error al enviar los datos.");
    }
  };

  if (enviado) {
    return <p className="text-center text-green-600 text-lg mt-6">Gestoría enviada con éxito.</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-6 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Registrar nueva gestoría</h2>
      {error && <p className="text-red-600 text-sm mb-2 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Nombre <span className="text-red-600">*</span>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="border p-2 rounded w-full" />
        </label>
        <label>
          Imagen
          <input type="text" name="image" value={form.image} onChange={handleChange} className="border p-2 rounded w-full" />
        </label>
        <label>
          Página Web
          <input type="text" name="website" value={form.website} onChange={handleChange} className="border p-2 rounded w-full" />
        </label>
        <label>
          Ubicación (Google Maps)
          <input type="text" name="location" value={form.location} onChange={handleChange} className="border p-2 rounded w-full" />
        </label>
        <label>
          Provincia <span className="text-red-600">*</span>
          <input type="text" name="province" value={form.province} onChange={handleChange} className="border p-2 rounded w-full" />
        </label>
        <label>
          Email <span className="text-red-600">*</span>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="border p-2 rounded w-full" />
        </label>
        <label>
          NIF <span className="text-red-600">*</span>
          <input type="text" name="nif" value={form.nif} onChange={handleChange} className="border p-2 rounded w-full" />
        </label>
        <label>
          Código Recomendación/Promoción
          <input type="text" name="promocode" value={form.promocode} onChange={handleChange} className="border p-2 rounded w-full" />
        </label>
        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Enviar</button>
      </form>
    </div>
  );
};

export default Formulario;

