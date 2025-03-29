import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import "../index.css";

const Home = () => {
  const [gestorias, setGestorias] = useState([]);
  const [provinciaFiltro, setProvinciaFiltro] = useState("");
  const [valoracionMin, setValoracionMin] = useState(0);
  const [orden, setOrden] = useState("");

  const fetchGestorias = async () => {
    try {
      const res = await axios.get("https://taxrating-backend.onrender.com/gestorias");
      setGestorias(res.data);
    } catch (err) {
      console.error("Error al cargar gestorías", err);
    }
  };

  useEffect(() => {
    fetchGestorias();
  }, []);

  const gestoriasFiltradas = gestorias
    .filter(g => {
      const rating = g.ratings?.["Valoración Global"] || 0;
      return (
        (provinciaFiltro === "" || g.province === provinciaFiltro) &&
        rating >= valoracionMin
      );
    })
    .sort((a, b) => {
      if (orden === "az") return a.name.localeCompare(b.name);
      if (orden === "za") return b.name.localeCompare(a.name);
      if (orden === "ratingUp") return (a.ratings?.["Valoración Global"] || 0) - (b.ratings?.["Valoración Global"] || 0);
      if (orden === "ratingDown") return (b.ratings?.["Valoración Global"] || 0) - (a.ratings?.["Valoración Global"] || 0);
      return 0;
    });

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center mb-4">TaxRating</h1>
        <p className="text-center mb-6">Valoraciones objetivas de gestorías y asesorías fiscales</p>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <select value={provinciaFiltro} onChange={(e) => setProvinciaFiltro(e.target.value)} className="p-2 border rounded">
            <option value="">Todas las provincias</option>
            {[...new Set(gestorias.map(g => g.province))].sort().map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={valoracionMin}
            onChange={(e) => setValoracionMin(Number(e.target.value))}
            placeholder="Valoración mínima"
            className="p-2 border rounded"
          />

          <select value={orden} onChange={(e) => setOrden(e.target.value)} className="p-2 border rounded">
            <option value="">Ordenar por...</option>
            <option value="az">Nombre A-Z</option>
            <option value="za">Nombre Z-A</option>
            <option value="ratingUp">Valoración ↑</option>
            <option value="ratingDown">Valoración ↓</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gestoriasFiltradas.map((g, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-4">
              <img src={g.image} alt={g.name} className="w-full h-40 object-cover rounded" />
              <h2 className="text-xl font-semibold mt-2">{g.name}</h2>
              <p className="text-sm text-gray-500">{g.province}</p>
              {g.website && (
                <a href={g.website} className="text-blue-500 block mt-1 flex items-center gap-1" target="_blank" rel="noreferrer">
                  <FaGlobe className="inline" /> <span className="underline">Ir a la web</span>
                </a>
              )}
              {g.location && (
                <a href={g.location} className="text-blue-500 block mt-1 flex items-center gap-1" target="_blank" rel="noreferrer">
                  <FaMapMarkerAlt className="inline" /> <span className="underline">Ver ubicación</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;