from fastapi import FastAPI, Depends, HTTPException, Form, File, UploadFile
from sqlalchemy.orm import Session
from . import models, schemas, database, crud
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import Optional
import os

app = FastAPI()

# Izinkan Frontend mengakses API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== STATIC FILES — agar PDF bisa diakses via URL =====
os.makedirs("uploads/pdf", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

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

# ==============================
# --- ENDPOINT TAMBAH BUKU ---
# ==============================
@app.post("/api/books")
def create_book(
    isbn: str = Form(...),
    title: str = Form(...),
    stock: int = Form(...),
    category_id: int = Form(...),
    publisher_id: int = Form(...),
    author_name: str = Form(...),
    file_pdf: Optional[UploadFile] = File(None),
    db: Session = Depends(database.get_db)
):
    book_data = {
        "isbn": isbn,
        "title": title,
        "stock": stock,
        "category_id": category_id,
        "publisher_id": publisher_id,
        "author_name": author_name,
    }
    return crud.create_book(db=db, book_data=book_data, pdf_file=file_pdf)


# ==============================
# --- ENDPOINT AMBIL SEMUA BUKU ---
# ==============================
@app.get("/api/books")
def read_books(db: Session = Depends(database.get_db)):
    return crud.get_books(db)

# ==============================
# --- ENDPOINT UPDATE BUKU ---
# ==============================
@app.put("/api/books/{book_id}")
def update_book(
    book_id: int,
    isbn: str = Form(...),
    title: str = Form(...),
    stock: int = Form(...),
    category_id: int = Form(...),
    publisher_id: int = Form(...),
    author_name: str = Form(...),
    file_pdf: Optional[UploadFile] = File(None),
    db: Session = Depends(database.get_db)
):
    book_data = {
        "isbn": isbn,
        "title": title,
        "stock": stock,
        "category_id": category_id,
        "publisher_id": publisher_id,
        "author_name": author_name,
    }
    return crud.update_book(db=db, book_id=book_id, book_data=book_data, pdf_file=file_pdf)

# ==============================
# --- ENDPOINT HAPUS BUKU ---
# ==============================
@app.delete("/api/books/{book_id}")
def delete_book(book_id: int, db: Session = Depends(database.get_db)):
    return crud.delete_book(db=db, book_id=book_id)