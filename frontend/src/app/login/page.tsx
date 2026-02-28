"use client";

import React, { useState } from 'react';
import { Book, Eye, EyeOff, Mail, Lock, ChevronLeft } from "lucide-react";
import Link from 'next/link';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center px-6">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-stone-500 hover:text-orange-800 transition-colors">
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Kembali</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-orange-800 rounded-2xl mb-4 shadow-lg shadow-orange-900/20">
            <Book className="w-8 h-8 text-stone-50" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Selamat Datang</h1>
          <p className="text-stone-500 mt-2">Masuk untuk mulai membaca buku-buku favoritmu</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-800/20 focus:border-orange-800 outline-none transition-all text-stone-800"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700 ml-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-800/20 focus:border-orange-800 outline-none transition-all text-stone-800"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button className="w-full bg-stone-900 hover:bg-orange-800 text-stone-50 py-4 rounded-2xl font-bold shadow-lg shadow-stone-900/10 transition-all transform active:scale-[0.98]">
              Masuk Sekarang
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-stone-500 text-sm">
              Belum mempunyai akun?{' '}
              <Link href="/register" className="text-orange-800 font-bold hover:underline decoration-2 underline-offset-4">
                Buat Akun
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}