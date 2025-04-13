from fastapi import FastAPI, HTTPException, Body, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from bson import ObjectId
from pymongo import MongoClient
from datetime import datetime, timedelta
import os
import requests

app = FastAPI()

MAKE_WEBHOOK_URL = os.getenv("MAKE_WEBHOOK_URL")

origins = [
    "http://localhost:5173",
    "https://taxrating.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # También puedes usar ["*"] para permitir todos en desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
client = MongoClient(os.getenv("MONGODB_URL"))
db = client["taxrating"]
collection = db["gestorias"]

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

hashed_admin_password = pwd_context.hash(ADMIN_PASSWORD)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(username: str, password: str):
    if username != ADMIN_USERNAME or not verify_password(password, hashed_admin_password):
        return False
    return True

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username != ADMIN_USERNAME:
            raise HTTPException(status_code=401, detail="Token inválido")
        return {"username": username}
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

class Gestoria(BaseModel):
    name: str
    image: str = ""
    website: str = ""
    location: str = ""
    province: str
    email: str
    nif: str
    promocode: str = ""
    ratings: dict = {}
    activa: bool = True 

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if not authenticate_user(form_data.username, form_data.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}



@app.get("/gestorias")
async def get_all():
    gestorias = list(collection.find({"activa": True}, {"nif": 0, "promocode": 0}))
    for g in gestorias:
        g["_id"] = str(g["_id"])
    return gestorias

@app.get("/admin/gestorias")
async def get_all_admin(current_user: dict = Depends(get_current_user)):
    gestorias = list(collection.find({}, {"nif": 0, "promocode": 0}))
    for g in gestorias:
        g["_id"] = str(g["_id"])
    return gestorias

@app.post("/gestorias")
async def add_gestoria(gestoria: Gestoria, recaptcha: str = Body(...)):
     def verify_recaptcha(token: str) -> bool:
        secret_key = os.getenv("RECAPTCHA_SECRET_KEY")
        response = requests.post(
            "https://www.google.com/recaptcha/api/siteverify",
            data={"secret": secret_key, "response": token}
    )
        result = response.json()
        return result.get("success", False)


     if not verify_recaptcha(recaptcha):
        raise HTTPException(status_code=400, detail="Captcha inválido. Por favor, verifica que no eres un robot.")

        data = gestoria.dict()
        data["activa"] = True
        data["ratingGlobal"] = gestoria.ratings.get("Valoración Global", 0)
        nif = data.get("nif")
        ya_registrada = collection.find_one({"nif": nif})

        if ya_registrada:
            if not ya_registrada.get("activa", True):
                raise HTTPException(status_code=400, detail="Asesoría en alta desactivada, póngase en contacto con nuestro personal.")
            else:
                raise HTTPException(status_code=400, detail="Esta Asesoría ya está de alta en la base de datos.")



        result = collection.insert_one(data)
        ADMIN_EMAIL= os.getenv("ADMIN_EMAIL")
        gestor_id = str(result.inserted_id)
        codigo_promo = gestor_id[-6:]
        print(f"ADMIN_EMAIL cargado: {ADMIN_EMAIL}")
        try:
            response = requests.post(MAKE_WEBHOOK_URL,
                json={
                    "tipo": "alta",
                    "nombre": data.get("name", ""),
                    "email": data.get("email", ""),
                    "codigo": codigo_promo,
                    "provincia": data.get("province", ""),
                    "admin_email": ADMIN_EMAIL
                },
                timeout=10
            )
            print(f"Webhook status: {response.status_code}")
            print(response.text)
        except Exception as e:
            print(f"Error notificando a Make: {e}")

        return {"id": gestor_id}

@app.patch("/gestorias/{id}/toggle")
async def toggle_activa(id: str, current_user: dict = Depends(get_current_user)):
    gestor = collection.find_one({"_id": ObjectId(id)})
    if not gestor:
        raise HTTPException(status_code=404, detail="Gestoría no encontrada")

    nueva_estado = not gestor.get("activa", True)
    collection.update_one({"_id": ObjectId(id)}, {"$set": {"activa": nueva_estado}})
    ADMIN_EMAIL= os.getenv("ADMIN_EMAIL")
    # 🔽 Aquí va el bloque para notificar a Make
    try:
        if MAKE_WEBHOOK_URL:
            requests.post(
                MAKE_WEBHOOK_URL,
                json={
                    "tipo": "cambio_estado",
                    "subtipo": "activada" if nueva_estado else "desactivada",
                    "nombre": gestor.get("name", ""),
                    "email": gestor.get("email", ""),
                    "provincia": gestor.get("province", ""),
                    "admin_email": ADMIN_EMAIL
                },
                timeout=10
            )
            print(f"Notificación de cambio de estado enviada a Make ({'activada' if nueva_estado else 'desactivada'})")
    except Exception as e:
        print(f"Error notificando cambio de estado a Make: {e}")

    return {"message": f"Gestoría {'activada' if nueva_estado else 'desactivada'}", "activa": nueva_estado}

 
@app.delete("/gestorias/{id}")
async def delete_gestoria(id: str, current_user: dict = Depends(get_current_user)):
    gestor = collection.find_one({"_id": ObjectId(id)})
    if not gestor:
        raise HTTPException(status_code=404, detail="Gestoría no encontrada")

    result = collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 1:
        # Webhook a Make
        try:
            ADMIN_EMAIL= os.getenv("ADMIN_EMAIL")
            print(f"ADMIN_EMAIL cargado: {ADMIN_EMAIL}")
            response = requests.post(
                MAKE_WEBHOOK_URL,
                json={
                    "tipo": "eliminacion",
                    "nombre": gestor.get("name", ""),
                    "email": gestor.get("email", ""),
                    "provincia": gestor.get("province", ""),
                    "web": gestor.get("website", ""),
                    "nif": gestor.get("nif", ""),
                    "promocode": gestor.get("promocode", ""),
                    "admin_email": ADMIN_EMAIL
                },
                timeout=10
            )
            print(f"Webhook eliminación enviado. Status: {response.status_code}")
        except Exception as e:
            print(f"Error al notificar eliminación a Make: {e}")

        return {"message": "Gestoría eliminada correctamente"}

    raise HTTPException(status_code=500, detail="No se pudo eliminar la gestoría")
