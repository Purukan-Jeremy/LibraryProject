from sqlalchemy import BigInteger, Boolean, Column, DateTime, Integer, String, ForeignKey, Enum, Date
from sqlalchemy.orm import relationship
from .database import Base
import enum

class LoanStatus(enum.Enum):
    BORROWED = "BORROWED"
    RETURNED = "RETURNED"

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
    loans = relationship("Loan", back_populates="user")

class Publisher(Base):
    __tablename__ = "tbl_publishers"
    id = Column(Integer, primary_key=True, index=True)
    publisher_name = Column(String(150), unique=True, nullable=False)
    books = relationship("Book", back_populates="publisher")

class Book(Base):
    __tablename__ = "tbl_books"
    id = Column(Integer, primary_key=True, index=True)
    isbn = Column(String(20), unique=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    stock = Column(Integer, default=0)
    file_pdf = Column(String(255))
    cover_image = Column(String(255))

    category_name = Column(String(100), ForeignKey("tbl_categories.category_name"))
    publisher_name = Column(String(150), ForeignKey("tbl_publishers.publisher_name"))
    author_name = Column(String(150), ForeignKey("tbl_authors.author_name"))

    category = relationship("Category", back_populates="books")
    publisher = relationship("Publisher", back_populates="books")
    author = relationship("Author", back_populates="books")
    loan_details = relationship("LoanDetail", back_populates="book")

class Category(Base):
    __tablename__ = "tbl_categories"
    id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String(150), unique=True, nullable=False)
    books = relationship("Book", back_populates="category")

class Author(Base):
    __tablename__ = "tbl_authors"
    id = Column(Integer, primary_key=True, index=True)
    author_name = Column(String(150), unique=True, nullable=False)
    books = relationship("Book", back_populates="author")

class Loan(Base):
    __tablename__ = "tbl_loans"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("tbl_users.id"))
    loan_date = Column(Date, nullable=False)
    status = Column(Enum(LoanStatus), default=LoanStatus.BORROWED)

    user = relationship("User", back_populates="loans")
    details = relationship("LoanDetail", back_populates="loan", cascade="all, delete-orphan")

class LoanDetail(Base):
    __tablename__ = "tbl_loan_details"
    id = Column(Integer, primary_key=True, index=True)
    loan_id = Column(Integer, ForeignKey("tbl_loans.id"))
    book_id = Column(Integer, ForeignKey("tbl_books.id"))
    quantity = Column(Integer, nullable=False)

    loan = relationship("Loan", back_populates="details")
    book = relationship("Book", back_populates="loan_details")

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