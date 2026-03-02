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
  X,
  FileText,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export default function LibrarianDashboard() {
  // ================= STATE =================
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBookId, setEditBookId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    stock: 0,
    file_pdf: null as File | null,
    currentPdfName: "",
    category_name: "",
    publisher_name: "",
    author_name: "",
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
        author: b.author_name || "Unknown",
        stock: b.stock,
        file_pdf: b.file_pdf,
        category: b.category_name || "Unknown",
        publisher: b.publisher_name || "Unknown",
      }));

      setBooks(formattedBooks);
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil daftar buku dari server");
    }
  };

  useEffect(() => {
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
      alert("❌ Hanya file PDF yang diperbolehkan!");
      e.target.value = "";
      return;
    }

    // Validasi ekstensi
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("❌ Ekstensi file harus .pdf!");
      e.target.value = "";
      return;
    }

    // Validasi ukuran maksimal 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("❌ Ukuran file maksimal 10MB!");
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
      stock: book.stock || 0,
      file_pdf: null,
      currentPdfName: book.file_pdf || "",
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
      fd.append("stock", String(formData.stock));
      fd.append("category_name", formData.category_name);
      fd.append("publisher_name", formData.publisher_name);
      fd.append("author_name", formData.author_name);
      if (formData.file_pdf) {
        fd.append("file_pdf", formData.file_pdf);
      }

      const response = await fetch(url, {
        method: method,
        // ⚠️ JANGAN set Content-Type — browser otomatis set multipart/form-data
        body: fd,
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.detail || "Gagal menyimpan buku");
        return;
      }

      alert(
        isEditing ? "Buku berhasil diperbarui!" : "Buku berhasil disimpan!",
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
        stock: 0,
        file_pdf: null,
        currentPdfName: "",
        category_name: "",
        publisher_name: "",
        author_name: "",
      });
    } catch (error) {
      console.error(error);
      alert("Tidak dapat terhubung ke server");
    }
  };

  // ================= HAPUS BUKU =================
  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus buku ini?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        alert(result.detail || "Gagal menghapus buku");
        return;
      }

      setBooks((prev) => prev.filter((book) => book.id !== id));
      fetchCategories(); // refresh setelah hapus
      alert("Buku berhasil dihapus!");
    } catch (error) {
      console.error(error);
      alert("Tidak dapat terhubung ke server");
    }
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
            <button className="flex items-center gap-2 text-orange-800 bg-orange-50 px-3 py-1.5 rounded-lg transition-all">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button className="flex items-center gap-2 text-stone-500 hover:text-orange-800 transition-all">
              <Home className="w-4 h-4" />
              Home
            </button>
            <button className="flex items-center gap-2 text-stone-500 hover:text-orange-800 transition-all">
              <LibraryBig className="w-4 h-4" />
              Katalog Buku
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none">Admin Pustaka</p>
            <p className="text-[10px] text-stone-400 font-medium">
              Librarian Role
            </p>
          </div>
          <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center border-2 border-orange-800/20 overflow-hidden">
            <User className="w-6 h-6 text-stone-400" />
          </div>
          <Link
            href="/"
            className="p-2 text-stone-400 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900">
              Selamat Datang, Librarian
            </h1>
            <p className="text-stone-500">
              Pantau dan kelola koleksi buku perpustakaan Anda di sini.
            </p>
          </div>

          <button
            onClick={() => {
              setIsEditing(false);
              setFormData({
                isbn: "",
                title: "",
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
            Tambah Buku Baru
          </button>
        </div>

        {/* Tabel Buku */}
        <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between flex-wrap gap-4">
            <h3 className="font-serif font-bold text-xl">
              Daftar Inventaris Buku
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Cari buku..."
                className="pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-800/10 w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-stone-50 text-stone-400 text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-6 py-4">Judul Buku</th>
                  <th className="px-6 py-4">Penulis</th>
                  <th className="px-6 py-4">Stok</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {books.map((book: any) => (
                  <tr
                    key={book.id}
                    className="hover:bg-stone-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-stone-800">
                      {book.title}
                    </td>
                    <td className="px-6 py-4 text-stone-500 text-sm">
                      {book.author}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-orange-50 text-orange-800 px-3 py-1 rounded-full text-xs font-bold">
                        {book.stock} Pcs
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
                ))}
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
              }}
              className="absolute top-5 right-5 text-stone-400 hover:text-red-500"
            >
              <X />
            </button>

            <h2 className="text-2xl font-serif font-bold mb-6">
              {isEditing ? "Edit Buku" : "Tambah Buku Baru"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Input teks biasa — sama persis seperti semula, minus category_name */}
              {[
                { name: "isbn", placeholder: "ISBN" },
                { name: "title", placeholder: "Judul Buku" },
                { name: "stock", placeholder: "Stok", type: "number" },
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
                    (maks. 10MB, hanya .pdf)
                  </span>
                </label>

                {/* Tampilkan link file lama saat mode edit */}
                {isEditing && formData.currentPdfName && (
                  <div className="flex items-center gap-2 mb-2 p-2 bg-orange-50 rounded-lg">
                    <FileText className="w-4 h-4 text-orange-700 flex-shrink-0" />
                    <span className="text-xs text-stone-500">
                      File saat ini:
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
                      (kosongkan jika tidak ingin mengganti)
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
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-stone-900 hover:bg-orange-800 text-white px-6 py-3 rounded-xl font-bold transition-all"
              >
                {isEditing ? "Perbarui Buku" : "Simpan Buku"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
