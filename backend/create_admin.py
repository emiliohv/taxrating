from pymongo import MongoClient
from passlib.context import CryptContext

client = MongoClient("mongodb://localhost:27017")
db = client["taxrating"]
users = db["users"]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Verifica si ya existe
if users.find_one({"username": "admin"}):
    print("El usuario ya existe.")
else:
    hashed_pw = pwd_context.hash("admin123")
    users.insert_one({"username": "admin", "password": hashed_pw})
    print("Usuario admin creado.")
