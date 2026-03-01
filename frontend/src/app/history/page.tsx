"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  BookOpen,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function LoanHistoryPage() {
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Data Dummy untuk simulasi tampilan
  const loanData = [
    {
      id: 1,
      title: "Laskar Pelangi",
      date: "10 Feb 2026",
      status: "RETURNED",
      quantity: 1,
      color: "bg-green-50 text-green-700",
    },
    {
      id: 2,
      title: "Filosofi Teras",
      date: "25 Feb 2026",
      status: "BORROWED",
      quantity: 1,
      color: "bg-orange-50 text-orange-700",
    },
    {
      id: 3,
      title: "Bumi",
      date: "01 Mar 2026",
      status: "BORROWED",
      quantity: 1,
      color: "bg-orange-50 text-orange-700",
    },
  ];

  // Logika Filtering
  const filteredLoans = loanData.filter((loan) => {
    const matchStatus = filterStatus === "ALL" || loan.status === filterStatus;
    const matchSearch = loan.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#fafaf9] p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Tombol Kembali */}
        <Link
          href="/librarypage"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-orange-800 transition-colors mb-8 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Kembali ke Perpustakaan</span>
        </Link>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">
              Riwayat Peminjaman
            </h1>
            <p className="text-stone-500">
              Pantau aktivitas membaca dan status buku Anda.
            </p>
          </div>

          {/* Pencarian & Filter Cepat */}
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Cari judul buku..."
                className="pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-sm focus:ring-2 focus:ring-orange-800/10 outline-none w-64"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Tab Filter Status */}
        <div className="flex gap-2 mb-8 bg-stone-100/50 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setFilterStatus("ALL")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filterStatus === "ALL" ? "bg-white text-orange-800 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterStatus("BORROWED")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filterStatus === "BORROWED" ? "bg-white text-orange-800 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
          >
            Dipinjam
          </button>
          <button
            onClick={() => setFilterStatus("RETURNED")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filterStatus === "RETURNED" ? "bg-white text-orange-800 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
          >
            Dikembalikan
          </button>
        </div>

        {/* Daftar Riwayat */}
        <div className="grid gap-4">
          {filteredLoans.length > 0 ? (
            filteredLoans.map((loan) => (
              <div
                key={loan.id}
                className="group bg-white border border-stone-100 p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-300"
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`p-4 rounded-2xl ${loan.status === "RETURNED" ? "bg-stone-50" : "bg-orange-50"}`}
                  >
                    <BookOpen
                      className={`w-6 h-6 ${loan.status === "RETURNED" ? "text-stone-400" : "text-orange-800"}`}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">
                      {loan.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-stone-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> {loan.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> Durasi: 7 Hari
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Jumlah:{" "}
                        {loan.quantity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex items-center gap-6">
                  <span
                    className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${loan.color}`}
                  >
                    {loan.status === "BORROWED" ? (
                      <span className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" /> Sedang Dipinjam
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Sudah Kembali
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-stone-200">
              <div className="bg-stone-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-stone-300 w-8 h-8" />
              </div>
              <p className="text-stone-400 font-medium">
                Tidak ada riwayat yang ditemukan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
