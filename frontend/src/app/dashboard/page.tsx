"use client";

import React, { useState } from 'react';
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
  LibraryBig
} from "lucide-react";
import Link from 'next/link';

export default function LibrarianDashboard() {
  // Data dummy untuk simulasi tampilan CRUD
  const [books, setBooks] = useState([
    { id: 1, title: "Laskar Pelangi", author: "Andrea Hirata", stock: 12 },
    { id: 2, title: "Bumi", author: "Tere Liye", stock: 5 },
    { id: 3, title: "Filosofi Teras", author: "Henry Manampiring", stock: 8 },
  ]);

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-800 font-sans">
      {/* Navbar Atas */}
      <nav className="sticky top-0 z-50 bg-white border-b border-stone-200 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-800 rounded-lg">
              <Book className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-serif font-bold">Libriofy</span>
          </div>

          {/* Navigasi Menu */}
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

        {/* Profil Librarian */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none">Admin Pustaka</p>
            <p className="text-[10px] text-stone-400 font-medium">Librarian Role</p>
          </div>
          <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center border-2 border-orange-800/20 overflow-hidden">
            <User className="w-6 h-6 text-stone-400" />
          </div>
          <Link href="/" className="p-2 text-stone-400 hover:text-red-600 transition-colors">
            <LogOut className="w-5 h-5" />
          </Link>
        </div>
      </nav>

      {/* Konten Dashboard */}
      <main className="max-w-7xl mx-auto px-8 py-10">
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900">Selamat Datang, Librarian</h1>
            <p className="text-stone-500">Pantau dan kelola koleksi buku perpustakaan Anda di sini.</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-stone-900 hover:bg-orange-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95">
            <Plus className="w-5 h-5" />
            Tambah Buku Baru
          </button>
        </div>

        {/* Statistik Ringkas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Total Buku", value: "0", icon: Book, color: "bg-orange-100 text-orange-800" },
            { label: "Peminjaman Aktif", value: "0", icon: User, color: "bg-blue-100 text-blue-800" },
            { label: "Buku Tersedia", value: "0", icon: LibraryBig, color: "bg-green-100 text-green-800" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabel CRUD */}
        <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between flex-wrap gap-4">
            <h3 className="font-serif font-bold text-xl">Daftar Inventaris Buku</h3>
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
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-stone-800">{book.title}</td>
                    <td className="px-6 py-4 text-stone-500 text-sm">{book.author}</td>
                    <td className="px-6 py-4">
                      <span className="bg-orange-50 text-orange-800 px-3 py-1 rounded-full text-xs font-bold">
                        {book.stock} Pcs
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
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
    </div>
  );
}