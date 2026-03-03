"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Lock, Home } from "lucide-react";
import Link from "next/link";

export default function withLibrarianAuth(Component: React.ComponentType<any>) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
      const checkAuth = () => {
        const isLibrarian = sessionStorage.getItem("isLibrarian");
        if (isLibrarian === "true") {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      };

      checkAuth();
    }, [router]);

    // Show nothing while checking
    if (isAuthorized === null) {
      return (
        <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 bg-stone-200 rounded-full mb-4"></div>
            <div className="h-4 w-24 bg-stone-200 rounded"></div>
          </div>
        </div>
      );
    }

    // Access Denied UI
    if (isAuthorized === false) {
      return (
        <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center px-6">
          <div className="w-full max-w-md text-center">
            <div className="inline-flex p-6 bg-red-50 text-red-600 rounded-[2.5rem] mb-8 shadow-xl shadow-red-900/5 ring-1 ring-red-100 animate-bounce">
              <ShieldAlert className="w-12 h-12" />
            </div>
            
            <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4">
              Access Denied
            </h1>
            <p className="text-stone-500 mb-10 leading-relaxed font-medium">
              You are trying to access a restricted area. Only authorized librarians with the master code can enter this dashboard.
            </p>

            <div className="grid gap-3">
              <Link 
                href="/librarian-auth"
                className="flex items-center justify-center gap-2 bg-stone-900 hover:bg-orange-800 text-white py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
              >
                <Lock className="w-4 h-4" /> Enter Access Code
              </Link>
              
              <Link 
                href="/"
                className="flex items-center justify-center gap-2 text-stone-500 hover:text-stone-800 py-4 rounded-2xl font-bold transition-all"
              >
                <Home className="w-4 h-4" /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Authorized
    return <Component {...props} />;
  };
}
