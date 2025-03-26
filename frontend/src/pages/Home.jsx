import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import "../index.css";

const Home = () => {
  const [gestorias, setGestorias] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/gestorias")
      .then((res) => setGestorias(res.data))
      .catch((err) => console.error("Error al cargar gestorías", err));
  }, []);

  const getColorClass = (value) => {
    if (value >= 4) return "text-green-600 font-semibold";
    if (value >= 3) return "text-yellow-600 font-semibold";
    if (value > 0) return "text-red-600 font-semibold";
    return "text-gray-500 italic";
  };

  return (
    <>
      
      <div className="text-center mt-10 mb-10">
        <h1 className="text-6xl font-black text-blue-900 tracking-wide drop-shadow-sm">TaxRating</h1>
        <p className="text-gray-600 text-lg mt-3 italic">Valoraciones objetivas de gestorías y asesorías fiscales</p>
      </div>
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Gestorías y Asesorías</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gestorias.map((g, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-4 relative">
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
              {g.ratings?.["Valoración Global"] ? (
                <p className={`mt-2 ${getColorClass(g.ratings["Valoración Global"])}`}>
                  Valoración global: {g.ratings["Valoración Global"]}
                </p>
              ) : (
                <p className="text-gray-500 italic mt-2">Sin valoraciones</p>
              )}
              {g.ratings && Object.keys(g.ratings).length > 1 && (
                <details className="mt-2">
                  <summary className="text-blue-600 cursor-pointer underline">Ver valoraciones</summary>
                  <ul className="text-sm mt-1">
                    {Object.entries(g.ratings).map(
                      ([key, value]) => key !== "Valoración Global" && (
                        <li key={key} className={getColorClass(value)}>
                          {key}: {value}
                        </li>
                      )
                    )}
                  </ul>
                </details>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
