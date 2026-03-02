from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile
from . import models
import shutil, os, uuid

# ================= DIREKTORI UPLOAD PDF =================
UPLOAD_DIR = "uploads/pdf"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ================= HELPER: SIMPAN FILE PDF =================
def save_pdf_file(file: UploadFile) -> str:
    """Validasi ekstensi & content-type, lalu simpan PDF ke disk. Return nama file unik."""

    # Validasi content-type
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hanya file PDF yang diperbolehkan (content-type bukan application/pdf)"
        )

    # Validasi ekstensi
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ekstensi file harus .pdf"
        )

    # Generate nama file unik agar tidak bentrok
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return unique_filename


# ================= CREATE BOOK =================
def create_book(db: Session, book_data: dict, pdf_file: UploadFile = None):
    # 1. Validasi Category
    if book_data.get("category_id"):
        db_category = db.query(models.Category).filter(
            models.Category.id == book_data["category_id"]
        ).first()
        if not db_category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category dengan ID {book_data['category_id']} tidak ditemukan"
            )

    # 2. Validasi Publisher
    if book_data.get("publisher_id"):
        db_publisher = db.query(models.Publisher).filter(
            models.Publisher.id == book_data["publisher_id"]
        ).first()
        if not db_publisher:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Publisher dengan ID {book_data['publisher_id']} tidak ditemukan"
            )

    # 3. Cari atau buat author
    db_author = db.query(models.Author).filter(
        models.Author.author_name == book_data["author_name"]
    ).first()
    if not db_author:
        db_author = models.Author(author_name=book_data["author_name"])
        db.add(db_author)
        db.commit()
        db.refresh(db_author)

    # 4. Simpan file PDF jika ada
    pdf_filename = None
    if pdf_file:
        pdf_filename = save_pdf_file(pdf_file)

    # 5. Simpan buku ke database
    db_book = models.Book(
        isbn=book_data["isbn"],
        title=book_data["title"],
        stock=book_data["stock"],
        file_pdf=pdf_filename,
        category_id=book_data["category_id"],
        author_name=db_author.author_name,
        publisher_id=book_data["publisher_id"]
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


# ================= GET ALL BOOKS =================
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
            "author_name": b.author_name
        })
    return result


# ================= UPDATE BOOK =================
def update_book(db: Session, book_id: int, book_data: dict, pdf_file: UploadFile = None):
    # 1. Cari buku
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Buku dengan ID {book_id} tidak ditemukan"
        )

    # 2. Validasi Category
    if book_data.get("category_id"):
        db_category = db.query(models.Category).filter(
            models.Category.id == book_data["category_id"]
        ).first()
        if not db_category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category dengan ID {book_data['category_id']} tidak ditemukan"
            )

    # 3. Validasi Publisher
    if book_data.get("publisher_id"):
        db_publisher = db.query(models.Publisher).filter(
            models.Publisher.id == book_data["publisher_id"]
        ).first()
        if not db_publisher:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Publisher dengan ID {book_data['publisher_id']} tidak ditemukan"
            )

    # 4. Handle perubahan Author
    old_author_name = db_book.author_name
    new_author_name = book_data.get("author_name")
    if new_author_name:
        db_author = db.query(models.Author).filter(
            models.Author.author_name == new_author_name
        ).first()
        if not db_author:
            db_author = models.Author(author_name=new_author_name)
            db.add(db_author)
            db.commit()
            db.refresh(db_author)
        db_book.author_name = db_author.author_name

    # 5. Handle PDF baru — hapus file lama jika ada
    if pdf_file:
        if db_book.file_pdf:
            old_path = os.path.join(UPLOAD_DIR, db_book.file_pdf)
            if os.path.exists(old_path):
                os.remove(old_path)
        db_book.file_pdf = save_pdf_file(pdf_file)

    # 6. Update field lainnya
    db_book.isbn = book_data["isbn"]
    db_book.title = book_data["title"]
    db_book.stock = book_data["stock"]
    db_book.category_id = book_data["category_id"]
    db_book.publisher_id = book_data["publisher_id"]

    db.commit()
    db.refresh(db_book)

    # 7. Bersihkan author lama jika tidak punya buku lain
    if old_author_name and old_author_name != new_author_name:
        other_books = db.query(models.Book).filter(
            models.Book.author_name == old_author_name
        ).first()
        if not other_books:
            db_old_author = db.query(models.Author).filter(
                models.Author.author_name == old_author_name
            ).first()
            if db_old_author:
                db.delete(db_old_author)
                db.commit()

    return db_book


# ================= DELETE BOOK =================
def delete_book(db: Session, book_id: int):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Buku dengan ID {book_id} tidak ditemukan"
        )

    author_name = db_book.author_name

    # Hapus file PDF dari disk jika ada
    if db_book.file_pdf:
        file_path = os.path.join(UPLOAD_DIR, db_book.file_pdf)
        if os.path.exists(file_path):
            os.remove(file_path)

    db.delete(db_book)
    db.commit()

    # Hapus author jika tidak punya buku lain
    if author_name:
        other_books = db.query(models.Book).filter(
            models.Book.author_name == author_name
        ).first()
        if not other_books:
            db_author = db.query(models.Author).filter(
                models.Author.author_name == author_name
            ).first()
            if db_author:
                db.delete(db_author)
                db.commit()

    return {"detail": "Buku berhasil dihapus"}