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
  Edit,
  Shield,
  Star,
  Eye,
  EyeOff,
  Building2,
  Calendar,
  Barcode,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

export default function LibraryPage() {
  const [user, setUser] = useState<any>(null);
  //const [user, setUser] = useState<any>({ fullname: "Pengguna Uji Coba" }); //untuk testing tanpa backend
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Profile handling
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isForgetPasswordOpen, setIsForgetPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatNewPassword, setShowRepeatNewPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [profilePhotoDraft, setProfilePhotoDraft] = useState("");
  const [formData, setFormData] = useState({
    username: "",
  });

  // --- STATE BUKU ---
  const [allBooks, setAllBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null); // Menyimpan buku yang diklik
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Modal Sukses Pinjam

  // Notification handling
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  // Notification dummy data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Book Available",
      message:
        "The book 'Atomic Habits' you were waiting for is now available.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      title: "Reminder",
      message: "Loan period for 'Dune' expires in 3 days.",
      time: "5 hours ago",
      unread: true,
    },
    {
      id: 3,
      title: "System Update",
      message: "Libriofy now comes with an Edit Profile feature.",
      time: "1 day ago",
      unread: false,
    },
  ]);

  // Logic to check for unread notifications
  const hasUnread = notifications.some((n) => n.unread);
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  // Fetch books from backend
  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books");
      const data = await response.json();

      const formattedBooks = data.map((b: any) => ({
        id: b.id,
        title: b.title,
        author: b.author_name || "Unknown",
        category: b.category_name || "Uncategorized",
        year: b.year || "N/A", // Assuming year might be added or handled
        publisher: b.publisher_name || "Unknown",
        isbn: b.isbn,
        stock: b.stock,
        cover_image: b.cover_image,
        synopsis: b.description || "No description available.",
      }));

      setAllBooks(formattedBooks);
    } catch (error) {
      console.error("Gagal mengambil buku:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Filter options for category and year
  const categories = ["All Categories", "Fiction", "Science", "Education"];
  const yearOptions = [
    "All Years",
    "2020 and above",
    "2010 - 2019",
    "Before 2010",
  ];

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredBooks = allBooks.filter((book) => {
    const matchCategory =
      selectedCategory === "All Categories" ||
      book.category === selectedCategory;

    let matchYear = true;
    if (selectedYear === "2020 and above") matchYear = book.year >= 2020;
    else if (selectedYear === "2010 - 2019")
      matchYear = book.year >= 2010 && book.year <= 2019;
    else if (selectedYear === "Before 2010") matchYear = book.year < 2010;

    const matchSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchYear && matchSearch;
  });

  // --- FUNGSI PINJAM BUKU ---
  const handleBorrowBook = () => {
    // 1. Tutup modal detail buku
    setSelectedBook(null);

    // 2. Tampilkan modal sukses (sedikit delay agar transisi halus)
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 150);
  };

  // Proteksi Halaman: Hanya user yang sudah login bisa masuk
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
      router.replace("/login");
      //setUser({ fullname: "Tamu (Preview Mode)" }); //Untuk viewing tanpa login, bisa diaktifkan ini
    } else {
      const parsedUser = JSON.parse(savedUser);
      const profilePhoto = parsedUser.username
        ? localStorage.getItem(`profile_photo_${parsedUser.username}`)
        : null;

      if (profilePhoto) {
        parsedUser.profilePhoto = profilePhoto;
      }

      setUser(parsedUser);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.replace("/");
  };

  const handleSaveProfile = () => {
    const nextUsername =
      formData.username.trim() !== ""
        ? formData.username.trim()
        : user.username;

    const updatedUser = {
      ...user,
      username: nextUsername,
      profilePhoto: profilePhotoDraft || "",
    };

    if (user.username && user.username !== nextUsername) {
      localStorage.removeItem(`profile_photo_${user.username}`);
    }

    if (profilePhotoDraft) {
      localStorage.setItem(`profile_photo_${nextUsername}`, profilePhotoDraft);
    } else {
      localStorage.removeItem(`profile_photo_${nextUsername}`);
    }

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditing(false);
    alert("Profile successfully updated!");
  };

  const handleStartEditProfile = () => {
    setFormData({ username: user.username || "" });
    setProfilePhotoDraft(user.profilePhoto || "");
    setIsEditing(true);
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhotoDraft(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isForgetPasswordOpen) {
      setNewPassword("");
      setRepeatNewPassword("");
      setShowNewPassword(false);
      setShowRepeatNewPassword(false);
    }
  }, [isForgetPasswordOpen]);

  const handleChangePassword = async () => {
    if (newPassword.trim() === "" || repeatNewPassword.trim() === "") {
      alert("Password baru dan ulangi password wajib diisi");
      return;
    }

    if (newPassword !== repeatNewPassword) {
      alert("Password baru dan ulangi password harus sama");
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const loginId = user.email || user.username;
      const response = await fetch(
        "http://127.0.0.1:8000/api/change-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            login_id: loginId,
            new_password: newPassword,
            confirm_password: repeatNewPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Gagal mengubah password");
      }

      setNewPassword("");
      setRepeatNewPassword("");
      setShowNewPassword(false);
      setShowRepeatNewPassword(false);
      setIsForgetPasswordOpen(false);
      alert("Password berhasil diubah. Silakan login dengan password baru.");
    } catch (error: any) {
      alert(error.message || "Gagal mengubah password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (!user) return null; // Prevent content flashing before redirect

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* --- LIBRARY NAVBAR --- */}
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
                <LibraryBig className="w-4 h-4" /> Explore Catalog
              </Link>
              <Link
                href="/history"
                className="hover:text-orange-800 transition-colors flex items-center gap-2"
              >
                <Bookmark className="w-4 h-4" /> My Loans
              </Link>
              <Link
                href="/favorites"
                className="hover:text-orange-800 transition-colors flex items-center gap-2"
              >
                <Heart className="w-4 h-4" /> Favorite Collection
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

                {/* NOTIFICATION DROPDOWN */}
                {isNotificationOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsNotificationOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl border border-stone-100 py-6 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right overflow-hidden">
                      <div className="px-6 mb-4 flex items-center justify-between">
                        <h4 className="font-serif font-bold text-stone-900">
                          Notifications
                        </h4>
                        {hasUnread && (
                          <button
                            onClick={markAllAsRead}
                            className="text-[10px] font-black text-orange-800 hover:underline"
                          >
                            MARK ALL AS READ
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
                  title="Logout"
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
              Library Catalog
            </h1>
            <p className="text-stone-500 mt-1">
              Find a read that matches your mood today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full max-w-md hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white border border-stone-200 rounded-2xl text-sm w-full md:w-80 shadow-sm focus:ring-2 focus:ring-orange-800/10 outline-none transition-all"
              />
            </div>
            <div className="flex gap-4 items-center relative">
              {/* Filter Trigger Button */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`p-3 border rounded-2xl flex items-center gap-2 transition-all ${
                  isFilterOpen
                    ? "bg-orange-800 text-white border-orange-800"
                    : "bg-white text-stone-600 border-stone-200"
                }`}
              >
                <Filter className="w-5 h-5" />
                <span className="text-sm font-bold">Filter</span>
              </button>

              {/* Dropdown Menu */}
              {isFilterOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsFilterOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-stone-100 rounded-[2rem] shadow-2xl z-20 p-6 animate-in fade-in zoom-in-95 duration-200">
                    {/* Category Filter */}
                    <div className="mb-4">
                      <label className="text-[10px] font-black uppercase text-stone-400 ml-1 mb-2 block">
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-800/10"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Year Filter */}
                    <div className="mb-4">
                      <label className="text-[10px] font-black uppercase text-stone-400 ml-1 mb-2 block">
                        Release Year
                      </label>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-800/10"
                      >
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCategory("All Categories");
                        setSelectedYear("All Years");
                      }}
                      className="w-full py-2 text-[10px] font-bold text-orange-800 uppercase hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div
                key={book.id}
                className="group cursor-pointer"
                onClick={() => setSelectedBook(book)}
              >
                <div className="aspect-[3/4] bg-stone-200 rounded-[2rem] mb-4 overflow-hidden shadow-md group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300 relative">
                  {book.cover_image ? (
                    <img
                      src={`http://127.0.0.1:8000/uploads/cover/${book.cover_image}`}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="flex items-center justify-center h-full text-stone-400 italic text-sm text-center px-4">
                        Sampul {book.title}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-stone-400 italic">
              Books not found with those criteria.
            </div>
          )}
        </div>
      </main>

      {/* --- PROFILE & EDIT MODAL --- */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => {
              setIsProfileOpen(false);
              setIsEditing(false);
              setIsForgetPasswordOpen(false);
            }}
          ></div>

          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-stone-100 overflow-hidden animate-in zoom-in duration-300">
            {/* Header Background */}
            <div className="h-28 bg-gradient-to-br from-orange-800 to-stone-900 w-full relative">
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsEditing(false);
                  setIsForgetPasswordOpen(false);
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
                    {(isEditing ? profilePhotoDraft : user.profilePhoto) ? (
                      <img
                        src={isEditing ? profilePhotoDraft : user.profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.fullname?.charAt(0).toUpperCase()
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-1.5 right-1.5 w-9 h-9 rounded-full bg-orange-800 text-white flex items-center justify-center shadow-lg cursor-pointer hover:bg-orange-900 transition-colors border-2 border-white">
                      <Edit className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePhotoChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* VIEW MODE VIEW */}
              {!isEditing ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-serif font-bold text-stone-900">
                      {user.fullname}
                    </h2>
                    <p className="text-stone-400 text-sm">@{user.username}</p>
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
                        Total Loans
                      </p>
                      <p className="text-sm font-bold text-stone-700 flex items-center justify-center gap-1.5">
                        <LibraryBig className="w-3.5 h-3.5 text-orange-800" />{" "}
                        12 Books
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleStartEditProfile}
                      className="w-full py-4 bg-stone-900 hover:bg-orange-800 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
                    >
                      <Edit className="w-4 h-4" /> Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full py-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-all"
                    >
                      Logout from Account
                    </button>
                  </div>
                </div>
              ) : (
                /* EDIT MODE VIEW */
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-center font-bold text-stone-900 mb-6 uppercase text-xs tracking-[0.2em]">
                    Account Settings
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-stone-400 ml-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        className="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-orange-800/10 outline-none transition-all"
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-4 bg-stone-100 text-stone-500 rounded-2xl font-bold text-sm hover:bg-stone-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 py-4 bg-orange-800 text-white rounded-2xl font-bold text-sm hover:bg-orange-900 transition-all shadow-lg shadow-orange-900/20 active:scale-95"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isForgetPasswordOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setIsForgetPasswordOpen(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl border border-stone-100 p-8">
            <button
              onClick={() => setIsForgetPasswordOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">
              Change Password
            </h3>
            <p className="text-sm text-stone-500 mb-6">
              Masukkan password baru, lalu ulangi password baru.
            </p>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-stone-400 ml-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="new_password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 pr-12 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-orange-800/10 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-stone-400 ml-2">
                  Repeat New Password
                </label>
                <div className="relative">
                  <input
                    type={showRepeatNewPassword ? "text" : "password"}
                    name="repeat_new_password"
                    autoComplete="new-password"
                    value={repeatNewPassword}
                    onChange={(e) => setRepeatNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 pr-12 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-orange-800/10 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowRepeatNewPassword(!showRepeatNewPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showRepeatNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsForgetPasswordOpen(false)}
                className="flex-1 py-4 bg-stone-100 text-stone-500 rounded-2xl font-bold text-sm hover:bg-stone-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={isUpdatingPassword}
                className="flex-1 py-4 bg-orange-800 text-white rounded-2xl font-bold text-sm hover:bg-orange-900 transition-all shadow-lg shadow-orange-900/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isUpdatingPassword ? "Saving..." : "Save Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedBook(null)}
          />

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh]">
            {/* Tombol Close */}
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-6 right-6 z-10 p-2 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-stone-600" />
            </button>

            {/* Kiri: Cover & Visual */}
            <div className="w-full md:w-2/5 bg-stone-100 p-8 md:p-12 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-stone-200/50" />
              <div className="relative w-48 aspect-[3/4] bg-white rounded-2xl shadow-xl flex items-center justify-center text-center overflow-hidden z-0">
                {selectedBook.cover_image ? (
                  <img
                    src={`http://127.0.0.1:8000/uploads/cover/${selectedBook.cover_image}`}
                    alt={selectedBook.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-4 space-y-2">
                    <Book className="w-12 h-12 text-orange-800 mx-auto opacity-50" />
                    <p className="font-serif font-bold text-stone-800">
                      {selectedBook.title}
                    </p>
                    <p className="text-xs text-stone-400">
                      {selectedBook.author}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Kanan: Detail Informasi */}
            <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto">
              <div className="mb-6">
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {selectedBook.category}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${selectedBook.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {selectedBook.stock > 0 ? "Tersedia" : "Stok Habis"}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-2 leading-tight">
                  {selectedBook.title}
                </h2>
                <p className="text-lg text-stone-500 font-medium">
                  {selectedBook.author}
                </p>
              </div>

              {/* Grid Info Detail */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <p className="text-[10px] font-black uppercase text-stone-400 mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3 h-3" /> Penerbit
                  </p>
                  <p
                    className="text-sm font-bold text-stone-800 truncate"
                    title={selectedBook.publisher}
                  >
                    {selectedBook.publisher}
                  </p>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <p className="text-[10px] font-black uppercase text-stone-400 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> Tahun Terbit
                  </p>
                  <p className="text-sm font-bold text-stone-800">
                    {selectedBook.year}
                  </p>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <p className="text-[10px] font-black uppercase text-stone-400 mb-1 flex items-center gap-1.5">
                    <Barcode className="w-3 h-3" /> ISBN
                  </p>
                  <p className="text-sm font-bold text-stone-800 font-mono tracking-tight">
                    {selectedBook.isbn}
                  </p>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <p className="text-[10px] font-black uppercase text-stone-400 mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3" /> Stok Buku
                  </p>
                  <p className="text-sm font-bold text-stone-800">
                    {selectedBook.stock} Eksemplar
                  </p>
                </div>
              </div>

              {/* Sinopsis */}
              <div className="mb-8">
                <h3 className="font-bold text-stone-900 mb-2">Sinopsis</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {selectedBook.synopsis}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 border-t border-stone-100 pt-8">
                <button
                  className="flex-1 bg-stone-900 hover:bg-orange-800 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleBorrowBook}
                  disabled={selectedBook.stock === 0}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {selectedBook.stock > 0 ? "Pinjam Buku Ini" : "Stok Habis"}
                </button>
                <button
                  className="px-6 py-4 bg-stone-100 text-stone-500 hover:bg-red-50 hover:text-red-500 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group"
                  onClick={() => alert("Ditambahkan ke favorit")}
                >
                  <Heart className="w-5 h-5 group-hover:fill-current" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL SUKSES PINJAM (BARU) --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop Transparan */}
          <div
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          />

          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center relative z-10 animate-in zoom-in duration-300 shadow-2xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">
              Berhasil Dipinjam!
            </h3>
            <p className="text-stone-500 text-sm mb-8 leading-relaxed">
              Buku telah berhasil ditambahkan ke daftar pinjaman Anda. Selamat
              membaca!
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-orange-800 transition-all shadow-lg active:scale-95"
            >
              Oke, Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
