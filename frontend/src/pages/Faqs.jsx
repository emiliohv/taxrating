import React, { useState } from "react";

const Faqs = () => {
  const [perfil, setPerfil] = useState(""); // "" | "gestoria" | "cliente"

  const faqsGestoria = [
    {
      pregunta: "¿Qué es TaxRating?",
      respuesta:
        "Es una plataforma de auditoría fiscal profesional realizada por antiguos inspectores y técnicos de Hacienda, que evalúan la calidad del trabajo fiscal realizado por tu gestoría."
    },
    {
      pregunta: "¿Qué ventajas tiene para mi asesoría?",
      respuesta:
        "Mejora de reputación profesional, atracción de nuevos clientes, visibilidad online, posibilidad de ingresos extra y acceso a informes de calidad desde el punto de vista fiscal. También compartirá con nosotros la responsabilidad de las eventuales contingencias que pudieran surgir en el ejercicio de revisión."
    },
    {
      pregunta: "¿Quién realiza las auditorías fiscales?",
      respuesta:
        "Siempre serán realizadas por antiguos Inspectores y Técnicos de Hacienda en excedencia, con experiencia previa en tareas de comprobación tributaria para la Administración Pública."
    },
    {
      pregunta: "¿Cómo se evalúa nuestro trabajo?",
      respuesta:
        "Se revisan aspectos como la aplicación correcta de la normativa fiscal, cumplimiento de obligaciones y riesgos de inspección."
    },
    {
      pregunta: "¿Cuál es el coste del servicio para las gestorías?",
      respuesta:
        "Una cuota mensual fija, igual para todas. Se puede obtener un descuento permanente del 20% por cada asesoría a la que nos recomienden y permanezcan activas, por lo que el servicio puede llegar a ser gratuito para ellas."
    },
    {
      pregunta: "¿Puedo ganar ingresos como asesoría?",
      respuesta:
        "Sí, si consigues un cliente que contrate una auditoría, recibes un 20% de lo facturado por nuestra parte, en concepto de preparación documental y captación del cliente."
    },
    {
      pregunta: "¿Cómo me doy de alta como gestoría?",
      respuesta:
        "Desde la sección 'Formulario'/'Alta nueva asesoría' de la web. Solo necesitas rellenar el formulario con los datos requeridos y estarás visible tras verificación."
    },
    {
      pregunta: "¿Qué pasa si un cliente solicita una auditoría sobre mí?",
      respuesta:
        "Recibirás una notificación. Si colaboras en la preparación de la documentación, también recibirás el 20% correspondiente como compensación."
    },
    {
      pregunta: "¿Qué ocurre si la auditoría es negativa?",
      respuesta:
        "La información te será comunicada y podrás usarla para mejorar. El informe solo se publica si el cliente lo autoriza. Siempre buscamos ayudarte, no penalizarte."
    },
    {
      pregunta: "¿Mis valoraciones son públicas?",
      respuesta:
        "Solo si el cliente lo autoriza. Tú siempre tendrás acceso al resultado, independientemente de si se publica."
    }
  ];

  const faqsCliente = [
    {
      pregunta: "¿Qué es una auditoría fiscal de mi gestoría?",
      respuesta:
        "Es una revisión objetiva e independiente del trabajo fiscal que tu asesoría ha realizado durante un ejercicio económico."
    },
    {
      pregunta: "¿Quién realiza la auditoría?",
      respuesta:
        "Siempre las realizarán antiguos Inspectores y Técnicos de Hacienda, con experiencia en tareas de control tributario. No tienen relación ni contigo ni con tu gestoría, por lo que actúan con plena independencia y objetividad."
    },
    {
      pregunta: "¿Qué utilidad tiene para mí?",
      respuesta:
        "Saber si estás pagando correctamente tus impuestos, si podrías haber optimizado tu situación fiscal y detectar errores o riesgos antes de que lo haga Hacienda. Además, obtener una segunda opinión contribuye a tu tranquilidad y a despejar las dudas que puedas tener sobre el trabajo de tu gestor/asesor."
    },
    {
      pregunta: "¿Qué documentación tengo que aportar?",
      respuesta:
        "Modelos presentados si los conservas (IVA, IRPF o IS), libros registro o contables, documentación justificativa y otros documentos básicos. Tu asesoría puede ayudarte si lo autorizas."
    },
    {
      pregunta: "¿Es confidencial?",
      respuesta:
        "Sí. Solo tú y el equipo auditor tendréis acceso a los datos, salvo que decidas compartir el resultado con tu asesoría."
    },
    {
      pregunta: "¿Cuánto cuesta una auditoría?",
      respuesta:
        "El precio es del 120% de lo que pagaste a tu gestoría ese ejercicio, con un mínimo de 2.000€ + IVA. Esto incluye también el trabajo de documentación que tenemos que pagar a tu gestoría."
    },
    {
      pregunta: "¿Qué incluye ese precio?",
      respuesta:
        "Auditoría fiscal completa, informe de calidad, evaluación de riesgos y optimización, posibilidad de compartirlo con tu asesoría, y soporte para resolver errores si se detectan."
    },
    {
      pregunta: "¿Puedo usar el informe ante Hacienda?",
      respuesta:
        "Sí. Aunque no sustituye a un informe oficial, puede ayudarte a corregir errores o defenderte con base técnica si se iniciara una comprobación o inspección."
    },
    {
      pregunta: "¿Puedo cambiar de asesoría si encuentro una mejor valorada?",
      respuesta:
        "Sí. En nuestra plataforma puedes consultar otras gestorías activas, ver su valoración y contactar directamente con ellas si lo deseas."
    },
    {
      pregunta: "¿Puedo hacer una auditoría sin que mi asesoría lo sepa?",
      respuesta:
        "Sí. El proceso puede mantenerse completamente confidencial si así lo decides. Solo se informará a tu asesoría si das tu consentimiento."
    }
  ];

  const faqs = perfil === "gestoria" ? faqsGestoria : perfil === "cliente" ? faqsCliente : [];

  return (
    <>
     
  <div className="p-3"></div>
    <div className="text-center mb-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">TaxRating</h1>
      <p className="text-gray-600 text-lg">
        Valoraciones objetivas de gestorías y asesorías fiscales, realizadas por empleados de la Agencia Tributaria en excedencia
      </p>
    </div>
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
    </>
  );
};

export default Faqs;
