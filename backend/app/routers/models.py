from sqlalchemy import BigInteger, Boolean, Column, DateTime, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Role(Base):
    __tablename__ = "tbl_roles"
    id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String(50), nullable=False)
    users = relationship("User", back_populates="role")

class User(Base):
    __tablename__ = "tbl_users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    fullname = Column(String(255), nullable=False)
    role_id = Column(Integer, ForeignKey("tbl_roles.id"))
    
    role = relationship("Role", back_populates="users")

class Publisher(Base):
    __tablename__ = "tbl_publishers"   # SESUAIKAN DENGAN DATABASE

    id = Column(Integer, primary_key=True, index=True)
    publisher_name = Column(String(150), unique=True, nullable=False)

    books = relationship("Book", back_populates="publisher")

class Book(Base):
    __tablename__ = "tbl_books"

    id = Column(Integer, primary_key=True, index=True)
    isbn = Column(String(20), unique=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True) # Added description
    stock = Column(Integer, default=0)
    file_pdf = Column(String(255))
    cover_image = Column(String(255)) # Added cover_image

    category_name = Column(String(100), ForeignKey("tbl_categories.category_name"))
    publisher_name = Column(String(150), ForeignKey("tbl_publishers.publisher_name"))
    author_name = Column(String(150), ForeignKey("tbl_authors.author_name")) # FK ke tbl_authors.author_name

    category = relationship("Category", back_populates="books")
    publisher = relationship("Publisher", back_populates="books")
    author = relationship("Author", back_populates="books")

class Category(Base):
    __tablename__ = "tbl_categories"

    id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String(150), unique=True, nullable=False)

    books = relationship("Book", back_populates="category")

class Author(Base):
    __tablename__ = "tbl_authors"

    id = Column(Integer, primary_key=True, index=True)
    author_name = Column(String(150), unique=True, nullable=False) # Harus unique untuk jadi FK

    books = relationship("Book", back_populates="author")


class PasswordResetRequest(Base):
    __tablename__ = "password_reset_requests"

    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("tbl_users.id"), nullable=False, index=True)
    email = Column(String(255), nullable=False, index=True)
    otp_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime, nullable=False, index=True)
    attempt_count = Column(Integer, nullable=False, default=0)
    is_verified = Column(Boolean, nullable=False, default=False)
    is_used = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False)
    verified_at = Column(DateTime, nullable=True)
    used_at = Column(DateTime, nullable=True)
