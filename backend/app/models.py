from .database import Base
from sqlalchemy import Column, Integer, String, Text

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    author = Column(String(255))
    description = Column(Text)
    cover_image = Column(String(255)) # Menyimpan URL gambar