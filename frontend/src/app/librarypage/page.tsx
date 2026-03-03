"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter } from "lucide-react";
import UserNavbar from "@/components/UserNavbar";
import BookDetailModal from "@/components/BookDetailModal";
import SuccessModal from "@/components/SuccessModal";

export default function LibraryPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // --- STATE BUKU ---
  const [allBooks, setAllBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch books
  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books");
      const data = await response.json();

      const formattedBooks = data.map((b: any) => ({
        id: b.id,
        title: b.title,
        author: b.author_name || "Unknown",
        category: b.category_name || "Uncategorized",
        year: b.year || "N/A",
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

  // Filter options
  const categories = ["All Categories", "Fiction", "Science", "Education"];


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
  const handleBorrowBook = async () => {
    if (!user || !selectedBook) {
      console.log("Borrow failed: User or Book not selected", { user, selectedBook });
      return;
    }

    const payload = {
      user_id: user.id,
      book_ids: [selectedBook.id]
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Gagal meminjam buku");
      }

      setSelectedBook(null);
      setTimeout(() => setShowSuccessModal(true), 150);
      fetchBooks();
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Proteksi Halaman & Load User
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.replace("/login");
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <UserNavbar user={user} setUser={setUser} />

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

              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-stone-100 rounded-[2rem] shadow-2xl z-20 p-6 animate-in fade-in zoom-in-95 duration-200">
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
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

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
                          <option key={year} value={year}>{year}</option>
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
                <h3 className="font-bold text-stone-800 group-hover:text-orange-800 transition-colors leading-tight line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-xs text-stone-500 font-medium line-clamp-1">
                  {book.author}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-stone-400 italic">
              Books not found with those criteria.
            </div>
          )}
        </div>
      </main>

      <BookDetailModal 
        selectedBook={selectedBook} 
        setSelectedBook={setSelectedBook} 
        handleBorrowBook={handleBorrowBook} 
      />
      <SuccessModal 
        showSuccessModal={showSuccessModal} 
        setShowSuccessModal={setShowSuccessModal} 
      />
    </div>
  );
}
