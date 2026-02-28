import React from 'react';
import Link from 'next/link';
import { Book, Search, Heart, Coffee, ChevronRight} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9]">

      <nav className="flex items-center justify-between px-10 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-800 rounded-lg">
            <Book className="w-5 h-5 text-stone-50" />
          </div>
          <span className="text-xl font-serif font-bold text-stone-800">Libriofy</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-stone-600">
        </div>
        <Link href="/login">
          <button className="px-6 py-2 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 transition-all font-medium text-sm">
            Masuk
          </button>
        </Link>
      </nav>


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