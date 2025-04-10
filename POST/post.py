
import pandas as pd
import requests
import numpy as np

# Leer el archivo Excel
df = pd.read_excel("plantilla_gestorias.xlsx")

# Reemplazar NaN e infinitos por 0
df.replace([np.nan, np.inf, -np.inf], 0, inplace=True)

# API endpoint
url = "https://taxrating-backend.onrender.com/gestorias"

# Columnas de servicios valorados
servicios = ["IRPF", "IS", "IVA", "Consolidación Fiscal", "Asesoría Internacional"]

# Recorrer cada fila y enviarla al backend
for _, row in df.iterrows():
    ratings = {}
    for servicio in servicios:
        valor = float(row.get(servicio, 0))
        if valor > 0:
            ratings[servicio] = valor

    ratings["Valoraciones"] = float(row.get("Valoraciones", 0))
    ratings["Valoración Global"] = float(row.get("Valoración Global", 0))

    payload = {
        "name": str(row["Nombre"]),
        "image": str(row["Imagen"]),
        "website": str(row.get("Web", "")),
        "location": str(row.get("Ubicación", "")),
        "province": str(row["Provincia"]),
        "email": str(row.get("Email", "test@example.com")),
        "nif": str(row.get("NIF", "00000000T")),
        "activa": bool(row.get("Activa", True)),
        "ratings": ratings
    }

    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print(f"✅ Gestoría enviada: {payload['name']}")
        else:
            print(f"❌ Error enviando {payload['name']}: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error en gestoría {payload['name']}: {e}")
