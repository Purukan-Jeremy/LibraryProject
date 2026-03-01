"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Filter,
  X,
  Mail,
  Edit,
  Shield,
  Star,
  Camera,
} from "lucide-react";

export default function LibraryPage() {
  //const [user, setUser] = useState<any>(null);
  const [user, setUser] = useState<any>({ fullname: "Pengguna Uji Coba" });
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  // Contoh data notifikasi (Data Dummy)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Buku Tersedia",
      message: "Buku 'Atomic Habits' yang Anda tunggu sudah tersedia.",
      time: "2 jam yang lalu",
      unread: true,
    },
    {
      id: 2,
      title: "Pengingat",
      message: "Batas peminjaman buku 'Dune' sisa 3 hari lagi.",
      time: "5 jam yang lalu",
      unread: true,
    },
    {
      id: 3,
      title: "Update Sistem",
      message: "Libriofy kini hadir dengan fitur Edit Profil.",
      time: "1 hari yang lalu",
      unread: false,
    },
  ]);

  // Logika cek apakah ada notifikasi yang belum dibaca
  const hasUnread = notifications.some((n) => n.unread);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  // Proteksi Halaman: Hanya user yang sudah login bisa masuk
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
      // setUser({ fullname: "Tamu (Preview Mode)" }); //Untuk viewing tanpa login, bisa diaktifkan ini
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) return null; // Mencegah flashing content sebelum redirect

  const handleSaveProfile = () => {
    const updatedUser = {
      ...user,
      fullname: formData.fullname !== "" ? formData.fullname : user.fullname,
      email: formData.email !== "" ? formData.email : user.email,
      // Password biasanya dikirim ke API, di sini kita simulasi saja
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditing(false);
    alert("Profil berhasil diperbarui!");
  };

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
              <span className="text-xl font-serif font-bold text-stone-800 tracking-tight">
                Libriofy
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-500">
              <Link
                href="/librarypage"
                className="text-orange-800 flex items-center gap-2"
              >
                <LibraryBig className="w-4 h-4" /> Jelajah Katalog
              </Link>
              <Link
                href="/history"
                className="hover:text-orange-800 transition-colors flex items-center gap-2"
              >
                <Bookmark className="w-4 h-4" /> Pinjaman Saya
              </Link>
              <Link
                href="/favorites"
                className="hover:text-orange-800 transition-colors flex items-center gap-2"
              >
                <Heart className="w-4 h-4" /> Koleksi Favorit
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 pl-4 border-l border-stone-200">
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotificationOpen(!isNotificationOpen);
                    setIsProfileOpen(false);
                  }}
                  className={`p-2.5 rounded-xl transition-all relative ${isNotificationOpen ? "text-orange-800 bg-orange-50" : "text-stone-400 hover:text-orange-800 hover:bg-orange-50"}`}
                >
                  <Bell className="w-6 h-6" />
                  {hasUnread && (
                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                  )}
                </button>

                {/* DROPDOWN LONCENG */}
                {isNotificationOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsNotificationOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl border border-stone-100 py-6 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right overflow-hidden">
                      <div className="px-6 mb-4 flex items-center justify-between">
                        <h4 className="font-serif font-bold text-stone-900">
                          Notifikasi
                        </h4>
                        {hasUnread && (
                          <button
                            onClick={markAllAsRead}
                            className="text-[10px] font-black text-orange-800 hover:underline"
                          >
                            TANDAI DIBACA
                          </button>
                        )}
                      </div>
                      <div className="max-h-[300px] overflow-y-auto px-2">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-4 rounded-2xl flex gap-3 transition-colors ${n.unread ? "bg-orange-50/50" : "opacity-60"}`}
                          >
                            <div
                              className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${n.unread ? "bg-orange-800" : "bg-transparent"}`}
                            />
                            <div>
                              <p className="text-sm font-bold text-stone-900 leading-tight">
                                {n.title}
                              </p>
                              <p className="text-xs text-stone-500 mt-1">
                                {n.message}
                              </p>
                              <p className="text-[10px] text-stone-400 mt-2 font-medium">
                                {n.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3 group">
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center gap-3 p-1 hover:bg-stone-50 rounded-2xl transition-all border border-transparent hover:border-stone-100"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-stone-800 leading-none">
                      {user.fullname}
                    </p>
                    <p className="text-[10px] text-stone-400 font-medium uppercase tracking-tighter mt-1">
                      {user.username}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center border-2 border-orange-800/20 overflow-hidden">
                    <User className="w-6 h-6 text-orange-800" />
                  </div>
                </button>
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
            <h1 className="text-4xl font-serif font-bold text-stone-900">
              Katalog Perpustakaan
            </h1>
            <p className="text-stone-500 mt-1">
              Temukan bacaan yang sesuai dengan suasana hatimu hari ini.
            </p>
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
                <div className="flex items-center justify-center h-full text-stone-400 italic text-sm">
                  Sampul Buku
                </div>
              </div>
              <h3 className="font-bold text-stone-800 group-hover:text-orange-800 transition-colors">
                Judul Buku {item}
              </h3>
              <p className="text-xs text-stone-500 font-medium">Penulis Buku</p>
            </div>
          ))}
        </div>
      </main>

      {/* --- MODAL PROFILE & EDIT --- */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => {
              setIsProfileOpen(false);
              setIsEditing(false);
            }}
          ></div>

          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-stone-100 overflow-hidden animate-in zoom-in duration-300">
            {/* Header Background */}
            <div className="h-28 bg-gradient-to-br from-orange-800 to-stone-900 w-full relative">
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsEditing(false);
                }}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-10 pb-10">
              {/* Profile Picture Section */}
              <div className="relative -mt-14 mb-6 text-center">
                <div className="w-28 h-28 bg-white rounded-[2rem] p-1.5 shadow-2xl mx-auto relative group">
                  <div className="w-full h-full bg-stone-100 rounded-[1.5rem] flex items-center justify-center text-4xl font-serif font-bold text-orange-800 border border-stone-50 overflow-hidden">
                    {user.fullname?.charAt(0).toUpperCase()}
                  </div>
                  {isEditing && (
                    <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-[1.5rem] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                      <Camera className="w-6 h-6 text-white mb-1" />
                      <span className="text-[8px] text-white font-black uppercase">
                        Ganti
                      </span>
                      <input type="file" className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* TAMPILAN VIEW MODE */}
              {!isEditing ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-serif font-bold text-stone-900">
                      {user.fullname}
                    </h2>
                    <p className="text-stone-400 text-sm">{user.email}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-stone-50 rounded-3xl border border-stone-100 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">
                        Status
                      </p>
                      <p className="text-sm font-bold text-stone-700 flex items-center justify-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-orange-800" />{" "}
                        Member
                      </p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-3xl border border-stone-100 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">
                        Total Pinjaman
                      </p>
                      <p className="text-sm font-bold text-stone-700 flex items-center justify-center gap-1.5">
                        <LibraryBig className="w-3.5 h-3.5 text-orange-800" />{" "}
                        12 Buku
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full py-4 bg-stone-900 hover:bg-orange-800 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
                    >
                      <Edit className="w-4 h-4" /> Edit Profil
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full py-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-all"
                    >
                      Keluar dari Akun
                    </button>
                  </div>
                </div>
              ) : (
                /* TAMPILAN EDIT MODE */
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-center font-bold text-stone-900 mb-6 uppercase text-xs tracking-[0.2em]">
                    Pengaturan Akun
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-stone-400 ml-2">
                        Username
                      </label>
                      <input
                        type="text"
                        placeholder={user.fullname}
                        className="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-orange-800/10 outline-none transition-all"
                        onChange={(e) =>
                          setFormData({ ...formData, fullname: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-stone-400 ml-2">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder={user.email}
                        className="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-orange-800/10 outline-none transition-all"
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-stone-400 ml-2">
                        Password Baru
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-orange-800/10 outline-none transition-all"
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-4 bg-stone-100 text-stone-500 rounded-2xl font-bold text-sm hover:bg-stone-200 transition-all"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 py-4 bg-orange-800 text-white rounded-2xl font-bold text-sm hover:bg-orange-900 transition-all shadow-lg shadow-orange-900/20 active:scale-95"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
