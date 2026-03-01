"use client";

import React, { useState } from 'react';
import { ShieldCheck, Lock, ChevronRight, Book } from "lucide-react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LibrarianAuthGate() {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Password tunggal untuk akses Librarian
  const SECRET_GATE_CODE = "LIBRIOFY2026"; 

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === SECRET_GATE_CODE) {
      // Simpan status di sessionStorage agar dashboard tahu user sudah login
      sessionStorage.setItem('isLibrarian', 'true');
      router.push('/dashboard');
    } else {
      setError('Kode akses salah. Hanya pengelola yang diizinkan masuk.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-stone-900 rounded-2xl mb-4 shadow-xl">
            <ShieldCheck className="w-8 h-8 text-stone-50" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Librarian Access</h1>
          <p className="text-stone-500 mt-2 font-medium">Masukkan kode rahasia untuk mengelola perpustakaan</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700 ml-1">Master Access Code</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input 
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-800/20 outline-none transition-all"
                />
              </div>
              {error && <p className="text-red-500 text-xs font-bold ml-1">{error}</p>}
            </div>
            
            <button className="w-full bg-stone-900 hover:bg-orange-800 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]">
              Buka Dashboard <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-stone-400 hover:text-stone-600 text-sm font-medium flex items-center justify-center gap-2">
             Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}