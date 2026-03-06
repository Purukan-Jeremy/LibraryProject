"use client";

import React from "react";
import { toast } from "sonner";
import { Book, X, Building2, Barcode, BookOpen, CheckCircle2, Heart } from "lucide-react";

interface BookDetailModalProps {
  selectedBook: any;
  setSelectedBook: React.Dispatch<React.SetStateAction<any>>;
  handleBorrowBook?: () => void;
  isAdmin?: boolean;
}

export default function BookDetailModal({ selectedBook, setSelectedBook, handleBorrowBook, isAdmin = false }: BookDetailModalProps) {
  if (!selectedBook) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setSelectedBook(null)}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={() => setSelectedBook(null)}
          className="absolute top-6 right-6 z-10 p-2 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-stone-600" />
        </button>

        {/* Left: Cover & Visual */}
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

        {/* Right: Information Details */}
        <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto">
          <div className="mb-6">
            <div className="flex gap-2 mb-3">
              {isAdmin && (
                <span className="px-3 py-1 bg-stone-800 text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Admin View
                </span>
              )}
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {selectedBook.category}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${selectedBook.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {selectedBook.stock > 0 ? "Available" : "Out of Stock"}
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
                <Building2 className="w-3 h-3" /> Publisher
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
                <Barcode className="w-3 h-3" /> ISBN
              </p>
              <p className="text-sm font-bold text-stone-800 font-mono tracking-tight">
                {selectedBook.isbn}
              </p>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <p className="text-[10px] font-black uppercase text-stone-400 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3 h-3" /> Book Stock
              </p>
              <p className="text-sm font-bold text-stone-800">
                {selectedBook.stock} Copies
              </p>
            </div>
          </div>

          {/* Synopsis */}
          <div className="mb-8">
            <h3 className="font-bold text-stone-900 mb-2">Synopsis</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              {selectedBook.synopsis}
            </p>
          </div>

          {/* Action Buttons */}
          {!isAdmin && (
            <div className="flex gap-4 border-t border-stone-100 pt-8">
              <button
                className="flex-1 bg-stone-900 hover:bg-orange-800 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleBorrowBook}
                disabled={selectedBook.stock === 0}
              >
                <CheckCircle2 className="w-5 h-5" />
                {selectedBook.stock > 0 ? "Borrow This Book" : "Out of Stock"}
              </button>
              <button
                className="px-6 py-4 bg-stone-100 text-stone-500 hover:bg-red-50 hover:text-red-500 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group"
                onClick={() => toast.info("Added to favorites")}
              >
                <Heart className="w-5 h-5 group-hover:fill-current" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
