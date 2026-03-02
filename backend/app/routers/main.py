from fastapi import FastAPI, Depends, HTTPException, Form, File, UploadFile, Request
from sqlalchemy.orm import Session
from . import models, schemas, database, crud
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from typing import Optional
import os

app = FastAPI()

# Session backend (tidak mengubah alur frontend yang sudah ada)
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET_KEY", "dev-session-secret-change-this"),
    same_site="lax",
    https_only=False,
)

# Izinkan Frontend mengakses API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
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
def login_user(data: schemas.UserLogin, request: Request, db: Session = Depends(database.get_db)):
    # 1. Cari user berdasarkan email
    user = db.query(models.User).filter(models.User.email == data.email).first()
    
    # 2. Cek apakah user ada dan password cocok
    if not user or user.password != data.password:
        raise HTTPException(status_code=401, detail="Email atau Password salah")
    
    # 3. Ambil nama role (Librarian/User) dari tabel relasi
    role_name = user.role.role_name if user.role else "User"

    # Simpan session tanpa mengubah response lama.
    request.session["user"] = {
        "id": user.id,
        "fullname": user.fullname,
        "username": user.username,
        "email": user.email,
        "role": role_name,
    }

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
    category_name: str = Form(...),
    publisher_name: str = Form(...),
    author_name: str = Form(...),
    file_pdf: Optional[UploadFile] = File(None),
    db: Session = Depends(database.get_db)
):
    book_data = {
        "isbn": isbn,
        "title": title,
        "stock": stock,
        "category_name": category_name,
        "publisher_name": publisher_name,
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
    category_name: str = Form(...),
    publisher_name: str = Form(...),
    author_name: str = Form(...),
    file_pdf: Optional[UploadFile] = File(None),
    db: Session = Depends(database.get_db)
):
    book_data = {
        "isbn": isbn,
        "title": title,
        "stock": stock,
        "category_name": category_name,
        "publisher_name": publisher_name,
        "author_name": author_name,
    }
    return crud.update_book(db=db, book_id=book_id, book_data=book_data, pdf_file=file_pdf)

# ==============================
# --- ENDPOINT HAPUS BUKU ---
# ==============================
@app.delete("/api/books/{book_id}")
def delete_book(book_id: int, db: Session = Depends(database.get_db)):
    return crud.delete_book(db=db, book_id=book_id)

@app.get("/api/categories")
def get_categories(db: Session = Depends(database.get_db)):
    return crud.get_categories(db)