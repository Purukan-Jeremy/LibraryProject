"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  Heart,
  Search,
  Trash2,
  BookOpen,
  Star,
  ExternalLink,
  X,
  Building2,
  Calendar,
  Barcode,
  Book,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // --- STATE MODAL BUKU ---
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Modal Sukses Pinjam

  // Data Dummy untuk koleksi favorit
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      title: "Laskar Pelangi",
      author: "Andrea Hirata",
      category: "Fiction",
      rating: 4.9,
      stock: 12,
      year: 2005,
      publisher: "Bentang Pustaka",
      isbn: "978-602-291-685-7",
      synopsis:
        "Kisah perjuangan sepuluh anak Laskar Pelangi di Belitung yang penuh semangat dalam menuntut ilmu di tengah keterbatasan fasilitas sekolah mereka.",
    },
    {
      id: 2,
      title: "Filosofi Teras",
      author: "Henry Manampiring",
      category: "Philosophy",
      rating: 4.8,
      stock: 5,
      year: 2018,
      publisher: "Penerbit Buku Kompas",
      isbn: "978-602-412-518-9",
      synopsis:
        "Sebuah panduan filosofi Stoisisme untuk mental yang tangguh dan hidup yang lebih tenang, relevan untuk menghadapi kekhawatiran masa kini.",
    },
    {
      id: 3,
      title: "Cosmos",
      author: "Carl Sagan",
      category: "Science",
      rating: 4.9,
      stock: 0,
      year: 1980,
      publisher: "Random House",
      isbn: "978-034-533-135-9",
      synopsis:
        "Perjalanan melintasi ruang dan waktu, mengeksplorasi asal-usul alam semesta, evolusi kehidupan, dan tempat manusia di dalam kosmos yang luas.",
    },
  ]);

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter((fav) => fav.id !== id));
  };

  const filteredFavs = favorites.filter((fav) =>
    fav.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // --- FUNGSI PINJAM BUKU ---
  const handleBorrowBook = () => {
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] p-8 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <Link
          href="/librarypage"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-orange-800 transition-all mb-10 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm tracking-tight">
            Back to Library
          </span>
        </Link>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-red-500 mb-2">
              <Heart className="w-6 h-6 fill-current" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">
                Personal Collection
              </span>
            </div>
            <h1 className="text-5xl font-serif font-bold text-stone-900">
              Favorite Books
            </h1>
            <p className="text-stone-500">
              List of books you have marked as favorites.
            </p>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-orange-800 transition-colors" />
            <input
              type="text"
              placeholder="Search in favorites..."
              className="pl-12 pr-6 py-4 bg-white border border-stone-200 rounded-[1.5rem] text-sm focus:ring-4 focus:ring-orange-800/5 outline-none w-full md:w-80 shadow-sm transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Favorite Books Grid */}
        {filteredFavs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFavs.map((book) => (
              <div
                key={book.id}
                className="group relative bg-white border border-stone-100 rounded-[2.5rem] p-6 hover:shadow-2xl hover:shadow-orange-900/5 transition-all duration-500"
              >
                <div className="flex gap-6">
                  {/* Book Poster (Placeholder) */}
                  <div className="w-32 h-44 bg-stone-100 rounded-[1.5rem] flex-shrink-0 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500 shadow-inner">
                    <BookOpen className="w-8 h-8 text-stone-200" />
                  </div>

                  <div className="flex flex-col justify-between flex-1 py-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-800 mb-2 block">
                        {book.category}
                      </span>
                      <h3 className="text-xl font-bold text-stone-900 leading-tight mb-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-stone-400 font-medium">
                        {book.author}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 uppercase tracking-tighter">
                        <span>Available</span>
                        <span
                          className={
                            book.stock > 0 ? "text-green-600" : "text-red-600"
                          }
                        >
                          {book.stock} Pcs
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            book.stock > 0
                              ? "bg-stone-900 hover:bg-orange-800 text-white shadow-lg active:scale-95"
                              : "bg-stone-200 text-stone-400 cursor-not-allowed"
                          }`}
                          onClick={handleBorrowBook}
                        >
                          Pinjam <ExternalLink size={14} />
                        </button>
                        <button
                          onClick={() => removeFavorite(book.id)}
                          className="p-3 bg-stone-50 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-stone-200">
            <Heart className="w-12 h-12 text-stone-100 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-stone-800">
              Collection is still empty
            </h3>
            <p className="text-stone-400 max-w-xs mx-auto text-sm mt-2">
              You haven't marked any books as favorites yet.
            </p>
            <Link
              href="/librarypage"
              className="inline-block mt-8 px-8 py-3 bg-orange-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-900/10 hover:-translate-y-1 transition-all"
            >
              Search Books Now
            </Link>
          </div>
        )}
      </div>
      {/* --- MODAL SUKSES PINJAM (BARU) --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop Transparan */}
          <div
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          />

          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center relative z-10 animate-in zoom-in duration-300 shadow-2xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">
              Berhasil Dipinjam!
            </h3>
            <p className="text-stone-500 text-sm mb-8 leading-relaxed">
              Buku telah berhasil ditambahkan ke daftar pinjaman Anda. Selamat
              membaca!
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-orange-800 transition-all shadow-lg active:scale-95"
            >
              Oke, Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
