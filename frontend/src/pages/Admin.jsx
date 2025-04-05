iimport React, { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const [gestorias, setGestorias] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [provinciaFiltro, setProvinciaFiltro] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [orden, setOrden] = useState("");
  const [servicios, setServicios] = useState([]);
  const [valoresMinimos, setValoresMinimos] = useState({});

  useEffect(() => {
    fetchGestorias();
  }, []);

  useEffect(() => {
    const todasProvincias = [...new Set(gestorias.map((g) => g.province))];
    const todosServicios = new Set();
    gestorias.forEach((g) => {
      Object.keys(g.ratings || {}).forEach((s) => todosServicios.add(s));
    });
    setServicios([...todosServicios]);
  }, [gestorias]);

  const fetchGestorias = async () => {
    try {
      const response = await axios.get("https://taxrating-backend.onrender.com/gestorias");
      setGestorias(response.data);
    } catch (error) {
      console.error("Error al obtener gestorías", error);
    }
  };

  const eliminarGestoria = async (id) => {
    try {
      await axios.delete(`https://taxrating-backend.onrender.com/gestorias/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await axios.post("https://hook.eu2.make.com/w68s5yb2z0o7is43nx4irydynkq37bl7", {
        id
      });
      fetchGestorias();
    } catch (error) {
      console.error("Error al eliminar gestoría", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    window.location.reload();
  };

  const gestorFiltrado = gestorias
    .filter((g) => !provinciaFiltro || g.province === provinciaFiltro)
    .filter((g) =>
      Object.entries(valoresMinimos).every(
        ([servicio, valor]) => (g.ratings?.[servicio] || 0) >= valor
      )
    )
    .sort((a, b) => {
      if (orden === "alfabetico-asc") return a.name.localeCompare(b.name);
      if (orden === "alfabetico-desc") return b.name.localeCompare(a.name);
      if (orden === "valoracion-asc") return a.ratingGlobal - b.ratingGlobal;
      if (orden === "valoracion-desc") return b.ratingGlobal - a.ratingGlobal;
      return 0;
    });

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Panel del Administrador</h1>
        {token && (
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-4 justify-between items-center bg-gray-100 p-4 rounded mb-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Provincia</label>
          <select
            value={provinciaFiltro}
            onChange={(e) => setProvinciaFiltro(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Todas</option>
            {[...new Set(gestorias.map((g) => g.province))].map((prov) => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
        >
          {mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
        </button>
        <div>
          <label className="block text-sm font-semibold mb-1">Ordenar por</label>
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Ninguno</option>
            <option value="alfabetico-asc">Alfabético (A-Z)</option>
            <option value="alfabetico-desc">Alfabético (Z-A)</option>
            <option value="valoracion-asc">Valoración (menor a mayor)</option>
            <option value="valoracion-desc">Valoración (mayor a menor)</option>
          </select>
        </div>
      </div>

      {mostrarFiltros && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {servicios.map((servicio) => (
            <div key={servicio}>
              <label className="block text-sm font-semibold mb-1">
                {servicio.replace(/_/g, " ")} mínima
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={valoresMinimos[servicio] || 0}
                onChange={(e) =>
                  setValoresMinimos({
                    ...valoresMinimos,
                    [servicio]: Number(e.target.value),
                  })
                }
              />
              <span className="text-sm ml-2">{valoresMinimos[servicio] || 0}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gestorFiltrado.map((g) => (
          <div key={g._id} className="border rounded p-4 relative bg-white shadow">
            <button
              className="absolute top-2 right-2 text-red-500 font-bold text-xl"
              onClick={() => eliminarGestoria(g._id)}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-1">{g.name}</h3>
            <p className="text-sm text-gray-700 mb-1">Provincia: {g.province}</p>
            <p className="text-sm text-gray-700 mb-2">Valoración Global: {g.ratingGlobal || "Sin valoración"}</p>
            {g.ratings && (
              <details>
                <summary className="cursor-pointer text-sm text-blue-600">Ver valoraciones</summary>
                <ul className="text-sm mt-1">
                  {Object.entries(g.ratings).map(([serv, val]) => (
                    <li key={serv}>
                      {serv.replace(/_/g, " ")}: {val.toFixed(1)}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
