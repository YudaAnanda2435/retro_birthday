"use client";

import React, { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function BackgroundMusic({ children }) {
  const audioRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    // Inisialisasi audio player saat pertama kali komponen dimuat
    if (!audioRef.current) {
      audioRef.current = new Audio("/music/lagu_latar.mp3");
      audioRef.current.loop = true;
    }

    const audio = audioRef.current;

    // Fungsi untuk memulai musik, dipanggil setelah ada interaksi
    const playMusicOnClick = () => {
      if (pathname !== "/music") {
        audio.play().catch((error) => {
          console.log("Autoplay dicegah oleh browser:", error);
        });
      }
      // Hapus listener setelah klik pertama agar tidak menumpuk
      document.removeEventListener("click", playMusicOnClick);
    };

    // Pasang listener untuk menunggu interaksi pertama dari pengguna
    document.addEventListener("click", playMusicOnClick);

    // Logika untuk play/pause saat pindah halaman
    if (pathname === "/music") {
      audio.pause();
    } else {
      // Coba putar musik saat pindah halaman, mungkin gagal jika belum ada interaksi
      if (audio.paused) {
        audio.play().catch((error) => {
          console.log("Autoplay saat pindah rute dicegah:", error);
        });
      }
    }

    // Cleanup: Hapus event listener saat komponen unmount
    return () => {
      document.removeEventListener("click", playMusicOnClick);
    };
  }, [pathname]); // Jalankan efek ini setiap kali URL (pathname) berubah

  return <>{children}</>;
}
