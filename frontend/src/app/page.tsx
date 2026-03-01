"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Book, 
  Search, 
  Heart, 
  Coffee, 
  ChevronRight, 
  User, 
  ShieldCheck,
  LogOut
} from "lucide-react";

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Mengambil data user dari localStorage saat komponen dimuat
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fungsi untuk keluar (Logout)
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-10 py-6 max-w-7xl mx-auto relative z-50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-800 rounded-lg">
            <Book className="w-5 h-5 text-stone-50" />
          </div>
          <span className="text-xl font-serif font-bold text-stone-800">Libriofy</span>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Tampilan kondisional berdasarkan status login user */}
          {user ? (
            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full border border-stone-200 shadow-sm">
              <div className="flex flex-col text-right">
                <span className="text-xs text-stone-400 font-medium">Halo,</span>
                <span className="text-sm font-bold text-stone-800 leading-none">{user.fullname}</span>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-800">
                <User className="w-4 h-4" />
              </div>
              <button 
                onClick={handleLogout}
                className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Dropdown Container hanya muncul jika belum login */
            <div 
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <button className="px-6 py-2 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 transition-all font-medium text-sm flex items-center gap-2">
                Masuk
                <div className={`transition-transform duration-300 ${isHovered ? 'rotate-180' : ''}`}>
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </button>

              {/* Dropdown Menu */}
              {isHovered && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-stone-100 rounded-2xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-200">
                  <Link href="/login?role=user">
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer group">
                      <div className="p-1.5 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                        <User className="w-4 h-4 text-orange-800" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">As a User</span>
                        <span className="text-[10px] text-stone-400 font-medium">Mulai membaca buku</span>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="h-px bg-stone-100 mx-2 my-1" />

                  <Link href="/librarian-auth">
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer group">
                      <div className="p-1.5 bg-stone-100 rounded-lg group-hover:bg-stone-200 transition-colors">
                        <ShieldCheck className="w-4 h-4 text-stone-900" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">As a Librarian</span>
                        <span className="text-[10px] text-stone-400 font-medium">Kelola perpustakaan</span>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-10 pt-16 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold">
              <Coffee className="w-3.5 h-3.5" />
              <span>Teman Membaca Ternyaman</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">
              Temukan Ketenangan di Setiap <span className="italic text-orange-800">Halaman.</span>
            </h1>
            
            <p className="text-lg text-stone-600 leading-relaxed max-w-lg">
              Libriofy hadir untuk membantu Anda membaca buku yang hangat dan tenang.
            </p>

            <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <button className="group relative flex items-center gap-3 bg-stone-900 hover:bg-orange-800 text-stone-50 px-8 py-4 rounded-2xl font-medium transition-all shadow-lg hover:shadow-orange-900/20">
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Cari Buku Impian Anda</span>
                <div className="ml-2 p-1 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] bg-stone-200 rounded-[3rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
               <div className="absolute inset-0 bg-gradient-to-tr from-orange-900/20 to-transparent" />
               <div className="flex items-center justify-center h-full text-stone-400 font-serif italic text-xl">
                 Nuansa Hangat
               </div>
            </div>

            <div className="absolute -bottom-6 -left-10 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 border border-stone-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-800">Libriofy for free</p>
                <p className="text-xs text-stone-500">your favourite online library</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}