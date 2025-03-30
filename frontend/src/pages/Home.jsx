import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import "../index.css";

const Home = () => {
  const [gestorias, setGestorias] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [province, setProvince] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sortOrder, setSortOrder] = useState("");

  const fetchGestorias = async () => {
    try {
      const res = await axios.get("https://taxrating-backend.onrender.com/gestorias");
      setGestorias(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Error al cargar gestorías", err);
    }
  };

  useEffect(() => {
    fetchGestorias();
  }, []);

  useEffect(() => {
    let data = [...gestorias];

    if (province) {
      data = data.filter((g) => g.province === province);
    }

    data = data.filter((g) => (g.ratingGlobal || 0) >= minRating);

    if (sortOrder === "asc") {
      data.sort((a, b) => (a.ratingGlobal || 0) - (b.ratingGlobal || 0));
    } else if (sortOrder === "desc") {
      data.sort((a, b) => (b.ratingGlobal || 0) - (a.ratingGlobal || 0));
    } else if (sortOrder === "alpha") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFiltered(data);
  }, [province, minRating, sortOrder, gestorias]);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center mb-2">TaxRating</h1>
        <p className="text-center mb-4">Valoraciones objetivas de gestorías y asesorías fiscales</p>

        <div className="flex justify-center mb-6">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
          </button>
        </div>

        {showFilters && (
          <div className="bg-white shadow-md rounded p-4 mb-6 flex flex-col md:flex-row justify-between gap-4">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium">Provincia</label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded shadow-sm"
              />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium">Valoración mínima</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full"
              />
              <span>{minRating.toFixed(1)}</span>
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium">Ordenar por</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded shadow-sm"
              >
                <option value="">Ninguno</option>
                <option value="asc">Valoración ascendente</option>
                <option value="desc">Valoración descendente</option>
                <option value="alpha">Orden alfabético</option>
              </select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((g, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-4">
              <img src={g.image} alt={g.name} className="w-full h-40 object-cover rounded" />
              <h2 className="text-xl font-semibold mt-2">{g.name}</h2>
              <p className="text-sm text-gray-500">{g.province}</p>
              <p className="text-sm font-medium text-yellow-600">
                Valoración: {g.ratingGlobal?.toFixed(1) || "N/A"}
              </p>
              {g.website && (
                <a
                  href={g.website}
                  className="text-blue-500 block mt-1 flex items-center gap-1"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaGlobe className="inline" /> <span className="underline">Ir a la web</span>
                </a>
              )}
              {g.location && (
                <a
                  href={g.location}
                  className="text-blue-500 block mt-1 flex items-center gap-1"
                  target="_blank"
                  rel="noreferrer"
                >
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
