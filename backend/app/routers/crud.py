from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile
from . import models
import shutil, os, uuid

# ================= DIREKTORI UPLOAD PDF =================
UPLOAD_DIR = "uploads/pdf"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ================= DIREKTORI UPLOAD COVER =================
COVER_DIR = "uploads/cover"
os.makedirs(COVER_DIR, exist_ok=True)


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


# ================= HELPER: SIMPAN FILE COVER =================
def save_cover_file(file: UploadFile) -> str:
    """Simpan Cover Image ke disk. Return nama file unik."""
    # Validasi content-type (opsional tapi disarankan)
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hanya file gambar yang diperbolehkan untuk cover"
        )

    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(COVER_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return unique_filename


# ================= CREATE BOOK =================
def create_book(db: Session, book_data: dict, pdf_file: UploadFile = None, cover_file: UploadFile = None):
    # 1. Cari atau buat category
    category_name = book_data.get("category_name")
    if category_name:
        db_category = db.query(models.Category).filter(
            models.Category.category_name == category_name
        ).first()
        if not db_category:
            db_category = models.Category(category_name=category_name)
            db.add(db_category)
            db.commit()
            db.refresh(db_category)

    # 2. Cari atau buat publisher
    publisher_name = book_data.get("publisher_name")
    if publisher_name:
        db_publisher = db.query(models.Publisher).filter(
            models.Publisher.publisher_name == publisher_name
        ).first()
        if not db_publisher:
            db_publisher = models.Publisher(publisher_name=publisher_name)
            db.add(db_publisher)
            db.commit()
            db.refresh(db_publisher)

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

    # 5. Simpan file Cover jika ada
    cover_filename = None
    if cover_file:
        cover_filename = save_cover_file(cover_file)

    # 6. Simpan buku ke database
    db_book = models.Book(
        isbn=book_data["isbn"],
        title=book_data["title"],
        description=book_data.get("description"),
        stock=book_data["stock"],
        file_pdf=pdf_filename,
        cover_image=cover_filename, # Added cover_image
        category_name=db_category.category_name if category_name else None,
        author_name=db_author.author_name,
        publisher_name=db_publisher.publisher_name if publisher_name else None
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
            "description": b.description,
            "stock": b.stock,
            "file_pdf": b.file_pdf,
            "cover_image": b.cover_image, # Added cover_image
            "category_name": b.category_name,
            "publisher_name": b.publisher_name,
            "author_name": b.author_name
        })
    return result


# ================= UPDATE BOOK =================
def update_book(db: Session, book_id: int, book_data: dict, pdf_file: UploadFile = None, cover_file: UploadFile = None):
    # 1. Cari buku
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Buku dengan ID {book_id} tidak ditemukan"
        )

    # 2. Handle perubahan Category
    old_category_name = db_book.category_name
    new_category_name = book_data.get("category_name")
    if new_category_name:
        db_category = db.query(models.Category).filter(
            models.Category.category_name == new_category_name
        ).first()
        if not db_category:
            db_category = models.Category(category_name=new_category_name)
            db.add(db_category)
            db.commit()
            db.refresh(db_category)
        db_book.category_name = db_category.category_name

    # 3. Handle perubahan Publisher
    old_publisher_name = db_book.publisher_name
    new_publisher_name = book_data.get("publisher_name")
    if new_publisher_name:
        db_publisher = db.query(models.Publisher).filter(
            models.Publisher.publisher_name == new_publisher_name
        ).first()
        if not db_publisher:
            db_publisher = models.Publisher(publisher_name=new_publisher_name)
            db.add(db_publisher)
            db.commit()
            db.refresh(db_publisher)
        db_book.publisher_name = db_publisher.publisher_name

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

    # 6. Handle Cover baru — hapus file lama jika ada
    if cover_file:
        if db_book.cover_image:
            old_cover_path = os.path.join(COVER_DIR, db_book.cover_image)
            if os.path.exists(old_cover_path):
                os.remove(old_cover_path)
        db_book.cover_image = save_cover_file(cover_file)

    # 7. Update field lainnya
    db_book.isbn = book_data["isbn"]
    db_book.title = book_data["title"]
    db_book.description = book_data.get("description")
    db_book.stock = book_data["stock"]

    db.commit()
    db.refresh(db_book)

    # 8. Bersihkan data lama jika tidak punya buku lain (Opsional, tapi konsisten)
    # Bersihkan author lama
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

    # Bersihkan publisher lama
    if old_publisher_name and old_publisher_name != new_publisher_name:
        other_books = db.query(models.Book).filter(
            models.Book.publisher_name == old_publisher_name
        ).first()
        if not other_books:
            db_old_publisher = db.query(models.Publisher).filter(
                models.Publisher.publisher_name == old_publisher_name
            ).first()
            if db_old_publisher:
                db.delete(db_old_publisher)
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
    category_name = db_book.category_name
    publisher_name = db_book.publisher_name

    # Hapus file PDF dari disk jika ada
    if db_book.file_pdf:
        file_path = os.path.join(UPLOAD_DIR, db_book.file_pdf)
        if os.path.exists(file_path):
            os.remove(file_path)

    # Hapus file Cover dari disk jika ada
    if db_book.cover_image:
        cover_path = os.path.join(COVER_DIR, db_book.cover_image)
        if os.path.exists(cover_path):
            os.remove(cover_path)

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

    # Hapus publisher jika tidak punya buku lain
    if publisher_name:
        other_books = db.query(models.Book).filter(
            models.Book.publisher_name == publisher_name
        ).first()
        if not other_books:
            db_old_publisher = db.query(models.Publisher).filter(
                models.Publisher.publisher_name == publisher_name
            ).first()
            if db_old_publisher:
                db.delete(db_old_publisher)
                db.commit()

    return {"detail": "Buku berhasil dihapus"}

# ================= GET ALL CATEGORIES =================
def get_categories(db: Session):
    categories = db.query(models.Category).order_by(models.Category.category_name).all()
    return [{"id": c.id, "category_name": c.category_name} for c in categories]