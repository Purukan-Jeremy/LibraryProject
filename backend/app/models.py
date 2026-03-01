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