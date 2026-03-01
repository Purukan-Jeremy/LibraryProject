"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Book, 
  Search, 
  Heart, 
  Coffee, 
  ChevronRight, 
  User, 
  LogOut,
  LibraryBig,
  Bookmark,
  Bell,
  Filter
} from "lucide-react";

export default function LibraryPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Proteksi Halaman: Hanya user yang sudah login bisa masuk
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return null; // Mencegah flashing content sebelum redirect

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* --- NAVBAR PERPUSTAKAAN --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-orange-800 rounded-lg group-hover:rotate-6 transition-transform">
                <Book className="w-5 h-5 text-stone-50" />
              </div>
              <span className="text-xl font-serif font-bold text-stone-800 tracking-tight">Libriofy</span>
            </Link>

            <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-500">
              <Link href="/librarypage" className="text-orange-800 flex items-center gap-2">
                <LibraryBig className="w-4 h-4" /> Jelajah Katalog
              </Link>
              <Link href="/peminjaman" className="hover:text-orange-800 transition-colors flex items-center gap-2">
                <Bookmark className="w-4 h-4" /> Pinjaman Saya
              </Link>
              <Link href="/favorit" className="hover:text-orange-800 transition-colors flex items-center gap-2">
                <Heart className="w-4 h-4" /> Koleksi Favorit
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 pl-4 border-l border-stone-200">
              <button className="p-2 text-stone-400 hover:text-orange-800 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="flex items-center gap-3 group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-stone-800 leading-none">{user.fullname}</p>
                  <p className="text-[10px] text-stone-400 font-medium uppercase tracking-tighter mt-1">{user.username}</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center border-2 border-orange-800/20 overflow-hidden">
                  <User className="w-6 h-6 text-orange-800" />
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-stone-300 hover:text-red-600 transition-colors"
                  title="Keluar Aplikasi"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Search & Filter Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold text-stone-900">Katalog Perpustakaan</h1>
            <p className="text-stone-500 mt-1">Temukan bacaan yang sesuai dengan suasana hatimu hari ini.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input 
                type="text" 
                placeholder="Cari judul, penulis, atau ISBN..." 
                className="pl-12 pr-6 py-3 bg-white border border-stone-200 rounded-2xl text-sm w-full md:w-80 shadow-sm focus:ring-2 focus:ring-orange-800/10 outline-none transition-all"
              />
            </div>
            <button className="p-3 bg-white border border-stone-200 rounded-2xl text-stone-600 hover:bg-stone-50 transition-colors shadow-sm">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Placeholder untuk Grid Buku */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Kamu bisa melakukan looping data buku di sini nanti */}
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-stone-200 rounded-[2rem] mb-4 overflow-hidden shadow-md group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="flex items-center justify-center h-full text-stone-400 italic text-sm">Sampul Buku</div>
              </div>
              <h3 className="font-bold text-stone-800 group-hover:text-orange-800 transition-colors">Judul Buku {item}</h3>
              <p className="text-xs text-stone-500 font-medium">Penulis Buku</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}