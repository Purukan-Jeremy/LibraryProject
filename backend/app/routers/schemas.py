from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    fullname: str
    username: str
    email: EmailStr
    password: str
    role_id: int  # 1 untuk Librarian, 2 untuk User (sesuaikan dengan isi tbl_roles)

class UserLogin(BaseModel):
    email: str
    password: str

class ChangePasswordRequest(BaseModel):
    login_id: str
    new_password: str
    confirm_password: str

class ForgotPasswordSendOTPRequest(BaseModel):
    email: EmailStr

class ForgotPasswordVerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str

class ForgotPasswordResetRequest(BaseModel):
    email: EmailStr
    new_password: str
    confirm_password: str

class UserResponse(BaseModel):
    id: int
    username: str
    fullname: str
    role_id: int

    class Config:
        from_attributes = True

class BookBase(BaseModel):
    isbn: str
    title: str
    description: Optional[str] = None
    stock: Optional[int] = 0
    file_pdf: Optional[str] = None
    category_name: Optional[str] = None
    publisher_name: Optional[str] = None
    author_name: Optional[str] = None


class BookCreate(BookBase):
    pass


class Book(BookBase):
    id: int

    class Config:
        from_attributes = True
