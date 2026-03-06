"use client";

import React, { useState } from "react";
import { Search, Filter, Book } from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import BookDetailModal from "@/components/BookDetailModal";
import withLibrarianAuth from "@/components/withLibrarianAuth";

function AdminLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // --- STATE BUKU ---
  const [allBooks, setAllBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>(["Semua Kategori"]);

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

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/categories");
      const data = await response.json();
      const catNames = data.map((c: any) => c.category_name);
      setCategories(["Semua Kategori", ...catNames]);
    } catch (error) {
      console.error("Gagal mengambil categories:", error);
    }
  };

  React.useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");

  const filteredBooks = allBooks.filter((book) => {
    const matchCategory =
      selectedCategory === "Semua Kategori" ||
      book.category === selectedCategory;

    const matchSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold text-stone-900">
              Katalog Buku
            </h1>
            <p className="text-stone-500 mt-1">
              Admin Mode: Pantau koleksi buku perpustakaan
            </p>
          </div>

          <div className="flex items-center gap-4 relative">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-orange-800 transition-colors" />
              <input
                type="text"
                placeholder="Cari judul atau penulis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white border border-stone-200 rounded-2xl w-full md:w-80 outline-none focus:ring-4 focus:ring-orange-800/5 focus:border-orange-800/20 transition-all shadow-sm"
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
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsFilterOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-stone-100 rounded-[2rem] shadow-2xl z-20 p-6 animate-in fade-in zoom-in-95 duration-200">
                    <div className="mb-4">
                      <label className="text-[10px] font-black uppercase text-stone-400 ml-1 mb-2 block">
                        Kategori
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

                    <button
                      onClick={() => setSelectedCategory("Semua Kategori")}
                      className="w-full py-2 text-[10px] font-bold text-orange-800 uppercase hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      Reset Filter
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* GRID BUKU */}
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
                <h3 className="font-bold text-stone-800 group-hover:text-orange-800 transition-colors leading-tight">
                  {book.title}
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  {book.author}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-stone-400 italic">
              Buku tidak ditemukan dengan kriteria tersebut.
            </div>
          )}
        </div>
      </main>

      <BookDetailModal 
        selectedBook={selectedBook}
        setSelectedBook={setSelectedBook}
        isAdmin={true}
      />
    </div>
  );
}

export default withLibrarianAuth(AdminLibraryPage);
