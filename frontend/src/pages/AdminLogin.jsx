import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Intentando iniciar sesión con:", username, password); // <-- AÑADE ESTO
    try {
      const response = await axios.post("https://taxrating-backend.onrender.com/token", {
        username,
        password,
      });
      console.log("Respuesta del backend:", response); // <-- Y ESTO
      localStorage.setItem("token", response.data.access_token);
      navigate("/admin");
    } catch (error) {
      console.error("Error al hacer login:", error); // <-- Y ESTO TAMBIÉN
      setError("Credenciales incorrectas");
    }
  };
  
  
  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Login Administrador</h2>
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
