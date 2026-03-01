from sqlalchemy import Column, Integer, String, ForeignKey
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
    publisher_name = Column(String(150), nullable=False)

    books = relationship("Book", back_populates="publisher")

class Book(Base):
    __tablename__ = "tbl_books"

    id = Column(Integer, primary_key=True, index=True)
    isbn = Column(String(20), unique=True, nullable=False)
    title = Column(String(255), nullable=False)
    stock = Column(Integer, default=0)
    file_pdf = Column(String(255))

    category_id = Column(Integer, ForeignKey("tbl_categories.id"))
    publisher_id = Column(Integer, ForeignKey("tbl_publishers.id"))
    author_name = Column(String(255), nullable=False)  # langsung pakai nama

    category = relationship("Category", back_populates="books")
    publisher = relationship("Publisher", back_populates="books")

class Category(Base):
    __tablename__ = "tbl_categories"

    id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String(150), nullable=False)

    books = relationship("Book", back_populates="category")

class Author(Base):
    __tablename__ = "tbl_authors"

    id = Column(Integer, primary_key=True, index=True)
    author_name = Column(String(150), nullable=False)

    books = relationship("Book", back_populates="author")