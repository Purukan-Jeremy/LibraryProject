"use client";

import React, { useState } from 'react';
import { Book, Eye, EyeOff, Mail, Lock, User, AtSign, ChevronLeft } from "lucide-react";
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });
  const router = useRouter();

 const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const payload = {
      fullname: formData.fullName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role_id: 2 // Automatically as User
    };

    await axios.post("http://localhost:8000/api/register", payload);
    toast.success("Account successfully created! Please login.");
    router.push('/login');
  } catch (error: any) {
    const detailError = error.response?.data?.detail;
    toast.error(detailError || "Registration failed: Make sure the Backend is running");
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center px-6 py-12">
      <Link href="/login" className="absolute top-8 left-8 flex items-center gap-2 text-stone-500 hover:text-orange-800 transition-colors">
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back to Login</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-orange-800 rounded-2xl mb-4 shadow-lg shadow-orange-900/20">
            <Book className="w-8 h-8 text-stone-50" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Start Your Adventure</h1>
          <p className="text-stone-500 mt-2">Create a Libriofy account to save your book collection</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-stone-700 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input 
                  name="fullName"
                  type="text" 
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-800/20 focus:border-orange-800 outline-none transition-all text-stone-800"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-stone-700 ml-1">Username</label>
              <div className="relative">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input 
                  name="username"
                  type="text" 
                  value={formData.username}
                  onChange={handleChange}
                  placeholder='username'
                  required
                  className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-800/20 focus:border-orange-800 outline-none transition-all text-stone-800"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-stone-700 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input 
                  name="email"
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-800/20 focus:border-orange-800 outline-none transition-all text-stone-800"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-stone-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input 
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-800/20 focus:border-orange-800 outline-none transition-all text-stone-800"
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

            <button 
              type="submit"
              className="w-full bg-orange-800 hover:bg-orange-900 text-stone-50 py-4 rounded-2xl font-bold shadow-lg shadow-orange-900/10 transition-all transform active:scale-[0.98] mt-4"
            >
              Register Now
            </button>
          </form>

          <div className="mt-8 text-center border-t border-stone-100 pt-6">
            <p className="text-stone-500 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-stone-900 font-bold hover:text-orange-800 transition-colors decoration-2 underline-offset-4">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
