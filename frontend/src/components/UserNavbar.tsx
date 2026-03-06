"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Book,
  LibraryBig,
  Bookmark,
  User,
  LogOut,
  X,
  Edit,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";

interface UserNavbarProps {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

export default function UserNavbar({ user, setUser }: UserNavbarProps) {
  const router = useRouter();

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.replace("/");
  };

  const handleSaveProfile = () => {
    const nextUsername =
      formData.username.trim() !== "" ? formData.username.trim() : user.username;

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
    toast.success("Profile successfully updated!");
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
      toast.error("New password and repeat password are required");
      return;
    }

    if (newPassword !== repeatNewPassword) {
      toast.error("New password and repeat password must match");
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const loginId = user.email || user.username;
      const response = await fetch("http://127.0.0.1:8000/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_id: loginId,
          new_password: newPassword,
          confirm_password: repeatNewPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Failed to change password");
      }

      setNewPassword("");
      setRepeatNewPassword("");
      setShowNewPassword(false);
      setShowRepeatNewPassword(false);
      setIsForgetPasswordOpen(false);
      toast.success("Password successfully changed. Please login with your new password.");
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <>
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
              <Link href="/librarypage" className="text-orange-800 flex items-center gap-2">
                <LibraryBig className="w-4 h-4" /> Explore Catalog
              </Link>
              <Link href="/history" className="hover:text-orange-800 transition-colors flex items-center gap-2">
                <Bookmark className="w-4 h-4" /> My Loans
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 pl-4 border-l border-stone-200">
              <div className="flex items-center gap-3 group">
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center gap-3 p-1 hover:bg-stone-50 rounded-2xl transition-all border border-transparent hover:border-stone-100"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-stone-800 leading-none">
                      {user?.fullname}
                    </p>
                    <p className="text-[10px] text-stone-400 font-medium uppercase tracking-tighter mt-1">
                      {user?.username}
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

      {/* PROFILE MODAL */}
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
                    {(isEditing ? profilePhotoDraft : user?.profilePhoto) ? (
                      <img
                        src={isEditing ? profilePhotoDraft : user?.profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.fullname?.charAt(0).toUpperCase()
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
                      {user?.fullname}
                    </h2>
                    <p className="text-stone-400 text-sm">@{user?.username}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-stone-50 rounded-3xl border border-stone-100 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">
                        Status
                      </p>
                      <p className="text-sm font-bold text-stone-700 flex items-center justify-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-orange-800" /> Member
                      </p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-3xl border border-stone-100 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">
                        Total Loans
                      </p>
                      <p className="text-sm font-bold text-stone-700 flex items-center justify-center gap-1.5">
                        <LibraryBig className="w-3.5 h-3.5 text-orange-800" /> 12 Books
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

      {/* FORGET PASSWORD MODAL */}
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
              Enter your new password, then repeat it.
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
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                    onClick={() => setShowRepeatNewPassword(!showRepeatNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showRepeatNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
    </>
  );
}
