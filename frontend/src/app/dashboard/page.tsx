"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Book,
  LayoutDashboard,
  Home,
  Plus,
  Search,
  Edit,
  Trash2,
  User,
  LogOut,
  LibraryBig,
  Bookmark,
  X,
  FileText,
  Mail,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LibrarianDashboard() {
  // ================= STATE =================
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBookId, setEditBookId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    description: "",
    stock: 0,
    file_pdf: null as File | null,
    cover_image: null as File | null,
    currentPdfName: "",
    currentCoverName: "",
    category_name: "",
    publisher_name: "",
    author_name: "",
  });

  //Untuk testing tanpa backend
  // const MOCK_BOOKS = [
  //   {
  //     id: 1,
  //     isbn: "978-602-03-3160-7",
  //     title: "Atomic Habits",
  //     stock: 15,
  //     category_name: "Self Improvement",
  //     author: "James Clear",
  //     publisher_name: "Gramedia",
  //   },
  //   {
  //     id: 2,
  //     isbn: "978-014-31-1158-0",
  //     title: "Sapiens",
  //     stock: 8,
  //     category_name: "History",
  //     author: "Yuval Noah Harari",
  //     publisher_name: "HarperCollins",
  //   },
  //   {
  //     id: 3,
  //     isbn: "978-602-06-3317-6",
  //     title: "Filosofi Teras",
  //     stock: 20,
  //     category_name: "Filsafat",
  //     author: "Henry Manampiring",
  //     publisher_name: "Kompas",
  //   },
  // ];

  //Search bar filtering
  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();
    return (
      book.title?.toLowerCase().includes(query) ||
      book.isbn?.toLowerCase().includes(query) ||
      book.author_name?.toLowerCase().includes(query)
    );
  });

  // ================= STATE DROPDOWN CATEGORY =================
  const [categories, setCategories] = useState<
    { id: number; category_name: string }[]
  >([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  // ================= FETCH CATEGORIES =================
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Gagal mengambil categories:", error);
    }
  };

  // ================= FETCH BUKU DARI BACKEND =================
  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books");
      const data = await response.json();

      const formattedBooks = data.map((b: any) => ({
        id: b.id,
        isbn: b.isbn,
        title: b.title,
        description: b.description || "",
        author: b.author_name || "Unknown",
        stock: b.stock,
        file_pdf: b.file_pdf,
        cover_image: b.cover_image,
        category: b.category_name || "Unknown",
        publisher: b.publisher_name || "Unknown",
      }));

      setBooks(formattedBooks);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch book list from server");
    }
  };

  //ambil data dummy
  // const fetchBooks = async () => {
  //   try {
  //     const response = await fetch("http://127.0.0.1:8000/api/books");

  //     // Jika backend tidak aktif (response tidak ok)
  //     if (!response.ok) throw new Error("Backend offline");

  //     const data = await response.json();
  //     setBooks(data);
  //   } catch (error) {
  //     console.warn("Menggunakan data dummy karena:", error.message);

  //     // --- INI KUNCINYA ---
  //     // Jika gagal connect ke backend, isi dengan data dummy
  //     setBooks(MOCK_BOOKS);
  //   }
  // };

  useEffect(() => {
    // Mode Pengembangan: Langsung isi state dengan data dummy
    //setBooks(MOCK_BOOKS);
    fetchBooks();
    fetchCategories();
  }, []);

  // ================= TUTUP DROPDOWN JIKA KLIK DI LUAR =================
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(e.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= HANDLE CHANGE FORM =================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= HANDLE FILE INPUT (khusus PDF) =================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi content-type
    if (file.type !== "application/pdf") {
      alert("❌ Only PDF files are allowed!");
      e.target.value = "";
      return;
    }

    // Validasi ekstensi
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("❌ File extension must be .pdf!");
      e.target.value = "";
      return;
    }

    // Validasi ukuran maksimal 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("❌ Maximum file size is 10MB!");
      e.target.value = "";
      return;
    }

    setFormData({ ...formData, file_pdf: file });
  };

  // ================= HANDLE PILIH CATEGORY DARI DROPDOWN =================
  const handleSelectCategory = (categoryName: string) => {
    setFormData({ ...formData, category_name: categoryName });
    setCategorySearch("");
    setIsCategoryOpen(false);
  };

  // ================= FILTER CATEGORY BERDASARKAN SEARCH =================
  const filteredCategories = categories.filter((c) =>
    c.category_name.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  // ================= HANDLE EDIT BUTTON =================
  const handleEdit = (book: any) => {
    setIsEditing(true);
    setEditBookId(book.id);
    setFormData({
      isbn: book.isbn || "",
      title: book.title || "",
      description: book.description || "",
      stock: book.stock || 0,
      file_pdf: null,
      cover_image: null,
      currentPdfName: book.file_pdf || "",
      currentCoverName: book.cover_image || "",
      category_name: book.category || "",
      publisher_name: book.publisher || "",
      author_name: book.author || "",
    });
    setIsModalOpen(true);
  };

  // ================= TAMBAH / UPDATE BUKU =================
  const handleSubmit = async () => {
    try {
      const url = isEditing
        ? `http://127.0.0.1:8000/api/books/${editBookId}`
        : "http://127.0.0.1:8000/api/books";

      const method = isEditing ? "PUT" : "POST";

      // ← diubah: pakai FormData bukan JSON karena ada file upload
      const fd = new FormData();
      fd.append("isbn", formData.isbn);
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("stock", String(formData.stock));
      fd.append("category_name", formData.category_name);
      fd.append("publisher_name", formData.publisher_name);
      fd.append("author_name", formData.author_name);
      if (formData.file_pdf) {
        fd.append("file_pdf", formData.file_pdf);
      }
      if (formData.cover_image) {
        fd.append("cover_image", formData.cover_image);
      }

      const response = await fetch(url, {
        method: method,
        // ⚠️ JANGAN set Content-Type — browser otomatis set multipart/form-data
        body: fd,
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.detail || "Failed to save book");
        return;
      }

      alert(
        isEditing ? "Book successfully updated!" : "Book successfully saved!",
      );
      setIsModalOpen(false);
      setIsEditing(false);
      setEditBookId(null);

      // Refresh data
      fetchBooks();
      fetchCategories(); // refresh list category setelah tambah/edit buku

      // reset form
      setFormData({
        isbn: "",
        title: "",
        description: "",
        stock: 0,
        file_pdf: null,
        cover_image: null,
        currentPdfName: "",
        currentCoverName: "",
        category_name: "",
        publisher_name: "",
        author_name: "",
      });
    } catch (error) {
      console.error(error);
      alert("Could not connect to server");
    }
  };

  // ================= HAPUS BUKU =================
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        alert(result.detail || "Failed to delete book");
        return;
      }

      setBooks((prev) => prev.filter((book) => book.id !== id));
      alert("Book successfully deleted!");
    } catch (error) {
      console.error(error);
      alert("Could not connect to server");
    }
  };

  // ================= PROFILE DUMMY ================= (untuk modal profile admin, bisa diisi dengan data nyata jika sudah ada backend user)
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false); // Membedakan edit buku vs edit profil
  const [adminData, setAdminData] = useState({
    fullname: "Admin Perpustakaan",
    email: "admin@library.com",
    role: "Librarian",
    username: "admin_utama",
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  // ================= RETURN JSX =================
  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-800 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-stone-200 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-800 rounded-lg">
              <Book className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-serif font-bold">Libriofy</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-orange-800 bg-orange-50 px-3 py-1.5 rounded-lg transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href="/adminlibrarypage"
              className="flex items-center gap-2 text-stone-500 hover:text-orange-800 transition-all"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/adminhistory"
              className="flex items-center gap-2 text-stone-500 hover:text-orange-800 transition-all"
            >
              <Bookmark className="w-4 h-4" />
              History
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 group">
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-3 p-1 hover:bg-stone-50 rounded-2xl transition-all border border-transparent hover:border-stone-100"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-stone-800 leading-none">
                {adminData.username}
              </p>
              <p className="text-[10px] text-stone-400 font-medium uppercase tracking-tighter mt-1">
                {adminData.fullname}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center border-2 border-orange-800/20 overflow-hidden">
              <User className="w-6 h-6 text-orange-800" />
            </div>
          </button>
          <button
            onClick={handleLogout}
            className="p-2 text-stone-300 hover:text-red-600 transition-colors"
            title="Keluar Aplikasi"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900">
              Welcome, Librarian
            </h1>
            <p className="text-stone-500">
              Monitor and manage your library's book collection here.
            </p>
          </div>

          <button
            onClick={() => {
              setIsEditing(false);
              setFormData({
                isbn: "",
                title: "",
                description: "",
                stock: 0,
                file_pdf: null,
                currentPdfName: "",
                category_name: "",
                publisher_name: "",
                author_name: "",
              });
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-stone-900 hover:bg-orange-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add New Book
          </button>
        </div>

        {/* Tabel Buku */}
        <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between flex-wrap gap-4">
            <h3 className="font-serif font-bold text-xl">
              Book Inventory List
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search books..."
                className="pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-800/10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-stone-50 text-stone-400 text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-6 py-4">Book Title</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book, index) => (
                    <tr
                      key={book.id}
                      className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-14 bg-stone-100 rounded-lg overflow-hidden border border-stone-200 flex-shrink-0 flex items-center justify-center text-stone-400">
                            {book.cover_image ? (
                              <img 
                                src={`http://127.0.0.1:8000/uploads/cover/${book.cover_image}`} 
                                alt={book.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Book className="w-5 h-5 opacity-30" />
                            )}
                          </div>
                          <div className="font-bold text-stone-900">
                            {book.title}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-stone-600">
                        {book.author}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-orange-50 text-orange-800 rounded-full text-xs font-bold">
                          {book.stock} unit
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(book)}
                            className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center opacity-30">
                        <Search className="w-12 h-12 mb-2" />
                        <p className="text-sm italic">
                          Buku dengan kata kunci "{searchQuery}" tidak
                          ditemukan.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Tambah/Edit Buku */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-xl p-8 relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setIsEditing(false);
                setEditBookId(null);
                setFormData({
                  isbn: "",
                  title: "",
                  description: "",
                  stock: 0,
                  file_pdf: null,
                  currentPdfName: "",
                  category_name: "",
                  publisher_name: "",
                  author_name: "",
                });
              }}
              className="absolute top-5 right-5 text-stone-400 hover:text-red-500"
            >
              <X />
            </button>

            <h2 className="text-2xl font-serif font-bold mb-6">
              {isEditing ? "Edit Book" : "Add New Book"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Input teks biasa — sama persis seperti semula, minus category_name */}
              {[
                { name: "isbn", placeholder: "ISBN" },
                { name: "title", placeholder: "Book Title" },
                { name: "stock", placeholder: "Stock", type: "number" },
                {
                  name: "author_name",
                  placeholder: "Author Name",
                  type: "text",
                },
                {
                  name: "publisher_name",
                  placeholder: "Publisher Name",
                  type: "text",
                },
              ].map((field) => (
                <input
                  key={field.name}
                  name={field.name}
                  type={field.type || "text"}
                  value={
                    formData[field.name as keyof typeof formData] as string
                  }
                  placeholder={field.placeholder}
                  onChange={handleChange}
                  className="px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-800/10"
                />
              ))}

              <div className="md:col-span-2">
                <textarea
                  name="description"
                  value={formData.description}
                  placeholder="Book Description"
                  onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-800/10 h-32 resize-none"
                />
              </div>

              {/* ===== DROPDOWN + SEARCH CATEGORY ===== */}
              <div className="relative" ref={categoryRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryOpen(!isCategoryOpen);
                    setCategorySearch("");
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-800/10 text-left"
                >
                  <span
                    className={
                      formData.category_name
                        ? "text-stone-800"
                        : "text-stone-400"
                    }
                  >
                    {formData.category_name || "Pilih Category"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Panel */}
                {isCategoryOpen && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden">
                    {/* Search input di dalam dropdown */}
                    <div className="p-2 border-b border-stone-100">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                        <input
                          type="text"
                          placeholder="Cari category..."
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-800/10"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* List hasil filter */}
                    <ul className="max-h-44 overflow-y-auto">
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((c) => (
                          <li
                            key={c.id}
                            onClick={() =>
                              handleSelectCategory(c.category_name)
                            }
                            className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-orange-50 hover:text-orange-800 transition-colors
                              ${formData.category_name === c.category_name ? "bg-orange-50 text-orange-800 font-semibold" : "text-stone-700"}`}
                          >
                            {c.category_name}
                          </li>
                        ))
                      ) : (
                        /* Jika tidak ada hasil, tawarkan buat baru */
                        <li
                          onClick={() => handleSelectCategory(categorySearch)}
                          className="px-4 py-2.5 text-sm cursor-pointer text-orange-700 hover:bg-orange-50 transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Buat category "
                          <span className="font-semibold">
                            {categorySearch}
                          </span>
                          "
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* ← diubah: input file PDF menggantikan input text file_pdf */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-stone-600 mb-2">
                  File PDF{" "}
                  <span className="font-normal text-stone-400">
                    (max. 10MB, only .pdf)
                  </span>
                </label>

                {/* Tampilkan link file lama saat mode edit */}
                {isEditing && formData.currentPdfName && (
                  <div className="flex items-center gap-2 mb-2 p-2 bg-orange-50 rounded-lg">
                    <FileText className="w-4 h-4 text-orange-700 flex-shrink-0" />
                    <span className="text-xs text-stone-500">
                      Current file:
                    </span>
                    <a
                      href={`http://127.0.0.1:8000/uploads/pdf/${formData.currentPdfName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-orange-700 underline truncate"
                    >
                      {formData.currentPdfName}
                    </a>
                    <span className="text-xs text-stone-400 ml-auto whitespace-nowrap">
                      (leave empty if you don't want to change)
                    </span>
                  </div>
                )}

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-800/10 text-sm
                    file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0
                    file:bg-orange-800 file:text-white file:text-sm file:font-semibold file:cursor-pointer cursor-pointer"
                />

                {/* Preview nama & ukuran file yang dipilih */}
                {formData.file_pdf && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <span className="font-semibold">
                      {formData.file_pdf.name}
                    </span>
                    <span className="text-green-500">
                      ({(formData.file_pdf.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                )}
              </div>

              {/* Input Cover Image */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-stone-600 mb-2">
                  Cover Image
                  <span className="font-normal text-stone-400">
                    (max. 5MB, only images)
                  </span>
                </label>

                {/* Tampilkan cover lama saat mode edit */}
                {isEditing && formData.currentCoverName && (
                  <div className="flex items-center gap-4 mb-3 p-3 bg-stone-50 rounded-2xl border border-stone-100">
                    <div className="w-16 h-20 rounded-lg overflow-hidden border border-stone-200 shadow-sm bg-white">
                      <img
                        src={`http://127.0.0.1:8000/uploads/cover/${formData.currentCoverName}`}
                        alt="Current Cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-stone-500 mb-1">Current cover:</p>
                      <p className="text-xs font-bold text-stone-700 truncate max-w-[200px]">{formData.currentCoverName}</p>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                       if (file.size > 5 * 1024 * 1024) {
                         alert("❌ Maximum image size is 5MB!");
                         e.target.value = "";
                         return;
                       }
                       setFormData({ ...formData, cover_image: file });
                    }
                  }}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-800/10 text-sm
                    file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0
                    file:bg-orange-800 file:text-white file:text-sm file:font-semibold file:cursor-pointer cursor-pointer"
                />

                {/* Preview cover yang baru dipilih */}
                {formData.cover_image && (
                  <div className="flex items-center gap-4 mt-3 p-3 bg-green-50 rounded-2xl border border-green-100">
                    <div className="w-16 h-20 rounded-lg overflow-hidden border border-green-200 shadow-sm bg-white">
                      <img
                        src={URL.createObjectURL(formData.cover_image)}
                        alt="New Cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-green-700 font-bold">{formData.cover_image.name}</p>
                      <p className="text-[10px] text-green-600">{(formData.cover_image.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-stone-900 hover:bg-orange-800 text-white px-6 py-3 rounded-xl font-bold transition-all"
              >
                {isEditing ? "Update Book" : "Save Book"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PROFILE ADMIN */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={() => {
              setIsProfileOpen(false);
              setIsEditingProfile(false);
            }}
          />

          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header Modal */}
            <div className="h-28 bg-stone-900 w-full relative">
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsEditingProfile(false);
                }}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-8 pb-10">
              {/* Avatar Section */}
              <div className="relative -mt-12 mb-6 flex justify-center">
                <div className="w-24 h-24 bg-white rounded-[1.5rem] p-1.5 shadow-xl">
                  <div className="w-full h-full bg-orange-50 rounded-[1.2rem] flex items-center justify-center text-orange-800 font-bold text-2xl">
                    {adminData.fullname.charAt(0)}
                  </div>
                </div>
              </div>

              {!isEditingProfile ? (
                /* TAMPILAN VIEW PROFILE */
                <div className="animate-in slide-in-from-bottom-4 duration-300">
                  <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-stone-900">
                      {adminData.fullname}
                    </h2>
                    <p className="text-orange-800 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
                      {adminData.role}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 bg-stone-50 rounded-2xl flex items-center gap-4 border border-stone-100">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-stone-400 shadow-sm">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-stone-400">
                          Username
                        </p>
                        <p className="text-sm font-bold text-stone-700">
                          {adminData.username}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-2xl flex items-center gap-4 border border-stone-100">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-stone-400 shadow-sm">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-stone-400">
                          Email
                        </p>
                        <p className="text-sm font-bold text-stone-700">
                          {adminData.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="flex-1 py-3 bg-stone-100 text-stone-600 rounded-xl font-bold text-sm hover:bg-stone-200 transition-all flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" /> Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* TAMPILAN EDIT PROFILE */
                <div className="animate-in fade-in duration-300">
                  <h3 className="text-lg font-bold text-stone-900 mb-6 text-center">
                    Update Admin Info
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-stone-400 ml-2 mb-1 block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={adminData.fullname}
                        onChange={(e) =>
                          setAdminData({
                            ...adminData,
                            fullname: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-orange-800/10 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-stone-400 ml-2 mb-1 block">
                        User Name
                      </label>
                      <input
                        type="text"
                        value={adminData.username}
                        onChange={(e) =>
                          setAdminData({
                            ...adminData,
                            username: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-orange-800/10 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-stone-400 ml-2 mb-1 block">
                        Email
                      </label>
                      <input
                        type="email"
                        value={adminData.email}
                        onChange={(e) =>
                          setAdminData({ ...adminData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-orange-800/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 py-3 bg-stone-50 text-stone-500 rounded-xl font-bold text-sm hover:bg-stone-100 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 py-3 bg-orange-800 text-white rounded-xl font-bold text-sm hover:bg-orange-900 transition-all shadow-lg shadow-orange-900/20"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
