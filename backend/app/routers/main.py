from fastapi import FastAPI, Depends, HTTPException, Form, File, UploadFile, Request
from sqlalchemy.orm import Session
from . import models, schemas, database, crud, auth_utils
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from typing import Optional
from passlib.exc import UnknownHashError
import os
import random
import smtplib
import hashlib
from datetime import datetime, timedelta
from email.message import EmailMessage

app = FastAPI()


def _now_utc():
    return datetime.utcnow()


def _hash_otp(email: str, otp_code: str) -> str:
    otp_secret = os.getenv("RESET_OTP_SECRET", os.getenv("SESSION_SECRET_KEY", "dev-reset-secret"))
    raw_value = f"{email.lower()}:{otp_code}:{otp_secret}"
    return hashlib.sha256(raw_value.encode("utf-8")).hexdigest()


def _send_reset_otp_email(recipient_email: str, otp_code: str):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM_EMAIL", smtp_user or "no-reply@example.com")
    smtp_use_tls = os.getenv("SMTP_USE_TLS", "true").lower() == "true"

    if not smtp_host:
        raise RuntimeError("SMTP_HOST is not configured")

    message = EmailMessage()
    message["Subject"] = "Password Reset Verification Code"
    message["From"] = smtp_from
    message["To"] = recipient_email
    message.set_content(
        f"Your password reset OTP code is {otp_code}. "
        "This code is valid for 10 minutes."
    )

    with smtplib.SMTP(smtp_host, smtp_port) as smtp:
        if smtp_use_tls:
            smtp.starttls()
        if smtp_user and smtp_password:
            smtp.login(smtp_user, smtp_password)
        smtp.send_message(message)


def _get_latest_active_reset_request(db: Session, email: str):
    return (
        db.query(models.PasswordResetRequest)
        .filter(
            models.PasswordResetRequest.email == email,
            models.PasswordResetRequest.is_used.is_(False),
        )
        .order_by(models.PasswordResetRequest.created_at.desc())
        .first()
    )

# Session backend (doesn't change existing frontend flow)
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET_KEY", "dev-session-secret-change-this"),
    same_site="lax",
    https_only=False,
)

# Allow Frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== STATIC FILES — so PDFs can be accessed via URL =====
os.makedirs("uploads/pdf", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# --- REGISTER ENDPOINT ---
@app.post("/api/register")
def register_user(data: schemas.UserCreate, db: Session = Depends(database.get_db)):
    # Check if email/username already exists
    existing = db.query(models.User).filter(
        (models.User.email == data.email) | (models.User.username == data.username)
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Username or Email already registered")

    # Hash password before saving
    hashed_password = auth_utils.get_password_hash(data.password)

    # Save to tbl_users with role_id 2 (User)
    new_user = models.User(
        fullname=data.fullname,
        username=data.username,
        email=data.email,
        password=hashed_password,
        role_id=2 
    )
    db.add(new_user)
    db.commit()
    return {"message": "Registration successful"}

# --- LIBRARIAN REGISTER ENDPOINT ---
@app.post("/api/librarian/register")
def register_librarian(data: schemas.LibrarianCreate, db: Session = Depends(database.get_db)):
    # 1. Check access code
    SECRET_GATE_CODE = "LIBRIOFY2026"
    if data.access_code != SECRET_GATE_CODE:
        raise HTTPException(status_code=403, detail="Invalid master access code")

    # 2. Check if email/username already exists
    existing = db.query(models.User).filter(
        (models.User.email == data.email) | (models.User.username == data.username)
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Username or Email already registered")

    # 3. Hash password
    hashed_password = auth_utils.get_password_hash(data.password)

    # 4. Save to tbl_users with role_id 1 (Librarian)
    new_librarian = models.User(
        fullname=data.fullname,
        username=data.username,
        email=data.email,
        password=hashed_password,
        role_id=1 
    )
    db.add(new_librarian)
    db.commit()
    return {"message": "Librarian account successfully created"}

# --- LOGIN ENDPOINT ---
@app.post("/api/login")
def login_user(data: schemas.UserLogin, request: Request, db: Session = Depends(database.get_db)):
    login_value = data.email.strip()

    # 1. Find user by email (fallback to username)
    user = db.query(models.User).filter(models.User.email == login_value).first()
    if not user:
        user = db.query(models.User).filter(models.User.username == login_value).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid Email or Password")

    # 2. Verify password
    is_valid_password = False
    try:
        is_valid_password = auth_utils.verify_password(data.password, user.password)
    except (UnknownHashError, ValueError):
        if data.password == user.password:
            is_valid_password = True
            user.password = auth_utils.get_password_hash(data.password)
            db.commit()

    if not is_valid_password:
        raise HTTPException(status_code=401, detail="Invalid Email or Password")
    
    # 3. Check role
    role_name = user.role.role_name if user.role else "User"

    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "fullname": user.fullname,
            "username": user.username,
            "role": role_name
        }
    }

# --- LIBRARIAN LOGIN ENDPOINT ---
@app.post("/api/librarian/login")
def login_librarian(data: schemas.LibrarianLogin, db: Session = Depends(database.get_db)):
    # 1. Check access code
    SECRET_GATE_CODE = "LIBRIOFY2026"
    if data.access_code != SECRET_GATE_CODE:
        raise HTTPException(status_code=403, detail="Invalid master access code")

    # 2. Find user (must exist and have role Librarian / role_id 1)
    login_value = data.email.strip()
    user = db.query(models.User).filter(
        (models.User.email == login_value) | (models.User.username == login_value)
    ).first()

    if not user:
        raise HTTPException(status_code=401, detail="Librarian account not found")

    # 3. Verify Password
    try:
        is_valid = auth_utils.verify_password(data.password, user.password)
    except:
        is_valid = (data.password == user.password)

    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid password")

    # 4. Verify Role (Ensure Librarian)
    if user.role_id != 1:
        raise HTTPException(status_code=403, detail="Account is not registered as a Librarian")

    return {
        "message": "Librarian login successful",
        "user": {
            "id": user.id,
            "fullname": user.fullname,
            "username": user.username,
            "role": "Librarian"
        }
    }

@app.post("/api/change-password")
def change_password(data: schemas.ChangePasswordRequest, db: Session = Depends(database.get_db)):
    login_id = data.login_id.strip()
    new_password = data.new_password.strip()
    confirm_password = data.confirm_password.strip()

    if not login_id:
        raise HTTPException(status_code=400, detail="Invalid user")

    if not new_password:
        raise HTTPException(status_code=400, detail="New password is required")

    if new_password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords must match")

    user = db.query(models.User).filter(
        (models.User.email == login_id) | (models.User.username == login_id)
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = auth_utils.get_password_hash(new_password)
    db.commit()

    return {"message": "Password successfully changed"}


@app.post("/api/forgot-password/send-otp")
def send_forgot_password_otp(
    data: schemas.ForgotPasswordSendOTPRequest,
    db: Session = Depends(database.get_db)
):
    email = data.email.strip().lower()
    user = db.query(models.User).filter(models.User.email == email).first()
    generic_message = "If the email is registered, a verification code has been sent"
    if not user:
        return {"message": generic_message}

    max_requests = int(os.getenv("RESET_OTP_MAX_REQUESTS", "3"))
    request_window_minutes = int(os.getenv("RESET_OTP_REQUEST_WINDOW_MINUTES", "15"))
    window_start = _now_utc() - timedelta(minutes=request_window_minutes)
    recent_requests_count = (
        db.query(models.PasswordResetRequest)
        .filter(
            models.PasswordResetRequest.email == email,
            models.PasswordResetRequest.created_at >= window_start,
        )
        .count()
    )
    if recent_requests_count >= max_requests:
        raise HTTPException(
            status_code=429,
            detail="Too many OTP requests. Please try again in a few minutes.",
        )

    now = _now_utc()
    db.query(models.PasswordResetRequest).filter(
        models.PasswordResetRequest.email == email,
        models.PasswordResetRequest.is_used.is_(False),
    ).update(
        {
            models.PasswordResetRequest.is_used: True,
            models.PasswordResetRequest.used_at: now,
        },
        synchronize_session=False,
    )

    otp_code = f"{random.randint(0, 999999):06d}"
    expiry_minutes = int(os.getenv("RESET_OTP_EXPIRY_MINUTES", "10"))
    reset_request = models.PasswordResetRequest(
        user_id=user.id,
        email=email,
        otp_hash=_hash_otp(email, otp_code),
        expires_at=now + timedelta(minutes=expiry_minutes),
        attempt_count=0,
        is_verified=False,
        is_used=False,
        created_at=now,
    )
    db.add(reset_request)

    try:
        _send_reset_otp_email(email, otp_code)
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send OTP. Email configuration is not valid. ({str(exc)})",
        )

    db.commit()
    return {"message": generic_message}


@app.post("/api/forgot-password/verify-otp")
def verify_forgot_password_otp(
    data: schemas.ForgotPasswordVerifyOTPRequest,
    db: Session = Depends(database.get_db)
):
    email = data.email.strip().lower()
    otp = data.otp.strip()
    entry = _get_latest_active_reset_request(db, email)
    if not entry:
        raise HTTPException(status_code=400, detail="OTP not requested or has expired")

    now = _now_utc()
    if now > entry.expires_at:
        entry.is_used = True
        entry.used_at = now
        db.commit()
        raise HTTPException(status_code=400, detail="OTP has expired")

    max_attempts = int(os.getenv("RESET_OTP_MAX_VERIFY_ATTEMPTS", "5"))
    if entry.attempt_count >= max_attempts:
        entry.is_used = True
        entry.used_at = now
        db.commit()
        raise HTTPException(status_code=400, detail="OTP verify attempts limit exceeded")

    if _hash_otp(email, otp) != entry.otp_hash:
        entry.attempt_count += 1
        if entry.attempt_count >= max_attempts:
            entry.is_used = True
            entry.used_at = now
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid OTP code")

    entry.is_verified = True
    entry.verified_at = now
    db.commit()
    return {"message": "OTP valid"}


@app.post("/api/forgot-password/reset")
def reset_password_with_otp(
    data: schemas.ForgotPasswordResetRequest,
    db: Session = Depends(database.get_db)
):
    email = data.email.strip().lower()
    new_password = data.new_password.strip()
    confirm_password = data.confirm_password.strip()

    if not new_password:
        raise HTTPException(status_code=400, detail="New password is required")
    if new_password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords must match")

    entry = _get_latest_active_reset_request(db, email)
    if not entry:
        raise HTTPException(status_code=400, detail="Password reset session not found")
    now = _now_utc()
    if now > entry.expires_at:
        entry.is_used = True
        entry.used_at = now
        db.commit()
        raise HTTPException(status_code=400, detail="Password reset session has expired")
    if not entry.is_verified:
        raise HTTPException(status_code=400, detail="OTP not verified")

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = auth_utils.get_password_hash(new_password)
    db.query(models.PasswordResetRequest).filter(
        models.PasswordResetRequest.email == email,
        models.PasswordResetRequest.is_used.is_(False),
    ).update(
        {
            models.PasswordResetRequest.is_used: True,
            models.PasswordResetRequest.used_at: now,
        },
        synchronize_session=False,
    )
    db.commit()

    return {"message": "Password successfully reset"}

# ==============================
# --- ADD BOOK ENDPOINT ---
# ==============================
@app.post("/api/books")
def create_book(
    isbn: str = Form(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    stock: int = Form(...),
    category_name: str = Form(...),
    publisher_name: str = Form(...),
    author_name: str = Form(...),
    file_pdf: Optional[UploadFile] = File(None),
    cover_image: Optional[UploadFile] = File(None), # Added cover_image
    db: Session = Depends(database.get_db)
):
    book_data = {
        "isbn": isbn,
        "title": title,
        "description": description,
        "stock": stock,
        "category_name": category_name,
        "publisher_name": publisher_name,
        "author_name": author_name,
    }
    return crud.create_book(db=db, book_data=book_data, pdf_file=file_pdf, cover_file=cover_image)


# ==============================
# --- READ ALL BOOKS ENDPOINT ---
# ==============================
@app.get("/api/books")
def read_books(db: Session = Depends(database.get_db)):
    return crud.get_books(db)

# ==============================
# --- UPDATE BOOK ENDPOINT ---
# ==============================
@app.put("/api/books/{book_id}")
def update_book(
    book_id: int,
    isbn: str = Form(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    stock: int = Form(...),
    category_name: str = Form(...),
    publisher_name: str = Form(...),
    author_name: str = Form(...),
    file_pdf: Optional[UploadFile] = File(None),
    cover_image: Optional[UploadFile] = File(None), # Added cover_image
    db: Session = Depends(database.get_db)
):
    book_data = {
        "isbn": isbn,
        "title": title,
        "description": description,
        "stock": stock,
        "category_name": category_name,
        "publisher_name": publisher_name,
        "author_name": author_name,
    }
    return crud.update_book(db=db, book_id=book_id, book_data=book_data, pdf_file=file_pdf, cover_file=cover_image)

# ==============================
# --- DELETE BOOK ENDPOINT ---
# ==============================
@app.delete("/api/books/{book_id}")
def delete_book(book_id: int, db: Session = Depends(database.get_db)):
    return crud.delete_book(db=db, book_id=book_id)

@app.get("/api/categories")
def get_categories(db: Session = Depends(database.get_db)):
    return crud.get_categories(db)


# ==============================
# --- LOANS ENDPOINTS ---
# ==============================

@app.post("/api/loans")
def create_loan(loan_data: schemas.LoanCreate, db: Session = Depends(database.get_db)):
    return crud.create_loan(db=db, user_id=loan_data.user_id, book_ids=loan_data.book_ids)

@app.get("/api/users/{user_id}/loans")
def get_user_loans(user_id: int, db: Session = Depends(database.get_db)):
    return crud.get_user_loans(db=db, user_id=user_id)

@app.get("/api/admin/loans")
def get_all_loans(db: Session = Depends(database.get_db)):
    return crud.get_all_loans(db=db)

@app.post("/api/loans/{loan_id}/return")
def return_book(loan_id: int, db: Session = Depends(database.get_db)):
    return crud.return_loan(db=db, loan_id=loan_id)

# ==============================
# --- USER PROFILE + LOANS ENDPOINT ---
# ==============================
@app.get("/api/admin/users")
def get_all_users_with_loans(db: Session = Depends(database.get_db)):
    users = db.query(models.User).all()

    result = []

    for user in users:
        loans = []

        for loan in user.loans:
            for detail in loan.details:
                loans.append({
                    "id": loan.id,
                    "title": detail.book.title,
                    "author": detail.book.author_name,
                    "date": str(loan.loan_date),
                    "status": loan.status.value if loan.status else None,
                    "dueDate": str(loan.loan_date)  # placeholder for now
                })

        result.append({
            "id": user.id,
            "fullname": user.fullname,
            "username": user.username,
            "email": user.email,
            "loans": loans
        })

    return result
