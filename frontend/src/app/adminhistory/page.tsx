"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  ChevronDown,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import withLibrarianAuth from "@/components/withLibrarianAuth";

function AdminLoanHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedUser, setExpandedUser] = useState<number | null>(null);

  const [usersWithLoans, setUsersWithLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/admin/loans");
        const data = await res.json();
        const userMap = new Map();
        data.forEach((loan: any) => {
           if (!userMap.has(loan.user_id)) {
               userMap.set(loan.user_id, {
                   id: loan.user_id,
                   fullname: loan.fullname,
                   username: loan.username,
                   email: loan.email,
                   loans: []
               });
           }
           userMap.get(loan.user_id).loans.push({
               id: loan.id,
               title: loan.books.length > 0 ? loan.books[0].title : "Unknown",
               author: loan.books.length > 0 ? loan.books[0].author : "Unknown",
               date: loan.loan_date,
               status: loan.status,
               dueDate: "7 Days"
           });
        });
        
        setUsersWithLoans(Array.from(userMap.values()));
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-800 font-sans pb-20">
      <AdminNavbar />

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

        {/* User List */}
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
                {/*(User Info) */}
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

                {/*(Loan List) */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    expandedUser === user.id
                      ? "max-h-[1000px] border-t border-orange-50"
                      : "max-h-0"
                  }`}
                >
                  <div className="p-8 bg-stone-50/30">
                    <div className="space-y-4">
                      {user.loans.map((loan: any) => (
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
                                  <AlertCircle className="w-3.5 h-3.5" /> Active Loan
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
    </div>
  );
}

export default withLibrarianAuth(AdminLoanHistoryPage);
