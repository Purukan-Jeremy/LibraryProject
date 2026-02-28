from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Libriofy API")

# Biarkan Frontend Next.js kamu bisa mengakses API ini nanti
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # URL default Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Selamat datang di API Libriofy!", "status": "Active"}