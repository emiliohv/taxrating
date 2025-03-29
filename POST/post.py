import pandas as pd
import requests
import numpy as np

# Leer el archivo Excel
df = pd.read_excel("plantilla_gestorias.xlsx")

# Reemplazar NaN e infinitos por 0
df.replace([np.nan, np.inf, -np.inf], 0, inplace=True)

# API endpoint
url = "https://taxrating-backend.onrender.com/gestorias"

# Recorrer cada fila y enviarla al backend
for _, row in df.iterrows():
    payload = {
        "name": str(row["Nombre"]),
        "image": str(row["Imagen"]),
        "website": str(row.get("Web", "")),
        "location": str(row.get("Ubicación", "")),
        "province": str(row["Provincia"]),
        "email": "",
        "ratings": {
            "Valoraciones": float(row.get("Valoraciones", 0)),
            "Valoración Global": float(row.get("Valoración Global", 0)),
            "IRPF": float(row.get("IRPF", 0)),
            "IS": float(row.get("IS", 0)),
            "IVA": float(row.get("IVA", 0)),
            "Consolidación Fiscal": float(row.get("Consolidación Fiscal", 0)),
            "Asesoría Internacional": float(row.get("Asesoría Internacional", 0))
        }
    }

    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print(f"✅ Gestoría enviada: {payload['name']}")
        else:
            print(f"❌ Error enviando {payload['name']}: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error en gestoría {payload['name']}: {e}")
