"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Book,
  LayoutDashboard,
  Home,
  Bookmark,
  User,
  LogOut,
  X,
  Mail,
  Edit,
} from "lucide-react";

export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  const [adminData, setAdminData] = useState<any>({
    fullname: "Admin",
    email: "admin@library.com",
    role: "Librarian",
    username: "admin",
  });

  React.useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setAdminData(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Home", href: "/adminlibrarypage", icon: Home },
    { name: "History", href: "/adminhistory", icon: Bookmark },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-stone-200 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-800 rounded-lg">
              <Book className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-serif font-bold text-stone-800">Libriofy</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 transition-all ${
                    isActive
                      ? "text-orange-800 bg-orange-50 px-3 py-1.5 rounded-lg"
                      : "text-stone-500 hover:text-orange-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
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
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* MODAL PROFILE ADMIN */}
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
            {/* Header Modal */}
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
              {/* Avatar Section */}
              <div className="relative -mt-12 mb-6 flex justify-center">
                <div className="w-24 h-24 bg-white rounded-[1.5rem] p-1.5 shadow-xl">
                  <div className="w-full h-full bg-orange-50 rounded-[1.2rem] flex items-center justify-center text-orange-800 font-bold text-2xl">
                    {adminData.fullname.charAt(0)}
                  </div>
                </div>
              </div>

              {!isEditingProfile ? (
                /* TAMPILAN VIEW PROFILE */
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
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* TAMPILAN EDIT PROFILE */
                <div className="animate-in fade-in duration-300">
                  <h3 className="text-lg font-bold text-stone-900 mb-6 text-center">
                    Update Admin Info
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-stone-400 ml-2 mb-1 block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={adminData.fullname}
                        onChange={(e) =>
                          setAdminData({
                            ...adminData,
                            fullname: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-orange-800/10 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-stone-400 ml-2 mb-1 block">
                        User Name
                      </label>
                      <input
                        type="text"
                        value={adminData.username}
                        onChange={(e) =>
                          setAdminData({
                            ...adminData,
                            username: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-orange-800/10 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-stone-400 ml-2 mb-1 block">
                        Email
                      </label>
                      <input
                        type="email"
                        value={adminData.email}
                        onChange={(e) =>
                          setAdminData({ ...adminData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-orange-800/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 py-3 bg-stone-50 text-stone-500 rounded-xl font-bold text-sm hover:bg-stone-100 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 py-3 bg-orange-800 text-white rounded-xl font-bold text-sm hover:bg-orange-900 transition-all shadow-lg shadow-orange-900/20"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
