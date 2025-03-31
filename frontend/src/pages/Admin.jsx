import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import "../index.css";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [gestorias, setGestorias] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const navigate = useNavigate();

  const fetchGestorias = async () => {
    try {
      const res = await axios.get("https://taxrating-backend.onrender.com/gestorias", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGestorias(res.data);
    } catch (err) {
      console.error("Error al cargar gestorías", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchGestorias();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://taxrating-backend.onrender.com/token", {
        username,
        password
      }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      localStorage.setItem("token", res.data.access_token);
      setToken(res.data.access_token);
      setIsLoggedIn(true);
    } catch (err) {
      alert("Credenciales incorrectas");
    }
  };

  const deleteGestoria = async (id) => {
    try {
      await axios.delete(`https://taxrating-backend.onrender.com/gestorias/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGestorias(gestorias.filter(g => g._id !== id));
    } catch (err) {
      console.error("Error al eliminar gestoría", err);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
          <h2 className="text-xl font-semibold mb-4 text-center">Acceso Administrador</h2>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-3"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
            Iniciar sesión
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      
      <div className="p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Panel de Administración</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gestorias.map((g, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-4">
              <img src={g.image} alt={g.name} className="w-full h-40 object-cover rounded" />
              <h2 className="text-xl font-semibold mt-2">{g.name}</h2>
              <p className="text-sm text-gray-500">{g.province}</p>
              <p className="text-sm text-gray-600">
                Valoración Global: {g.ratingGlobal != null ? g.ratingGlobal.toFixed(1) : "Sin valoraciones"}
              </p>
              <p className="text-sm text-gray-600">
                Valoraciones: {g.Valoraciones && g.Valoraciones > 0 ? parseInt(g.Valoraciones) : "Sin valoraciones"}
              </p>
              <div className="mt-2">
                {Object.entries(g.ratings || {}).map(([key, value]) => (
                  <p key={key} className="text-sm">{key}: {value?.toFixed(1)}</p>
                ))}
              </div>
              <button
                onClick={() => deleteGestoria(g._id)}
                className="text-red-500 mt-2 underline"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
