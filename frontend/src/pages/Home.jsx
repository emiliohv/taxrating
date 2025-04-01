""import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import "../index.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [gestorias, setGestorias] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minRatings, setMinRatings] = useState({});
  const [sortOption, setSortOption] = useState("");
  const [availableProvinces, setAvailableProvinces] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);

  useEffect(() => {
    axios.get("https://taxrating-backend.onrender.com/gestorias")
      .then((res) => {
        setGestorias(res.data);
        const provinces = [...new Set(res.data.map(g => g.province).filter(Boolean))];
        setAvailableProvinces(provinces);

        const services = new Set();
        res.data.forEach(g => {
          if (g.ratings) {
            Object.keys(g.ratings).forEach(s => {
              if (s !== "Valoraciones" && s !== "Valoración_Global") {
                services.add(s);
              }
            });
          }
        });
        setAvailableServices([...services]);
      })
      .catch((err) => console.error("Error al cargar gestorías", err));
  }, []);

  const filteredGestorias = gestorias.filter(g => {
    if (selectedProvince && g.province !== selectedProvince) return false;
    return Object.entries(minRatings).every(([key, val]) => {
      const realKey = key.replace(/_/g, " ");
      return !val || (g.ratings && g.ratings[realKey] >= val);
    });
  });

  const sortedGestorias = [...filteredGestorias].sort((a, b) => {
    if (sortOption === "asc") return a.name.localeCompare(b.name);
    if (sortOption === "desc") return b.name.localeCompare(a.name);
    if (sortOption === "val") return (b.ratingGlobal || 0) - (a.ratingGlobal || 0);
    return 0;
  });

  return (
    <div>
      <Navbar />
      <div className="p-4 text-center">
        <h1 className="text-3xl font-bold mb-2">TaxRating</h1>
        <p className="text-lg mb-4">Valoraciones objetivas de gestorías y asesorías fiscales</p>

        <div className="flex flex-wrap justify-between items-center mb-4">
          <div>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Todas las provincias</option>
              {availableProvinces.map((prov, i) => (
                <option key={i} value={prov}>{prov}</option>
              ))}
            </select>
          </div>

          <div className="space-x-2">
            <button
              onClick={() => setSortOption("asc")}
              className="bg-gray-200 px-3 py-1 rounded"
            >A-Z</button>
            <button
              onClick={() => setSortOption("desc")}
              className="bg-gray-200 px-3 py-1 rounded"
            >Z-A</button>
            <button
              onClick={() => setSortOption("val")}
              className="bg-gray-200 px-3 py-1 rounded"
            >Mejor valoradas</button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >{showFilters ? "Ocultar filtros" : "Mostrar filtros"}</button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-6">
            {availableServices.map(service => (
              <div key={service} className="my-2">
                <label className="block font-semibold">{service}</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={minRatings[service.replace(/ /g, "_")] || 0}
                  onChange={(e) =>
                    setMinRatings({
                      ...minRatings,
                      [service.replace(/ /g, "_")]: parseInt(e.target.value),
                    })
                  }
                />
                <span className="ml-2">{minRatings[service.replace(/ /g, "_")] || 0}</span>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sortedGestorias.map((g, idx) => (
            <div key={idx} className="bg-white rounded shadow-md p-4">
              <img src={g.image} alt={g.name} className="w-full h-40 object-cover rounded" />
              <h2 className="text-xl font-bold mt-2">{g.name}</h2>
              <p className="text-sm text-gray-600 flex items-center"><FaMapMarkerAlt className="mr-1" /> {g.province}</p>
              <p className="text-sm text-gray-600 flex items-center"><FaGlobe className="mr-1" /><a href={g.website} target="_blank" rel="noopener noreferrer">Web</a></p>
              <p className="text-sm mt-2 font-semibold">
                Valoración Global: {g.ratingGlobal ? g.ratingGlobal.toFixed(1) : "Sin valoraciones"}
              </p>
              <p className="text-sm font-semibold">
                Valoraciones: {g.Valoraciones > 0 ? parseInt(g.Valoraciones) : "Sin valoraciones"}
              </p>
              <details className="mt-2">
                <summary className="cursor-pointer text-blue-500">Mostrar servicios valorados</summary>
                <div className="mt-2">
                  {Object.entries(g.ratings || {}).map(([key, value]) => (
                    key !== "Valoraciones" && key !== "Valoración_Global" && (
                      <p key={key} className="text-sm">{key}: {value?.toFixed(1)}</p>
                    )
                  ))}
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

