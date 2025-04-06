from fastapi import FastAPI, HTTPException, Depends
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if not authenticate_user(form_data.username, form_data.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/gestorias")
async def get_all():
    gestorias = list(collection.find({}, {"nif": 0, "promocode": 0}))
    for g in gestorias:
        g["_id"] = str(g["_id"])
    return gestorias
"""
@app.post("/gestorias")
async def add_gestoria(gestoria: Gestoria):
    data = gestoria.dict()
    data["ratingGlobal"] = gestoria.ratings.get("Valoración Global", 0)
    result = collection.insert_one(data)
    return {"id": str(result.inserted_id)}
"""


@app.post("/gestorias")
async def add_gestoria(gestoria: Gestoria):
    data = gestoria.dict()
    data["ratingGlobal"] = gestoria.ratings.get("Valoración Global", 0)
    result = collection.insert_one(data)

    gestor_id = str(result.inserted_id)
    codigo_promo = gestor_id[-6:]

    try:
        response = requests.post(
            "https://hook.eu2.make.com/w68s5yb2z0o7is43nx4irydynkq37bl7",
            json={
                "nombre": data.get("name", ""),
                "email": data.get("email", ""),
                "codigo": codigo_promo,
                "provincia": data.get("province", "")
            },
            timeout=10
        )
        print(f"Webhook status: {response.status_code}")
        print(response.text)
    except Exception as e:
        print(f"Error notificando a Make: {e}")

    return {"id": gestor_id}


@app.delete("/gestorias/{id}")
async def delete_gestoria(id: str, current_user: dict = Depends(get_current_user)):
    result = collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 1:
        return {"message": "Gestoría eliminada correctamente"}
    raise HTTPException(status_code=404, detail="Gestoría no encontrada")
