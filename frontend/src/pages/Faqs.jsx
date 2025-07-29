import React, { useState } from "react";

const Faqs = () => {
  const [perfil, setPerfil] = useState(""); // "" | "gestoria" | "cliente"

  const faqsGestoria = [
    {
      pregunta: "¿Qué es TaxRating?",
      respuesta: "Es una plataforma de auditoría fiscal profesional realizada por antiguos inspectores y técnicos de Hacienda..."
    },
    {
      pregunta: "¿Qué ventajas tiene para mi asesoría?",
      respuesta: "Reputación objetiva, confianza para clientes, posibilidad de obtener ingresos y descuentos..."
    },
    // ... (añadimos el resto luego)
  ];

  const faqsCliente = [
    {
      pregunta: "¿Qué es una auditoría fiscal de mi gestoría?",
      respuesta: "Es una revisión objetiva e independiente del trabajo fiscal que tu asesoría ha realizado..."
    },
    {
      pregunta: "¿Quién hace esa revisión?",
      respuesta: "Auditores fiscales con experiencia como inspectores y técnicos de Hacienda en excedencia..."
    },
    // ... (añadimos el resto luego)
  ];

  const faqs = perfil === "gestoria" ? faqsGestoria : perfil === "cliente" ? faqsCliente : [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Preguntas Frecuentes</h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setPerfil("gestoria")}
          className={`px-4 py-2 rounded ${
            perfil === "gestoria" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Soy una gestoría
        </button>
        <button
          onClick={() => setPerfil("cliente")}
          className={`px-4 py-2 rounded ${
            perfil === "cliente" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Soy cliente
        </button>
      </div>

      {faqs.length > 0 && (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="bg-gray-100 p-4 rounded">
              <summary className="cursor-pointer font-semibold">{faq.pregunta}</summary>
              <p className="mt-2 text-sm text-gray-700">{faq.respuesta}</p>
            </details>
          ))}
        </div>
      )}
    </div>
  );
};

export default Faqs;
