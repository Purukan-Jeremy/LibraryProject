from passlib.context import CryptContext

# Inisialisasi context passlib dengan algoritma argon2
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    """Memverifikasi apakah plain password cocok dengan hashed password."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Menghasilkan hash dari plain password."""
    return pwd_context.hash(password)
