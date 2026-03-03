"use client";

import React, { useRef, useState } from 'react';
import { Book, Eye, EyeOff, Mail, Lock, ChevronLeft, X } from "lucide-react";
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [failedLoginCount, setFailedLoginCount] = useState(0);

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<"otp" | "reset">("otp");
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const router = useRouter();

  const resetForgotPasswordState = () => {
    setForgotStep("otp");
    setOtpDigits(Array(6).fill(''));
    setNewPassword('');
    setConfirmNewPassword('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsSendingOtp(false);
    setIsVerifyingOtp(false);
    setIsResettingPassword(false);
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = digit;
    setOtpDigits(nextDigits);

    if (digit && index < otpInputRefs.current.length - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const nextDigits = Array(6).fill('');
    pasted.split('').forEach((char, idx) => {
      nextDigits[idx] = char;
    });
    setOtpDigits(nextDigits);

    const focusIndex = Math.min(pasted.length, 5);
    otpInputRefs.current[focusIndex]?.focus();
  };

  const openForgotPasswordModal = () => {
    setForgotEmail(email.trim());
    resetForgotPasswordState();
    setIsForgotPasswordOpen(true);
  };

  const closeForgotPasswordModal = () => {
    setIsForgotPasswordOpen(false);
    resetForgotPasswordState();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email: email,
        password: password
      });

      localStorage.setItem('user', JSON.stringify(response.data.user));
      setFailedLoginCount(0);

      alert(`Welcome back, ${response.data.user.fullname}!`);
      router.replace('/librarypage');
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Login failed, please check your email and password";
      if (msg === "Email atau Password salah") {
        setFailedLoginCount((prev) => prev + 1);
      }
      alert(msg);
    }
  };

  const handleSendVerificationCode = async () => {
    if (!forgotEmail.trim()) {
      alert("Email wajib diisi");
      return;
    }

    try {
      setIsSendingOtp(true);
      const response = await axios.post("http://localhost:8000/api/forgot-password/send-otp", {
        email: forgotEmail.trim(),
      });
      alert(response.data?.message || "Kode verifikasi berhasil dikirim");
    } catch (error: any) {
      alert(error.response?.data?.detail || "Gagal mengirim kode verifikasi");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleConfirmOtp = async () => {
    const otpCode = otpDigits.join('').trim();
    if (otpCode.length !== 6) {
      alert("Kode OTP harus 6 digit");
      return;
    }

    try {
      setIsVerifyingOtp(true);
      await axios.post("http://localhost:8000/api/forgot-password/verify-otp", {
        email: forgotEmail.trim(),
        otp: otpCode.trim(),
      });
      setForgotStep("reset");
      alert("Kode OTP valid. Silakan reset password baru.");
    } catch (error: any) {
      alert(error.response?.data?.detail || "Kode OTP tidak valid");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSaveNewPassword = async () => {
    if (!newPassword.trim() || !confirmNewPassword.trim()) {
      alert("Password baru dan konfirmasi wajib diisi");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert("Password baru dan konfirmasi password harus sama");
      return;
    }

    try {
      setIsResettingPassword(true);
      const response = await axios.post("http://localhost:8000/api/forgot-password/reset", {
        email: forgotEmail.trim(),
        new_password: newPassword,
        confirm_password: confirmNewPassword,
      });

      alert(response.data?.message || "Password berhasil direset");
      closeForgotPasswordModal();
      setFailedLoginCount(0);
    } catch (error: any) {
      alert(error.response?.data?.detail || "Gagal reset password");
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center px-6">
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-stone-500 hover:text-orange-800 transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </Link>

        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex p-3 bg-orange-800 rounded-2xl mb-4 shadow-lg shadow-orange-900/20">
              <Book className="w-8 h-8 text-stone-50" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-stone-900">Welcome Back</h1>
            <p className="text-stone-500 mt-2">Login to start reading your favorite books</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-700 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    type="email"
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-800/20 focus:border-orange-800 outline-none transition-all text-stone-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-700 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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

              <button
                type="submit"
                className="w-full bg-stone-900 hover:bg-orange-800 text-stone-50 py-4 rounded-2xl font-bold shadow-lg shadow-stone-900/10 transition-all transform active:scale-[0.98]"
              >
                Login Now
              </button>

              {failedLoginCount >= 2 && (
                <div className="text-center -mt-1">
                  <button
                    type="button"
                    onClick={openForgotPasswordModal}
                    className="text-sm text-orange-800 font-semibold hover:underline underline-offset-4"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </form>

            <div className="mt-8 text-center">
              <p className="text-stone-500 text-sm">
                Don't have an account?{' '}
                <Link href="/register" className="text-orange-800 font-bold hover:underline decoration-2 underline-offset-4">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-stone-100">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-stone-900">
                  {forgotStep === "otp" ? "Forgot Password" : "Reset Password"}
                </h2>
                <p className="text-sm text-stone-500 mt-1">
                  {forgotStep === "otp"
                    ? "Masukkan email terdaftar, kirim OTP, lalu verifikasi kode."
                    : "Masukkan password baru untuk akun ini."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeForgotPasswordModal}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotStep === "otp" ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-stone-700 ml-1">Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="mt-2 w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-800/20 focus:border-orange-800 outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendVerificationCode}
                  disabled={isSendingOtp}
                  className="w-full bg-stone-900 hover:bg-orange-800 disabled:bg-stone-400 text-white py-3.5 rounded-2xl font-bold transition-all"
                >
                  {isSendingOtp ? "Sending..." : "Send Verification Code"}
                </button>

                <div>
                  <label className="text-sm font-semibold text-stone-700 ml-1">Verification Code</label>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          otpInputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="h-12 w-12 rounded-xl border border-stone-200 bg-stone-50 text-center text-lg font-bold text-stone-800 outline-none transition-all focus:border-orange-800 focus:ring-2 focus:ring-orange-800/20"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmOtp}
                  disabled={isVerifyingOtp}
                  className="w-full bg-orange-800 hover:bg-orange-900 disabled:bg-orange-300 text-white py-3.5 rounded-2xl font-bold transition-all"
                >
                  {isVerifyingOtp ? "Confirming..." : "Confirm"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-stone-700 ml-1">Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    disabled
                    className="mt-2 w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-2xl text-stone-500"
                  />
                </div>

                <div className="relative">
                  <label className="text-sm font-semibold text-stone-700 ml-1">New Password</label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="mt-2 w-full px-4 py-3 pr-12 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-800/20 focus:border-orange-800 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-[2.55rem] text-stone-400 hover:text-stone-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative">
                  <label className="text-sm font-semibold text-stone-700 ml-1">Confirm Password</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="mt-2 w-full px-4 py-3 pr-12 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-800/20 focus:border-orange-800 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-[2.55rem] text-stone-400 hover:text-stone-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSaveNewPassword}
                  disabled={isResettingPassword}
                  className="w-full bg-stone-900 hover:bg-orange-800 disabled:bg-stone-400 text-white py-3.5 rounded-2xl font-bold transition-all"
                >
                  {isResettingPassword ? "Saving..." : "Save New Password"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
