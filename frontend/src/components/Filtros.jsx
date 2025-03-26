
import React from "react";

const servicios = [
  "IRPF",
  "IS",
  "IVA",
  "Consolidación Fiscal",
  "Asesoría Internacional",
];

const Filtros = ({ filtros, setFiltros }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: parseFloat(value) });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded border">
      {servicios.map((servicio) => (
        <div key={servicio}>
          <label className="block text-sm font-medium mb-1">
            {servicio} ≥ {filtros[servicio] || 0}
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            name={servicio}
            value={filtros[servicio] || 0}
            onChange={handleChange}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            style={{
              accentColor: "#1e40af",
              boxShadow: "0 0 4px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default Filtros;
