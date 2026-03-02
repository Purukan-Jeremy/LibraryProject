"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Book,
  Search,
  User,
  LogOut,
  Bookmark,
  Shield,
  LayoutDashboard,
  Home,
  Filter,
  X,
  Mail,
  Edit,
  Heart,
  CheckCircle2,
  BookOpen,
  Barcode,
  Calendar,
  Building2,
} from "lucide-react";

export default function AdminLibraryPage() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [adminData, setAdminData] = useState({
    fullname: "Pustakawan Ahli",
    email: "admin@library.com",
    role: "Librarian",
    username: "admin_utama",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // --- STATE BUKU ---
  const [allBooks, setAllBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  // Fetch books from backend
  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books");
      const data = await response.json();

      const formattedBooks = data.map((b: any) => ({
        id: b.id,
        title: b.title,
        author: b.author_name || "Unknown",
        category: b.category_name || "Uncategorized",
        year: b.year || "N/A",
        publisher: b.publisher_name || "Unknown",
        isbn: b.isbn,
        stock: b.stock,
        synopsis: b.description || "No description available.",
      }));

      setAllBooks(formattedBooks);
    } catch (error) {
      console.error("Gagal mengambil buku:", error);
    }
  };

  React.useEffect(() => {
    fetchBooks();
  }, []);
  // Opsi filter untuk kategori dan tahun (nanti disesuaikan)
  const categories = ["Semua Kategori", "Fiksi", "Sains", "Edukasi"];
  const yearOptions = [
    "Semua Tahun",
    "2020 keatas",
    "2010 - 2019",
    "Dibawah 2010",
  ];
  // Di dalam komponen LibraryPage: (daftar buku dan state filter)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [selectedYear, setSelectedYear] = useState("Semua Tahun");

  const filteredBooks = allBooks.filter((book) => {
    const matchCategory =
      selectedCategory === "Semua Kategori" ||
      book.category === selectedCategory;

    let matchYear = true;
    if (selectedYear === "2020 keatas") matchYear = book.year >= 2020;
    else if (selectedYear === "2010 - 2019")
      matchYear = book.year >= 2010 && book.year <= 2019;
    else if (selectedYear === "Dibawah 2010") matchYear = book.year < 2010;

    const matchSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    // Buku harus memenuhi ketiga syarat ini
    return matchCategory && matchYear && matchSearch;
  });

  const handleLogout = () => {
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* NAVBAR HORIZONTAL - SESUAI STYLE DASHBOARD */}
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
              className="flex items-center gap-2 text-stone-500 hover:text-orange-800 transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href="/adminlibrarypage"
              className="flex items-center gap-2 text-orange-800 bg-orange-50 px-3 py-1.5 rounded-lg transition-all"
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

      {/* CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold text-stone-900">
              Katalog Buku
            </h1>
            <p className="text-stone-500 mt-1">
              Admin Mode: Pantau koleksi buku perpustakaan
            </p>
          </div>

          {/* Search & Filter Container - SEJAJAR DI SINI */}
          <div className="flex items-center gap-4 relative">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-orange-800 transition-colors" />
              <input
                type="text"
                placeholder="Cari judul atau penulis..."
                value={searchQuery} // HUBUNGKAN KE STATE
                onChange={(e) => setSearchQuery(e.target.value)} // UPDATE STATE SAAT MENGETIK
                className="pl-12 pr-6 py-3 bg-white border border-stone-200 rounded-2xl w-full md:w-80 outline-none focus:ring-4 focus:ring-orange-800/5 focus:border-orange-800/20 transition-all shadow-sm"
              />
            </div>

            {/* Tombol Filter di sebelah Search Bar */}
            <div className="flex gap-4 items-center relative">
              {/* Tombol Pemicu Filter */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`p-3 border rounded-2xl flex items-center gap-2 transition-all ${
                  isFilterOpen
                    ? "bg-orange-800 text-white border-orange-800"
                    : "bg-white text-stone-600 border-stone-200"
                }`}
              >
                <Filter className="w-5 h-5" />
                <span className="text-sm font-bold">Filter</span>
              </button>

              {/* Dropdown Menu */}
              {isFilterOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsFilterOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-stone-100 rounded-[2rem] shadow-2xl z-20 p-6 animate-in fade-in zoom-in-95 duration-200">
                    {/* Filter Kategori */}
                    <div className="mb-4">
                      <label className="text-[10px] font-black uppercase text-stone-400 ml-1 mb-2 block">
                        Kategori
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-800/10"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filter Tahun */}
                    <div className="mb-4">
                      <label className="text-[10px] font-black uppercase text-stone-400 ml-1 mb-2 block">
                        Tahun Terbit
                      </label>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-800/10"
                      >
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCategory("Semua Kategori");
                        setSelectedYear("Semua Tahun");
                      }}
                      className="w-full py-2 text-[10px] font-bold text-orange-800 uppercase hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      Reset Filter
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dropdown Filter Kategori (Hanya muncul jika isFilterOpen true) */}

        {/* GRID BUKU */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div
                key={book.id}
                className="group cursor-pointer"
                onClick={() => setSelectedBook(book)}
              >
                <div className="aspect-[3/4] bg-stone-200 rounded-[2rem] mb-4 overflow-hidden shadow-md group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="flex items-center justify-center h-full text-stone-400 italic text-sm text-center px-4">
                    Sampul {book.title}
                  </div>
                </div>
                <h3 className="font-bold text-stone-800 group-hover:text-orange-800 transition-colors leading-tight">
                  {book.title}
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  {book.author} • {book.year}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-stone-400 italic">
              Buku tidak ditemukan dengan kriteria tersebut.
            </div>
          )}
        </div>
      </main>

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
              <div className="relative -mt-12 mb-6 flex justify-center">
                <div className="w-24 h-24 bg-white rounded-[1.5rem] p-1.5 shadow-xl">
                  <div className="w-full h-full bg-orange-50 rounded-[1.2rem] flex items-center justify-center text-orange-800 font-bold text-2xl">
                    {adminData.fullname.charAt(0)}
                  </div>
                </div>
              </div>

              {!isEditingProfile ? (
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
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
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
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:ring-2 focus:ring-orange-800/10 outline-none transition-all"
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
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:ring-2 focus:ring-orange-800/10 outline-none transition-all"
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
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:ring-2 focus:ring-orange-800/10 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 py-3 bg-stone-50 text-stone-500 rounded-xl font-bold text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 py-3 bg-orange-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-900/20"
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

      {/* --- POPUP DETAIL BUKU (ADMIN VIEW) --- */}
      {selectedBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedBook(null)}
          />

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh]">
            {/* Tombol Close */}
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-6 right-6 z-10 p-2 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-stone-600" />
            </button>

            {/* Kiri: Cover & Visual */}
            <div className="w-full md:w-2/5 bg-stone-100 p-8 md:p-12 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-stone-200/50" />
              <div className="relative w-48 aspect-[3/4] bg-white rounded-2xl shadow-xl flex items-center justify-center text-center p-4 z-0">
                <div className="space-y-2">
                  <Book className="w-12 h-12 text-orange-800 mx-auto opacity-50" />
                  <p className="font-serif font-bold text-stone-800">
                    {selectedBook.title}
                  </p>
                  <p className="text-xs text-stone-400">
                    {selectedBook.author}
                  </p>
                </div>
              </div>
            </div>

            {/* Kanan: Detail Informasi */}
            <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto">
              <div className="mb-6">
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 bg-stone-800 text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Admin View
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {selectedBook.category}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-2 leading-tight">
                  {selectedBook.title}
                </h2>
                <p className="text-lg text-stone-500 font-medium">
                  {selectedBook.author}
                </p>
              </div>

              {/* Grid Info Detail */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <p className="text-[10px] font-black uppercase text-stone-400 mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3 h-3" /> Penerbit
                  </p>
                  <p
                    className="text-sm font-bold text-stone-800 truncate"
                    title={selectedBook.publisher}
                  >
                    {selectedBook.publisher}
                  </p>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <p className="text-[10px] font-black uppercase text-stone-400 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> Tahun Terbit
                  </p>
                  <p className="text-sm font-bold text-stone-800">
                    {selectedBook.year}
                  </p>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <p className="text-[10px] font-black uppercase text-stone-400 mb-1 flex items-center gap-1.5">
                    <Barcode className="w-3 h-3" /> ISBN
                  </p>
                  <p className="text-sm font-bold text-stone-800 font-mono tracking-tight">
                    {selectedBook.isbn}
                  </p>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <p className="text-[10px] font-black uppercase text-stone-400 mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3" /> Stok Buku
                  </p>
                  <p className="text-sm font-bold text-stone-800">
                    {selectedBook.stock} Eksemplar
                  </p>
                </div>
              </div>

              {/* Sinopsis */}
              <div className="mb-8">
                <h3 className="font-bold text-stone-900 mb-2">Sinopsis</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {selectedBook.synopsis}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
