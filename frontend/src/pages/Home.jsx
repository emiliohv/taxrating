import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import "../index.css";

const Home = () => {
  const [gestorias, setGestorias] = useState([]);
  const [filteredGestorias, setFilteredGestorias] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [minRatings, setMinRatings] = useState({});
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    axios.get("https://taxrating-backend.onrender.com/gestorias")
      .then(res => {
        setGestorias(res.data);
        setFilteredGestorias(res.data);
        const provs = [...new Set(res.data.map(g => g.province))];
        setProvinces(provs);
      })
      .catch(err => console.error("Error al cargar gestorías", err));
  }, []);

  useEffect(() => {
    let filtered = gestorias.filter(g => {
      if (selectedProvince && g.province !== selectedProvince) return false;
      for (let key in minRatings) {
        if ((g.ratings?.[key] || 0) < minRatings[key]) return false;
      }
      return true;
    });

    if (sortOption === "alphaAsc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "alphaDesc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === "ratingAsc") {
      filtered.sort((a, b) => (a.ratingGlobal || 0) - (b.ratingGlobal || 0));
    } else if (sortOption === "ratingDesc") {
      filtered.sort((a, b) => (b.ratingGlobal || 0) - (a.ratingGlobal || 0));
    }

    setFilteredGestorias(filtered);
  }, [gestorias, selectedProvince, minRatings, sortOption]);

  const handleRatingChange = (key, value) => {
    setMinRatings(prev => ({ ...prev, [key]: parseFloat(value) }));
  };

  const ratingColor = (val) => {
    if (val >= 4) return "text-green-600";
    if (val >= 2.5) return "text-yellow-600";
    if (val > 0) return "text-red-600";
    return "text-gray-500";
  };

  const ratingKeys = Object.keys(
    gestorias.reduce((acc, g) => ({ ...acc, ...g.ratings }), {})
  ).filter(k => k !== "Valoraciones" && k !== "Valoración Global");

  return (
    <div>
     
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <label className="mr-2 font-semibold">Provincia:</label>
            <select value={selectedProvince} onChange={e => setSelectedProvince(e.target.value)} className="p-1 border rounded">
              <option value="">Todas</option>
              {provinces.map((prov, idx) => (
                <option key={idx} value={prov}>{prov}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <label className="font-semibold">Ordenar por:</label>
            <select value={sortOption} onChange={e => setSortOption(e.target.value)} className="p-1 border rounded">
              <option value="">Ninguno</option>
              <option value="alphaAsc">Nombre A-Z</option>
              <option value="alphaDesc">Nombre Z-A</option>
              <option value="ratingAsc">Valoración Menor</option>
              <option value="ratingDesc">Valoración Mayor</option>
            </select>
            <button onClick={() => setShowFilters(!showFilters)} className="bg-blue-500 text-white px-2 py-1 rounded">
              {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {ratingKeys.map((key, idx) => (
              <div key={idx}>
                <label>{key}</label>
                <input type="range" min="0" max="5" step="0.1" value={minRatings[key] || 0} onChange={e => handleRatingChange(key, e.target.value)} className="w-full" />
                <p>{minRatings[key] || 0}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGestorias.map((g, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-4">
              <img src={g.image} alt={g.name} className="w-full h-40 object-cover rounded" />
              <h2 className="text-xl font-bold mt-2">{g.name}</h2>
              <p className="text-sm text-gray-600 flex items-center"><FaMapMarkerAlt className="mr-1" /> {g.province}</p>
              {g.website && (
                <p className="text-sm text-blue-600 flex items-center"><FaGlobe className="mr-1" /><a href={g.website} target="_blank" rel="noreferrer">Sitio web</a></p>
              )}
              <p className={`text-sm ${ratingColor(g.ratingGlobal)}`}>Valoración Global: {g.ratingGlobal != null ? g.ratingGlobal.toFixed(1) : "Sin valoraciones"}</p>
              <p className="text-sm text-gray-600">
                Valoraciones: {g.ratings?.["Valoraciones"] > 0 ? parseInt(g.ratings["Valoraciones"]) : "Sin valoraciones"}
              </p>
              {g.ratings && Object.keys(g.ratings).length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-blue-600">Ver servicios valorados</summary>
                  <div className="mt-2">
                    {Object.entries(g.ratings).map(([key, value]) => (
                      key !== "Valoraciones" && key !== "Valoración Global" && (
                        <p key={key} className={`text-sm ${ratingColor(value)}`}>{key}: {value.toFixed(1)}</p>
                      )
                    ))}
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
