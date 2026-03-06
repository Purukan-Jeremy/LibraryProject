"use client";

import React, { useState } from 'react';
import { ShieldCheck, Lock, ChevronRight, Mail, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';

export default function LibrarianAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    access_code: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/librarian/login' : '/api/librarian/register';
      const response = await axios.post(`http://127.0.0.1:8000${endpoint}`, formData);

      if (isLogin) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        sessionStorage.setItem('isLibrarian', 'true');
        toast.success("Access granted. Welcome to the dashboard!");
        router.push('/dashboard');
      } else {
        toast.success("Librarian account created successfully!");
        setIsLogin(true);
        setFormData({ ...formData, password: '' });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-stone-900 rounded-[2rem] mb-6 shadow-2xl group hover:rotate-6 transition-transform">
            <ShieldCheck className="w-10 h-10 text-stone-50" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-stone-900 tracking-tight">
            {isLogin ? 'Librarian Login' : 'Register Admin'}
          </h1>
          <p className="text-stone-500 mt-2 font-medium">
            {isLogin ? 'Access the management dashboard' : 'Create a new librarian account'}
          </p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-stone-200/50 border border-stone-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {!isLogin && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300" />
                    <input 
                      name="fullname"
                      type="text"
                      required
                      value={formData.fullname}
                      onChange={handleChange}
                      placeholder="Admin Name"
                      className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-4 focus:ring-orange-800/5 focus:border-orange-800/20 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Username</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300" />
                    <input 
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="admin_username"
                      className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-4 focus:ring-orange-800/5 focus:border-orange-800/20 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Email or Username</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300" />
                <input 
                  name="email"
                  type="text"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@libriofy.com"
                  className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-4 focus:ring-orange-800/5 focus:border-orange-800/20 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300" />
                <input 
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-4 focus:ring-orange-800/5 focus:border-orange-800/20 outline-none transition-all font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-orange-800 ml-2">Master Access Code</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-800/30" />
                <input 
                  name="access_code"
                  type="password"
                  required
                  value={formData.access_code}
                  onChange={handleChange}
                  placeholder="GATE CODE"
                  className="w-full pl-12 pr-4 py-4 bg-orange-50/30 border border-orange-100 rounded-2xl focus:ring-4 focus:ring-orange-800/5 focus:border-orange-800/20 outline-none transition-all text-orange-900 font-bold"
                />
              </div>
            </div>
            
            <button 
              disabled={loading}
              className="w-full bg-stone-900 hover:bg-orange-800 text-white py-5 rounded-[1.5rem] font-bold transition-all flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] disabled:opacity-50 mt-4"
            >
              {loading ? 'Verifying...' : (isLogin ? 'Enter Dashboard' : 'Create Admin Account')}
              {!loading && <ChevronRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-stone-400 hover:text-orange-800 text-sm font-bold transition-colors"
            >
              {isLogin ? "Don't have an admin account? Register" : "Already have an admin account? Login"}
            </button>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/" className="text-stone-400 hover:text-stone-600 text-sm font-medium flex items-center justify-center gap-2 transition-all">
             <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
