"use client";

import React, { useState, useEffect } from "react";
import {
  Book,
  LayoutDashboard,
  Home,
  Search,
  User,
  LogOut,
  Bookmark,
  ChevronDown,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoanHistoryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedUser, setExpandedUser] = useState<number | null>(null);

  // Profile handling for Navbar
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [adminData, setAdminData] = useState({
    fullname: "Admin Perpustakaan",
    email: "admin@library.com",
    role: "Librarian",
    username: "admin_utama",
  });
  const [usersWithLoans, setUsersWithLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/admin/users");
        const data = await res.json();
        setUsersWithLoans(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Dummy Data for Users and their Loans

  const filteredUsers = usersWithLoans.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.fullname.toLowerCase().includes(query) ||
      u.username.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    );
  });

  const toggleUser = (userId: number) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-800 font-sans pb-20">
      {/* Navbar — SAMA DENGAN DASHBOARD */}
      <nav className="sticky top-0 z-50 bg-white border-b border-stone-200 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-800 rounded-lg">
              <Book className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-serif font-bold">Libriofy</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-stone-500 hover:text-orange-800 transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href="/adminlibrarypage"
              className="flex items-center gap-2 text-stone-500 hover:text-orange-800 transition-all"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/adminhistory"
              className="flex items-center gap-2 text-orange-800 bg-orange-50 px-3 py-1.5 rounded-lg transition-all"
            >
              <Bookmark className="w-4 h-4" />
              History
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 group">
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-3 p-1 hover:bg-stone-50 rounded-2xl transition-all border border-transparent hover:border-stone-100"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-stone-800 leading-none">
                {adminData.username}
              </p>
              <p className="text-[10px] text-stone-400 font-medium uppercase tracking-tighter mt-1">
                {adminData.fullname}
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
      </nav>

      <main className="max-w-5xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">
              Borrower History
            </h1>
            <p className="text-stone-500">
              Manage and monitor book loans by library members.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search user or email..."
              className="pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-sm focus:ring-4 focus:ring-orange-800/5 focus:border-orange-800/20 outline-none w-72 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* User List Accordion */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 text-stone-400 font-bold">
              Loading data...
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`bg-white border rounded-[2.5rem] overflow-hidden transition-all duration-300 ${
                  expandedUser === user.id
                    ? "border-orange-200 shadow-xl shadow-orange-900/5 ring-1 ring-orange-800/5"
                    : "border-stone-100 shadow-sm hover:border-stone-200 hover:shadow-md"
                }`}
              >
                {/* Accordion Header (User Info) */}
                <button
                  onClick={() => toggleUser(user.id)}
                  className="w-full flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 text-left group"
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${expandedUser === user.id ? "bg-orange-800 text-white" : "bg-orange-50 text-orange-800"}`}
                    >
                      <User className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-stone-900 group-hover:text-orange-800 transition-colors">
                        {user.fullname}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-1">
                        <span className="text-xs font-medium text-stone-400 flex items-center gap-1.5">
                          @{user.username}
                        </span>
                        <span className="hidden md:block w-1 h-1 bg-stone-200 rounded-full" />
                        <span className="text-xs font-medium text-stone-400 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" /> {user.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-300 mb-1">
                        Total Loans
                      </p>
                      <p className="text-sm font-bold text-stone-700">
                        {user.loans.length} Books
                      </p>
                    </div>
                    <div
                      className={`p-2 rounded-full transition-all ${expandedUser === user.id ? "bg-orange-50 text-orange-800 rotate-180" : "text-stone-300 group-hover:text-stone-400"}`}
                    >
                      <ChevronDown className="w-6 h-6" />
                    </div>
                  </div>
                </button>

                {/* Accordion Content (Loan List) */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    expandedUser === user.id
                      ? "max-h-[1000px] border-t border-orange-50"
                      : "max-h-0"
                  }`}
                >
                  <div className="p-8 bg-stone-50/30">
                    <div className="space-y-4">
                      {user.loans.map((loan) => (
                        <div
                          key={loan.id}
                          className="bg-white border border-stone-100 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-5">
                            <div
                              className={`p-3 rounded-2xl ${loan.status === "RETURNED" ? "bg-stone-50 text-stone-300" : "bg-orange-100 text-orange-800"}`}
                            >
                              <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-stone-800">
                                {loan.title}
                              </h4>
                              <p className="text-xs text-stone-400 font-medium">
                                {loan.author}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-6 mt-4 md:mt-0">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-stone-300" />
                              <div>
                                <p className="text-[9px] font-black uppercase text-stone-300 leading-none">
                                  Borrowed Date
                                </p>
                                <p className="text-xs font-bold text-stone-600">
                                  {loan.date}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-stone-300" />
                              <div>
                                <p className="text-[9px] font-black uppercase text-stone-300 leading-none">
                                  Due Date
                                </p>
                                <p className="text-xs font-bold text-stone-600">
                                  {loan.dueDate}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                                loan.status === "RETURNED"
                                  ? "bg-green-50 text-green-600"
                                  : "bg-orange-50 text-orange-600"
                              }`}
                            >
                              {loan.status === "RETURNED" ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />{" "}
                                  Returned
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-3.5 h-3.5" /> Active
                                  Loan
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-stone-200">
              <div className="bg-stone-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-stone-300 w-10 h-10" />
              </div>
              <p className="text-stone-400 font-bold">
                No users found with that criteria.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-orange-800 text-sm font-bold hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </main>

      {/* MODAL PROFILE ADMIN (SAMA DENGAN DASHBOARD) */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={() => {
              setIsProfileOpen(false);
              setIsEditingProfile(false);
            }}
          />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="h-28 bg-stone-900 w-full relative">
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsEditingProfile(false);
                }}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-8 pb-10">
              <div className="relative -mt-12 mb-6 flex justify-center">
                <div className="w-24 h-24 bg-white rounded-[1.5rem] p-1.5 shadow-xl">
                  <div className="w-full h-full bg-orange-50 rounded-[1.2rem] flex items-center justify-center text-orange-800 font-bold text-2xl">
                    {adminData.fullname.charAt(0)}
                  </div>
                </div>
              </div>

              {!isEditingProfile ? (
                <div className="animate-in slide-in-from-bottom-4 duration-300">
                  <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-stone-900">
                      {adminData.fullname}
                    </h2>
                    <p className="text-orange-800 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
                      {adminData.role}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 bg-stone-50 rounded-2xl flex items-center gap-4 border border-stone-100">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-stone-400 shadow-sm">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-stone-400">
                          Username
                        </p>
                        <p className="text-sm font-bold text-stone-700">
                          {adminData.username}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-2xl flex items-center gap-4 border border-stone-100">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-stone-400 shadow-sm">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-stone-400">
                          Email
                        </p>
                        <p className="text-sm font-bold text-stone-700">
                          {adminData.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="flex-1 py-3 bg-stone-100 text-stone-600 rounded-xl font-bold text-sm hover:bg-stone-200 transition-all flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" /> Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Edit Profile Fields... (Disingkat untuk fokus ke UI utama) */
                <div className="text-center py-4">
                  <p className="text-sm text-stone-500 italic">
                    Edit mode active...
                  </p>
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="mt-4 px-6 py-2 bg-orange-800 text-white rounded-xl font-bold"
                  >
                    Back
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
