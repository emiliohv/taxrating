import requests

url = "http://localhost:8000/gestorias"

gestorias = [{
        "name": "Asesoría Contable S.L.",
        "image": "https://media.istockphoto.com/id/1447567421/es/foto/joven-empresaria-feliz-teniendo-una-reuni%C3%B3n-con-sus-colegas-en-la-oficina-y-mirando-a-la-c%C3%A1mara.jpg?s=612x612&w=0&k=20&c=h_vuWKesK85NkJr_zI9L9AhD3yXiuZzqzMQi1e1Nsv0=",
        "website": "",
        "location": "https://maps.google.com/?q=Asesoría+Contable+S.L.",
        "province": "Madrid",
        "ratingGlobal": 0.0,
        "ratings": {}
    },
    {
        "name": "Gestoría Pérez y Asociados",
        "image": "https://media.gettyimages.com/id/1147479610/es/foto/la-toma-de-decisiones-es-mejor-cuando-lo-haces-juntos.jpg?s=612x612&w=gi&k=20&c=nA5y9HmOG8RuFwa1LLukYvnuNo79pByHCriTmDLK2Fo=",
        "website": "https://gestoriamadrid.com",
        "location": "https://maps.google.com/?q=Gestoría+Pérez+y+Asociados",
        "province": "Barcelona",
        "ratingGlobal": 3.16,
        "ratings": {
            "Valoraciones": 10,
            "Valoración Global": 3.16,
            "IRPF": 2.0,
            "IS": 3.0,
            "IVA": 4.3,
            "Consolidación Fiscal": 4.1,
            "Asesoría Internacional": 2.4
        }
    },
    {
        "name": "Consultoría Fiscal ABC",
        "image": "https://gestoriagabaldon.com/wp-content/uploads/2019/02/logo_gac.png",
        "website": "",
        "location": "https://maps.app.goo.gl/vRe8kdBvrpwrBL636",
        "province": "Valencia",
        "ratingGlobal": 4.8,
        "ratings": {
            "Valoraciones": 20,
            "Valoración Global": 4.8,
            "IRPF": 4.9,
            "IVA": 4.7,
            "Consolidación Fiscal": 4.6,
            "Asesoría Internacional": 4.4
        }
    },
    {
        "name": "Justo Gallardo Asesores",
        "image": "https://gestoriagabaldon.com/wp-content/uploads/2019/02/logo_gac.png",
        "website": "https://justogallardoasesores.com/",
        "location": "https://maps.app.goo.gl/JtZpa56X49fiEfH56",
        "province": "Badajoz",
        "ratingGlobal": 4.8,
        "ratings": {
            "Valoraciones": 65,
            "Valoración Global": 4.8,
            "IRPF": 4.9,
            "IVA": 4.7,
            "Consolidación Fiscal": 4.6,
            "Asesoría Internacional": 4.4
        }
    }
]  # Pega aquí la lista que te di arriba

for g in gestorias:
    response = requests.post(url, json=g)
    if response.status_code == 200:
        print(f"✅ Añadida: {g['name']}")
    else:
        print(f"❌ Error al añadir {g['name']}: {response.text}")
