from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from . import models, schemas


def create_book(db: Session, book: schemas.BookCreate):
    # 1. Validasi Category
    if book.category_id:
        db_category = db.query(models.Category).filter(models.Category.id == book.category_id).first()
        if not db_category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category dengan ID {book.category_id} tidak ditemukan"
            )

    # 2. Validasi Publisher
    if book.publisher_id:
        db_publisher = db.query(models.Publisher).filter(models.Publisher.id == book.publisher_id).first()
        if not db_publisher:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Publisher dengan ID {book.publisher_id} tidak ditemukan"
            )

    # 3. Cari atau buat author berdasarkan nama agar author_name ada di tbl_authors
    db_author = db.query(models.Author).filter(models.Author.author_name == book.author_name).first()
    if not db_author:
        db_author = models.Author(author_name=book.author_name)
        db.add(db_author)
        db.commit()
        db.refresh(db_author)

    db_book = models.Book(
        isbn=book.isbn,
        title=book.title,
        stock=book.stock,
        file_pdf=book.file_pdf,
        category_id=book.category_id,
        author_name=db_author.author_name, # Gunakan nama sebagai FK
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
            "author_name": b.author_name # Langsung ambil dari kolom yang sekarang jadi FK
        })
    return result

def delete_book(db: Session, book_id: int):
    # 1. Cari buku yang akan dihapus
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Buku dengan id {book_id} tidak ditemukan"
        )
    
    # Simpan nama author sebelum bukunya dihapus
    author_name = db_book.author_name

    # 2. Hapus buku
    db.delete(db_book)
    db.commit()

    # 3. Cek apakah Author tersebut masih punya buku lain
    if author_name:
        other_books = db.query(models.Book).filter(models.Book.author_name == author_name).first()
        
        # Jika tidak ada buku lain, hapus author-nya dari tbl_authors
        if not other_books:
            db_author = db.query(models.Author).filter(models.Author.author_name == author_name).first()
            if db_author:
                db.delete(db_author)
                db.commit()

    return {"detail": "Buku dan data terkait (jika tidak ada buku lain) berhasil dihapus"}