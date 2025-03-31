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
  const [minRatings, setMinRatings] = useState({});
  const [sortOrder, setSortOrder] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [expanded, setExpanded] = useState({});

  const services = [
    "IRPF",
    "IS",
    "IVA",
    "Consolidación_Fiscal",
    "Asesoría_Internacional"
  ];

  const fetchGestorias = async () => {
    try {
      const res = await axios.get("https://taxrating-backend.onrender.com/gestorias");
      setGestorias(res.data);
      setFiltered(res.data);
      const uniqueProvinces = [...new Set(res.data.map(g => g.province))];
      setProvinces(uniqueProvinces);
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

    services.forEach(service => {
      if (minRatings[service] != null) {
        data = data.filter(g => {
          const rating = g.ratings?.[service] || 0;
          return rating >= minRatings[service];
        });
      }
    });

    if (sortOrder === "asc") {
      data.sort((a, b) => (a.ratingGlobal || 0) - (b.ratingGlobal || 0));
    } else if (sortOrder === "desc") {
      data.sort((a, b) => (b.ratingGlobal || 0) - (a.ratingGlobal || 0));
    } else if (sortOrder === "alpha") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "alphaDesc") {
      data.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFiltered(data);
  }, [province, minRatings, sortOrder, gestorias]);

  const toggleExpand = (idx) => {
    setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getColor = (value) => {
    if (value >= 4) return "text-green-600";
    if (value >= 2) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center mb-2">TaxRating</h1>
        <p className="text-center mb-4">Valoraciones objetivas de gestorías y asesorías fiscales</p>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium">Provincia</label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded shadow-sm"
            >
              <option value="">Todas</option>
              {provinces.map((prov, idx) => (
                <option key={idx} value={prov}>{prov}</option>
              ))}
            </select>
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
              <option value="alpha">Nombre A-Z</option>
              <option value="alphaDesc">Nombre Z-A</option>
            </select>
          </div>

          <div className="w-full md:w-1/3 flex justify-center">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-5 md:mt-0"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white shadow-md rounded p-4 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(service => (
              <div key={service}>
                <label className="block text-sm font-medium">{service}</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={minRatings[service] || 0}
                  onChange={(e) => setMinRatings(prev => ({ ...prev, [service]: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <span>{minRatings[service] || 0}</span>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((g, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-4">
              <img src={g.image} alt={g.name} className="w-full h-40 object-cover rounded" />
              <h2 className="text-xl font-semibold mt-2">{g.name}</h2>
              <p className="text-sm text-gray-500">{g.province}</p>
              <p className={`text-sm font-medium ${getColor(g.ratingGlobal)}`}>
                Valoración Global: {g.ratingGlobal != null ? g.ratingGlobal.toFixed(1) : "Sin valoraciones"}
              </p>
              <p className="text-sm text-gray-600">
                Valoraciones: {g.Valoraciones && g.Valoraciones > 0 ? parseInt(g.Valoraciones) : "Sin valoraciones"}
              </p>
              <button
                onClick={() => toggleExpand(idx)}
                className="text-blue-600 mt-2 underline"
              >
                {expanded[idx] ? "Ocultar servicios" : "Mostrar servicios valorados"}
              </button>
              {expanded[idx] && (
                <div className="mt-2">
                  {Object.entries(g.ratings || {}).map(([key, value]) => (
                    <p key={key} className={`text-sm ${getColor(value)}`}>{key}: {value?.toFixed(1)}</p>
                  ))}
                </div>
              )}
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
