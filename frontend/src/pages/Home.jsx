import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import "../index.css";

const getColorClass = (valoracion) => {
  if (valoracion >= 4) return "text-green-600";
  if (valoracion >= 2.5) return "text-yellow-600";
  if (valoracion > 0) return "text-red-600";
  return "text-gray-600";
};

const Home = () => {
  const [gestorias, setGestorias] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [orden, setOrden] = useState("");
  const [filtrosValoracion, setFiltrosValoracion] = useState({});

  useEffect(() => {
    axios.get("https://taxrating-backend.onrender.com/gestorias")
      .then(res => {
        setGestorias(res.data);
        const provinciasUnicas = [...new Set(res.data.map(g => g.province))];
        setProvincias(provinciasUnicas);
      })
      .catch(err => console.error("Error al cargar gestorías", err));
  }, []);

  const gestorFiltrado = gestor => {
    if (provinciaSeleccionada && gestor.province !== provinciaSeleccionada) return false;
    for (let [key, val] of Object.entries(filtrosValoracion)) {
      if ((gestor.ratings?.[key] || 0) < val) return false;
    }
    return true;
  };

  const gestorOrdenado = [...gestorias.filter(gestorFiltrado)].sort((a, b) => {
    if (orden === "alfabetico-asc") return a.name.localeCompare(b.name);
    if (orden === "alfabetico-desc") return b.name.localeCompare(a.name);
    if (orden === "valoracion-asc") return a.ratingGlobal - b.ratingGlobal;
    if (orden === "valoracion-desc") return b.ratingGlobal - a.ratingGlobal;
    return 0;
  });

  const serviciosValorados = [...new Set(
    gestorias.flatMap(g => Object.keys(g.ratings || {}))
      .filter(s => s !== "Valoraciones" && s !== "Valoración Global")
  )];

  return (
    <div>
      
      <div className="p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">TaxRating</h1>
          <p className="text-gray-600 text-lg">Valoración objetiva de gestorías y asesorías fiscales, realizada por antiguos empleados de la Agencia Tributaria</p>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-6 mb-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block mb-1 font-medium">Provincia</label>
            <select
              value={provinciaSeleccionada}
              onChange={(e) => setProvinciaSeleccionada(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
            >
              <option value="">Todas</option>
              {provincias.map((provincia, idx) => (
                <option key={idx} value={provincia}>{provincia}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px] text-center">
            <label className="block mb-1 invisible">.</label>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
            >
              {mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
            </button>
          </div>
          <div className="flex-1 min-w-[200px] text-right">
            <label className="block mb-1 font-medium">Ordenar por</label>
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
            >
              <option value="">Sin orden</option>
              <option value="alfabetico-asc">Nombre A-Z</option>
              <option value="alfabetico-desc">Nombre Z-A</option>
              <option value="valoracion-asc">Valoración ↑</option>
              <option value="valoracion-desc">Valoración ↓</option>
            </select>
          </div>
        </div>

        {mostrarFiltros && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Filtrar por servicios valorados (mínimo)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {serviciosValorados.map(servicio => (
                <div key={servicio}>
                  <label className="block text-sm font-medium">{servicio}</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={filtrosValoracion[servicio] || 0}
                    onChange={(e) => setFiltrosValoracion(prev => ({ ...prev, [servicio]: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">Desde {filtrosValoracion[servicio] || 0}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gestorOrdenado.map((g, idx) => {
            const valoraciones = g.ratings?.["Valoraciones"] || 0;
            return (
              <div key={idx} className="bg-white rounded-lg shadow-md p-4">
                <img src={g.image} alt={g.name} className="w-full h-40 object-cover rounded" />
                <h2 className="text-xl font-semibold mt-2">{g.name}</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <FaMapMarkerAlt /> {g.province}
                </p>
                <p className={`text-sm ${getColorClass(g.ratingGlobal)} font-semibold`}>
                  Valoración Global: {g.ratingGlobal != null ? g.ratingGlobal.toFixed(1) : "Sin valoraciones"}
                </p>
                <p className="text-sm text-gray-600">
                  Valoraciones: {valoraciones > 0 ? parseInt(valoraciones) : "Sin valoraciones"}
                </p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600">Ver servicios valorados</summary>
                  <div className="mt-2">
                    {Object.entries(g.ratings || {}).map(([key, value]) => (
                      key !== "Valoraciones" && key !== "Valoración Global" && (
                        <p key={key} className={`text-sm ${getColorClass(value)}`}>{key}: {value?.toFixed(1)}</p>
                      )
                    ))}
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
