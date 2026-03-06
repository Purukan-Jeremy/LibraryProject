"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
  showSuccessModal: boolean;
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SuccessModal({ showSuccessModal, setShowSuccessModal }: SuccessModalProps) {
  if (!showSuccessModal) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Transparent Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
        onClick={() => setShowSuccessModal(false)}
      />

      <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center relative z-10 animate-in zoom-in duration-300 shadow-2xl">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">
          Successfully Borrowed!
        </h3>
        <p className="text-stone-500 text-sm mb-8 leading-relaxed">
          The book has been successfully added to your loan list. Happy reading!
        </p>
        <button
          onClick={() => setShowSuccessModal(false)}
          className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-orange-800 transition-all shadow-lg active:scale-95"
        >
          Okay, Understood
        </button>
      </div>
    </div>
  );
}
