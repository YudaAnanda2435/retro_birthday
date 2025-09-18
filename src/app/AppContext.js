"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { usePathname } from "next/navigation";

// 1. Membuat Context
const AppContext = createContext();

// 2. Membuat Provider (Penyedia data)
export function AppProvider({ children }) {
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const pathname = usePathname();

  // Efek ini untuk menentukan apakah loading screen perlu tampil atau tidak
  useEffect(() => {
    // Jika bukan di halaman utama ('/'), jangan tampilkan loading screen
    if (pathname !== "/") {
      setShowLoadingScreen(false);
      return;
    }

    // Cek sessionStorage untuk melihat apakah pengguna sedang bernavigasi
    // Jika ya, jangan tampilkan loading screen. Jika tidak (kunjungan pertama), tampilkan.
    if (sessionStorage.getItem("isNavigatingInApp") === "true") {
      setShowLoadingScreen(false);
    } else {
      setShowLoadingScreen(true);
    }

    // Hapus penanda agar saat refresh tidak dianggap navigasi
    sessionStorage.removeItem("isNavigatingInApp");
  }, [pathname]);

  // Efek ini "membajak" fungsi navigasi browser untuk menandai
  // bahwa pengguna sedang berpindah halaman di dalam aplikasi.
  useEffect(() => {
    const handleNavigation = () => {
      sessionStorage.setItem("isNavigatingInApp", "true");
    };

    const originalPushState = window.history.pushState;

    // Ganti fungsi pushState bawaan dengan versi kita
    window.history.pushState = function (...args) {
      handleNavigation();
      // Jalankan fungsi pushState yang asli
      return originalPushState.apply(this, args);
    };

    // Kembalikan fungsi pushState ke versi aslinya saat komponen dibongkar
    return () => {
      window.history.pushState = originalPushState;
    };
  }, []);

  const value = {
    showLoadingScreen,
    completeLoading: () => setShowLoadingScreen(false),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// 3. Membuat Custom Hook (untuk menggunakan data)
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
