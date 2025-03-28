from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from bson import ObjectId
from pymongo import MongoClient
from datetime import datetime, timedelta
import os

app = FastAPI()

# CORS para permitir solicitudes del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conexión MongoDB
MONGODB_URL = os.getenv("MONGODB_URL")
client = MongoClient(MONGODB_URL)
db = client["taxrating"]
collection = db["gestorias"]

# Configuración de seguridad
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Usuario administrador (hardcoded)
fake_admin = {
    "username": "admin",
    "hashed_password": pwd_context.hash("admin123"),
}

# Validación de contraseña
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(username: str, password: str):
    if username != fake_admin["username"] or not verify_password(password, fake_admin["hashed_password"]):
        return False
    return True

# Crear JWT
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Verificar JWT
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username != fake_admin["username"]:
            raise HTTPException(status_code=401, detail="Token inválido")
        return {"username": username}
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

# Modelos
class Rating(BaseModel):
    Valoraciones: float = 0
    Valoración_Global: float = 0
    IRPF: float = 0
    IS: float = 0
    IVA: float = 0
    Consolidación_Fiscal: float = 0
    Asesoría_Internacional: float = 0

class Gestoria(BaseModel):
    name: str
    image: str
    website: str = ""
    location: str = ""
    province: str
    email: str = ""
    ratings: dict = {}

# Rutas
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if not authenticate_user(form_data.username, form_data.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/gestorias")
async def get_all():
    try:
        gestorias = list(collection.find())
        for g in gestorias:
            g["_id"] = str(g["_id"])
        return gestorias
    except Exception as e:
        print(f"❌ Error al obtener gestorías: {e}")
        raise HTTPException(status_code=500, detail="Error al obtener gestorías")

@app.post("/gestorias")
async def add_gestoria(gestoria: Gestoria):
    data = gestoria.dict()
    data["ratingGlobal"] = gestoria.ratings.get("Valoración Global", 0)
    result = collection.insert_one(data)
    return {"id": str(result.inserted_id)}

@app.delete("/gestorias/{id}")
async def delete_gestoria(id: str, current_user: dict = Depends(get_current_user)):
    result = collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 1:
        return {"message": "Gestoría eliminada correctamente"}
    raise HTTPException(status_code=404, detail="Gestoría no encontrada")
@app.get("/")
def read_root():
    return {"message": "TaxRating backend funcionando correctamente"}
try:
    client.server_info()  # Esto lanza error si no puede conectar
    print("✅ Conexión con MongoDB Atlas establecida correctamente")
except Exception as e:
    print(f"❌ Error conectando con MongoDB Atlas: {e}")
