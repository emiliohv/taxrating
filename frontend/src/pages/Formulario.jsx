import React, { useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const Formulario = () => {
  // --- selector de perfil (mismo estilo que en FAQs) ---
  const [perfil, setPerfil] = useState("gestoria"); // "gestoria" | "cliente"

  // --- estado recaptcha compartido ---
  const [recaptchaToken, setRecaptchaToken] = useState("");

  // --- estado formulario gestoría (igual que tenías) ---
  const [form, setForm] = useState({
    name: "",
    image: "",
    website: "",
    location: "",
    province: "",
    email: "",
    nif: "",
    promocode: "",
  });

  // --- estado formulario cliente ---
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  // ---------- util NIF (igual que tenías) ----------
  const validarNIF = (nif) => {
    nif = (nif || "").toUpperCase();
    const dniRegex = /^[0-9]{8}[A-Z]$/;
    const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;
    const cifRegex = /^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/;

    if (dniRegex.test(nif)) {
      const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
      const numero = parseInt(nif.substring(0, 8), 10);
      const letraCalculada = letras[numero % 23];
      return nif.charAt(8) === letraCalculada;
    } else if (nieRegex.test(nif)) {
      const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
      const nie = nif.replace("X", "0").replace("Y", "1").replace("Z", "2");
      const numero = parseInt(nie.substring(0, 8), 10);
      const letraCalculada = letras[numero % 23];
      return nif.charAt(8) === letraCalculada;
    } else if (cifRegex.test(nif)) {
      return true; // formato básico válido
    }
    return false;
  };

  // ---------- handlers ----------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleContactChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  // ---------- submit gestoría ----------
  const handleSubmitGestoria = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.province || !form.email || !form.nif) {
      setError("Por favor, completa los campos obligatorios.");
      return;
    }
    if (!validarNIF(form.nif)) {
      setError("NIF no válido. Verifica el formato de DNI, NIE o CIF.");
      return;
    }
    if (!recaptchaToken) {
      setError("Por favor, verifica que no eres un robot.");
      return;
    }

    try {
      await axios.post("https://taxrating-backend.onrender.com/gestorias", {
        ...form,
        ratings: {},
        recaptcha: recaptchaToken,
      });
      setEnviado(true);
      setError("");
    } catch (err) {
      console.error("Respuesta del servidor:", err.response);
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join(" | "));
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Error inesperado. Intenta más tarde.");
      }
    }
  };

  // ---------- submit cliente ----------
  const handleSubmitCliente = async (e) => {
    e.preventDefault();
    setError("");

    if (!contact.email || !contact.name) {
      setError("Por favor, indica al menos tu nombre/razón social y un email.");
      return;
    }
    if (!contact.subject && !contact.message) {
      setError("Añade un asunto o explica brevemente tu necesidad.");
      return;
    }
    if (!recaptchaToken) {
      setError("Por favor, verifica que no eres un robot.");
      return;
    }

    try {
      await axios.post("https://taxrating-backend.onrender.com/contacto", {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        subject: contact.subject,
        message: contact.message,
        recaptcha: recaptchaToken,
      });
      setEnviado(true);
      setError("");
    } catch (err) {
      console.error("Respuesta del servidor:", err.response);
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join(" | "));
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("No se pudo enviar tu mensaje. Intenta más tarde.");
      }
    }
  };

  if (enviado) {
    return (
      <p className="text-center text-green-600 text-lg mt-6">
        {perfil === "gestoria"
          ? "Asesoría enviada con éxito."
          : "Mensaje enviado con éxito. Te contactaremos en breve."}
      </p>
    );
  }

  return (
    <>
      <div className="p-3"></div>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-4" style={{ color: "#002663" }}>
          TaxRating
        </h1>
        <p className="text-gray-600 text-lg">
          Valoraciones objetivas de gestorías y asesorías fiscales, realizadas por
          empleados de la Agencia Tributaria en excedencia
        </p>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Formulario</h1>

        {/* Selector de perfil: mismos estilos que en FAQs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => {
              setPerfil("gestoria");
              setError("");
              setEnviado(false);
              setRecaptchaToken("");
            }}
            style={{
              backgroundColor: perfil === "gestoria" ? "#002663" : "",
              color: perfil === "gestoria" ? "white" : "",
            }}
            className={`px-4 py-2 rounded ${
              perfil !== "gestoria" ? "bg-gray-200" : ""
            }`}
          >
            Asesorías fiscales/gestorías
          </button>

          <button
            onClick={() => {
              setPerfil("cliente");
              setError("");
              setEnviado(false);
              setRecaptchaToken("");
            }}
            style={{
              backgroundColor: perfil === "cliente" ? "#002663" : "",
              color: perfil === "cliente" ? "white" : "",
            }}
            className={`px-4 py-2 rounded ${
              perfil === "cliente" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Clientes de asesoría
          </button>
        </div>

        {/* Bloque de errores global */}
        {error && (
          <div className="max-w-xl mx-auto bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded text-sm text-center mb-4">
            {error}
          </div>
        )}

        {/* ---------- Formulario GESTORÍA ---------- */}
        {perfil === "gestoria" && (
          <div className="max-w-xl mx-auto mt-6 bg-white p-6 rounded shadow border border-gray-300">
            <h2 className="text-2xl font-bold mb-4 text-center">Alta nueva asesoría</h2>

            <form onSubmit={handleSubmitGestoria} className="flex flex-col gap-4">
              <label>
                NIF <span className="text-red-600">*</span>
                <input
                  type="text"
                  name="nif"
                  value={form.nif}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </label>
              <label>
                Nombre <span className="text-red-600">*</span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </label>
              <label>
                Provincia <span className="text-red-600">*</span>
                <select
                  name="province"
                  value={form.province}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                >
                  <option value="">Selecciona una provincia</option>
                  {[
                    "Álava","Albacete","Alicante","Almería","Asturias","Ávila","Badajoz","Barcelona","Burgos",
                    "Cáceres","Cádiz","Cantabria","Castellón","Ciudad Real","Córdoba","Cuenca","Girona","Granada",
                    "Guadalajara","Guipúzcoa","Huelva","Huesca","Illes Balears","Jaén","La Coruña","La Rioja","Las Palmas",
                    "León","Lleida","Lugo","Madrid","Málaga","Murcia","Navarra","Ourense","Palencia","Pontevedra",
                    "Salamanca","Santa Cruz de Tenerife","Segovia","Sevilla","Soria","Tarragona","Teruel","Toledo",
                    "Valencia","Valladolid","Vizcaya","Zamora","Zaragoza","Ceuta","Melilla",
                  ].map((provincia) => (
                    <option key={provincia} value={provincia}>
                      {provincia}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Email <span className="text-red-600">*</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </label>
              <label>
                Imagen
                <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </label>
              <label>
                Página Web
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </label>
              <label>
                Ubicación (Google Maps)
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </label>
              <label>
                Código Recomendación/Promoción
                <input
                  type="text"
                  name="promocode"
                  value={form.promocode}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </label>

              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={(token) => setRecaptchaToken(token || "")}
              />

              <button
                type="submit"
                style={{ backgroundColor: "#002663", color: "white" }}
                className="py-2 rounded hover:opacity-90"
              >
                Enviar
              </button>
            </form>
          </div>
        )}

        {/* ---------- Formulario CLIENTE ---------- */}
        {perfil === "cliente" && (
          <div className="max-w-xl mx-auto mt-6 bg-white p-6 rounded shadow border border-gray-300">
            <h2 className="text-2xl font-bold mb-4 text-center">Contacto para clientes</h2>
            <p className="text-gray-600 text-sm mb-4 text-center">
              Cuéntanos brevemente tu caso. Tu mensaje llegará directamente al equipo de TaxRating.
            </p>

            <form onSubmit={handleSubmitCliente} className="flex flex-col gap-4">
              <label>
                Nombre / Razón social <span className="text-red-600">*</span>
                <input
                  type="text"
                  name="name"
                  value={contact.name}
                  onChange={handleContactChange}
                  className="border p-2 rounded w-full"
                  placeholder="Ej: Marta López o ABC S.L."
                />
              </label>

              <label>
                Email <span className="text-red-600">*</span>
                <input
                  type="email"
                  name="email"
                  value={contact.email}
                  onChange={handleContactChange}
                  className="border p-2 rounded w-full"
                  placeholder="tucorreo@dominio.com"
                />
              </label>

              <label>
                Teléfono
                <input
                  type="tel"
                  name="phone"
                  value={contact.phone}
                  onChange={handleContactChange}
                  className="border p-2 rounded w-full"
                  placeholder="+34 6XX XXX XXX"
                />
              </label>

              <label>
                Asunto
                <input
                  type="text"
                  name="subject"
                  value={contact.subject}
                  onChange={handleContactChange}
                  className="border p-2 rounded w-full"
                  placeholder="Ej: Solicitud de auditoría fiscal"
                />
              </label>

              <label>
                Describe tu problema o consulta
                <textarea
                  name="message"
                  value={contact.message}
                  onChange={handleContactChange}
                  className="border p-2 rounded w-full min-h-[120px]"
                  placeholder="Explícanos brevemente tu situación. Este texto se enviará como cuerpo del correo."
                />
              </label>

              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={(token) => setRecaptchaToken(token || "")}
              />

              <button
                type="submit"
                style={{ backgroundColor: "#002663", color: "white" }}
                className="py-2 rounded hover:opacity-90"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="p-3"></div>
    </>
  );
};

export default Formulario;
