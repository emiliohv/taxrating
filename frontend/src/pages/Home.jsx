import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import "../index.css";

const Home = () => {
  const [gestorias, setGestorias] = useState([]);

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

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center mb-4">TaxRating</h1>
        <p className="text-center mb-6">Valoraciones objetivas de gestorías y asesorías fiscales</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gestorias.map((g, idx) => (
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
