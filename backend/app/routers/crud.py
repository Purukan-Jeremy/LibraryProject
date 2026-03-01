from sqlalchemy.orm import Session
from . import models, schemas


def create_book(db: Session, book: schemas.BookCreate):
    db_book = models.Book(
        isbn=book.isbn,
        title=book.title,
        stock=book.stock,
        file_pdf=book.file_pdf,
        category_id=book.category_id,
        author_name=book.author_name,
        publisher_id=book.publisher_id
    )

    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


def get_books(db: Session):
    books = db.query(models.Book).all()
    result = []

    for b in books:
        result.append({
            "id": b.id,
            "isbn": b.isbn,
            "title": b.title,
            "stock": b.stock,
            "file_pdf": b.file_pdf,
            "category_id": b.category_id,
            "publisher_id": b.publisher_id,
            "author_name": b.author.name
        })
    return result

def delete_book(db: Session, book_id: int):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Buku dengan id {book_id} tidak ditemukan"
        )
    db.delete(db_book)
    db.commit()
    return {"detail": "Buku berhasil dihapus"}