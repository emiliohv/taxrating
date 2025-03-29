import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import "../index.css";

const Admin = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [gestorias, setGestorias] = useState([]);
  const [error, setError] = useState("");
  const [provinciaFiltro, setProvinciaFiltro] = useState("");
  const [valoracionMin, setValoracionMin] = useState(0);
  const [orden, setOrden] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append("username", credentials.username);
      params.append("password", credentials.password);

      const res = await axios.post("https://taxrating-backend.onrender.com/token", params);
      localStorage.setItem("token", res.data.access_token);
      setToken(res.data.access_token);
      setError("");
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  const fetchGestorias = async () => {
    try {
      const res = await axios.get("https://taxrating-backend.onrender.com/gestorias");
      setGestorias(res.data);
    } catch (err) {
      console.error("Error al cargar gestorías", err);
    }
  };

  const deleteGestoria = async (id) => {
    try {
      await axios.delete(`https://taxrating-backend.onrender.com/gestorias/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGestorias(gestorias.filter((g) => g._id?.$oid !== id && g._id !== id));
    } catch (err) {
      console.error("Error al eliminar gestoría", err);
      if (err.response && err.response.status === 401) {
        setError("Sesión expirada. Vuelve a iniciar sesión.");
        localStorage.removeItem("token");
        setToken("");
      }
    }
  };

  useEffect(() => {
    if (token) fetchGestorias();
  }, [token]);

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

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <Navbar />
        <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
          <h2 className="text-xl font-bold mb-4">Iniciar sesión como administrador</h2>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <input
            type="text"
            placeholder="Usuario"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mb-3"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Panel de Administrador</h2>

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
              <button
                onClick={() => deleteGestoria(g._id?.$oid || g._id)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Admin;
