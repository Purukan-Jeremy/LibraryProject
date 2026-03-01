"use client";

import React, { useState, useEffect } from "react";
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
    file_pdf: "",
    category_id: "",
    publisher_id: "",
    author_name: "",
  });

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
        category_id: b.category_id,
        publisher_id: b.publisher_id,
      }));

      setBooks(formattedBooks);
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil daftar buku dari server");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // ================= HANDLE CHANGE FORM =================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= HANDLE EDIT BUTTON =================
  const handleEdit = (book: any) => {
    setIsEditing(true);
    setEditBookId(book.id);
    setFormData({
      isbn: book.isbn || "",
      title: book.title || "",
      stock: book.stock || 0,
      file_pdf: book.file_pdf || "",
      category_id: book.category_id || "",
      publisher_id: book.publisher_id || "",
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

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isbn: formData.isbn,
          title: formData.title,
          stock: Number(formData.stock),
          file_pdf: formData.file_pdf,
          category_id: Number(formData.category_id),
          publisher_id: Number(formData.publisher_id),
          author_name: formData.author_name,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.detail || "Gagal menyimpan buku");
        return;
      }

      alert(isEditing ? "Buku berhasil diperbarui!" : "Buku berhasil disimpan!");
      setIsModalOpen(false);
      setIsEditing(false);
      setEditBookId(null);

      // Refresh data
      fetchBooks();

      // reset form
      setFormData({
        isbn: "",
        title: "",
        stock: 0,
        file_pdf: "",
        category_id: "",
        publisher_id: "",
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
                file_pdf: "",
                category_id: "",
                publisher_id: "",
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
              {[
                { name: "isbn", placeholder: "ISBN" },
                { name: "title", placeholder: "Judul Buku" },
                { name: "stock", placeholder: "Stok", type: "number" },
                { name: "file_pdf", placeholder: "File PDF URL" },
                {
                  name: "category_id",
                  placeholder: "Category ID",
                  type: "number",
                },
                { name: "author_name", placeholder: "Author Name", type: "text" },
                {
                  name: "publisher_id",
                  placeholder: "Publisher ID",
                  type: "number",
                },
              ].map((field) => (
                <input
                  key={field.name}
                  name={field.name}
                  type={field.type || "text"}
                  value={formData[field.name as keyof typeof formData]}
                  placeholder={field.placeholder}
                  onChange={handleChange}
                  className="px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-800/10"
                />
              ))}
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
