from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    fullname: str
    username: str
    email: EmailStr
    password: str
    role_id: int  # 1 untuk Librarian, 2 untuk User (sesuaikan dengan isi tbl_roles)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    fullname: str
    role_id: int

    class Config:
        from_attributes = True