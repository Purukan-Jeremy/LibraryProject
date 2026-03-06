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
  const [loanData, setLoanData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch loans
  const fetchLoans = async () => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return;
    
    const user = JSON.parse(savedUser);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/${user.id}/loans`);
      const data = await response.json();
      setLoanData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal mengambil riwayat pinjaman:", error);
      setLoanData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleReturnBook = async (loanId: number) => {
    const confirmReturn = window.confirm("Are you sure you want to return this book?");
    if (!confirmReturn) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/loans/${loanId}/return`, {
        method: "POST"
      });

      if (!response.ok) {
        throw new Error("Failed to return book");
      }

      alert("Book returned successfully! It has been removed from your history.");
      fetchLoans();
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Filtering
  const filteredLoans = Array.isArray(loanData) ? loanData.filter((loan) => {
    const matchStatus = filterStatus === "ALL" || loan.status === filterStatus;
    
    const matchSearch = loan.books?.some((book: any) => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || false;
    
    return matchStatus && matchSearch;
  }) : [];

  return (
    <div className="min-h-screen bg-[#fafaf9] p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          href="/librarypage"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-orange-800 transition-colors mb-8 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Back to Library</span>
        </Link>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">
              Loan History
            </h1>
            <p className="text-stone-500">
              Monitor your reading activity and book status.
            </p>
          </div>

          {/* Search & Quick Filter */}
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search book title..."
                className="pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-sm focus:ring-2 focus:ring-orange-800/10 outline-none w-64"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-8 bg-stone-100/50 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setFilterStatus("ALL")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filterStatus === "ALL" ? "bg-white text-orange-800 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
          >
            All History
          </button>
        </div>

        {/* History List */}
        <div className="grid gap-4">
          {loading ? (
             <div className="text-center py-20 text-stone-400">Loading history...</div>
          ) : filteredLoans.length > 0 ? (
            filteredLoans.map((loan) => (
              <div
                key={loan.id}
                className="group bg-white border border-stone-100 p-6 rounded-[2rem] flex flex-col gap-4 hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-300"
              >
                {loan.books.map((book: any, idx: number) => (
                  <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between">
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
                          {book.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-stone-400">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" /> {loan.loan_date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" /> Duration: 7 Days
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> Quantity: {book.quantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex items-center gap-6">
                      <span
                        className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${loan.status === "BORROWED" ? "bg-orange-50 text-orange-700" : "bg-green-50 text-green-700"}`}
                      >
                        {loan.status === "BORROWED" ? (
                          <span className="flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" /> Currently Borrowed
                          </span>
                      ) : (
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Returned
                          </span>
                        )}
                      </span>

                      {loan.status === "BORROWED" && (
                        <button
                          onClick={() => handleReturnBook(loan.id)}
                          className="px-6 py-2 bg-stone-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-orange-800 transition-all active:scale-95 shadow-lg shadow-stone-900/10"
                        >
                          Return Book
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-stone-200">
              <div className="bg-stone-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-stone-300 w-8 h-8" />
              </div>
              <p className="text-stone-400 font-medium">
                No history found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
