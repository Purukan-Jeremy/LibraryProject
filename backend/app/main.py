from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from .database import get_db, engine
from . import models

# Baris ini otomatis membuat tabel di MySQL berdasarkan models.py
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/test-db")
def test_connection(db: Session = Depends(get_db)):
    try:
        # Mencoba melakukan query sederhana 'SELECT 1'
        db.execute(text("SELECT 1"))
        return {"status": "success", "message": "Koneksi ke MySQL Berhasil!"}
    except Exception as e:
        return {"status": "error", "message": f"Koneksi Gagal: {str(e)}"}