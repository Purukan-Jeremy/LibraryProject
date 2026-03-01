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
} from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Data Dummy untuk koleksi favorit
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      title: "Laskar Pelangi",
      author: "Andrea Hirata",
      category: "Fiksi",
      rating: 4.9,
      stock: 12,
    },
    {
      id: 2,
      title: "Filosofi Teras",
      author: "Henry Manampiring",
      category: "Filsafat",
      rating: 4.8,
      stock: 5,
    },
    {
      id: 3,
      title: "Cosmos",
      author: "Carl Sagan",
      category: "Sains",
      rating: 4.9,
      stock: 2,
    },
  ]);

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter((fav) => fav.id !== id));
  };

  const filteredFavs = favorites.filter((fav) =>
    fav.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#fafaf9] p-8 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Navigasi Balik */}
        <Link
          href="/librarypage"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-orange-800 transition-all mb-10 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm tracking-tight">
            Kembali ke Perpustakaan
          </span>
        </Link>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-red-500 mb-2">
              <Heart className="w-6 h-6 fill-current" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">
                Koleksi Pribadi
              </span>
            </div>
            <h1 className="text-5xl font-serif font-bold text-stone-900">
              Buku Favorit
            </h1>
            <p className="text-stone-500">
              Daftar buku yang telah Anda tandai sebagai favorit.
            </p>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-orange-800 transition-colors" />
            <input
              type="text"
              placeholder="Cari di favorit..."
              className="pl-12 pr-6 py-4 bg-white border border-stone-200 rounded-[1.5rem] text-sm focus:ring-4 focus:ring-orange-800/5 outline-none w-full md:w-80 shadow-sm transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Grid Buku Favorit */}
        {filteredFavs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFavs.map((book) => (
              <div
                key={book.id}
                className="group relative bg-white border border-stone-100 rounded-[2.5rem] p-6 hover:shadow-2xl hover:shadow-orange-900/5 transition-all duration-500"
              >
                <div className="flex gap-6">
                  {/* Poster Buku (Placeholder) */}
                  <div className="w-32 h-44 bg-stone-100 rounded-[1.5rem] flex-shrink-0 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500 shadow-inner">
                    <BookOpen className="w-8 h-8 text-stone-200" />
                    <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur rounded-lg flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 text-orange-500 fill-current" />
                      <span className="text-[10px] font-bold">
                        {book.rating}
                      </span>
                    </div>
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
                        <span>Tersedia</span>
                        <span
                          className={
                            book.stock > 0 ? "text-green-600" : "text-red-600"
                          }
                        >
                          {book.stock} Pcs
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-stone-900 hover:bg-orange-800 text-white py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
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
              Koleksi masih kosong
            </h3>
            <p className="text-stone-400 max-w-xs mx-auto text-sm mt-2">
              Anda belum menandai buku manapun sebagai favorit.
            </p>
            <Link
              href="/librarypage"
              className="inline-block mt-8 px-8 py-3 bg-orange-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-900/10 hover:-translate-y-1 transition-all"
            >
              Cari Buku Sekarang
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
