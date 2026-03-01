from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, database
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Izinkan Frontend mengakses API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ENDPOINT REGISTER ---
@app.post("/api/register")
def register_user(data: schemas.UserCreate, db: Session = Depends(database.get_db)):
    # Cek apakah email/username sudah ada
    existing = db.query(models.User).filter(
        (models.User.email == data.email) | (models.User.username == data.username)
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Username atau Email sudah terdaftar")

    # Simpan ke tbl_users dengan role_id 2 (User)
    new_user = models.User(
        fullname=data.fullname,
        username=data.username,
        email=data.email,
        password=data.password, # Note: Idealnya di-hash
        role_id=2 
    )
    db.add(new_user)
    db.commit()
    return {"message": "Registrasi berhasil"}

# --- ENDPOINT LOGIN ---

@app.post("/api/login")
def login_user(data: schemas.UserLogin, db: Session = Depends(database.get_db)):
    # 1. Cari user berdasarkan email
    user = db.query(models.User).filter(models.User.email == data.email).first()
    
    # 2. Cek apakah user ada dan password cocok
    if not user or user.password != data.password:
        raise HTTPException(status_code=401, detail="Email atau Password salah")
    
    # 3. Ambil nama role (Librarian/User) dari tabel relasi
    role_name = user.role.role_name if user.role else "User"

    return {
        "message": "Login berhasil",
        "user": {
            "fullname": user.fullname,
            "username": user.username,
            "role": role_name
        }
    }