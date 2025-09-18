"use client"; // Diperlukan karena menggunakan useState dan useEffect

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function MessagePage() {
  // State untuk menyimpan teks yang sedang ditampilkan di layar
  const [displayedText, setDisplayedText] = useState("");

  // State untuk menandai apakah animasi mengetik sudah selesai atau di-skip
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Pesan lengkap yang akan ditampilkan
  const fullMessage = `Hai Cel, 

Happy Birthday!

Hari ini aku pengen kamu ngerasain semua hal positif dan keajaiban yang cuma bisa didapetin kalo kamu ada di dunia ini. Semoga segala keinginanmu tercapai, apalagi yang kocak-kocak dan gak biasa, karena kamu tuh unik banget! Aku selalu bersyukur bisa ngeliat kamu jadi versi terbaik dari dirimu, yang kadang-kadang lucu banget pas lagi baper, tapi juga selalu bikin aku tersenyum tanpa henti.

Makasih udah jadi temen curhat, partner in crime, dan sumber inspirasi sehari-hari. Semoga tahun ini kamu makin kece, makin banyak momen bahagia, dan makin dicintai, karena kamu emang pantas dapetin semua itu. Jangan lupa, kita bakal terus jalan bareng, ngejar mimpi, dan ngelewatin segala drama hidup dengan tawa.

I love you <3`;

  // useEffect untuk menangani logika animasi mengetik
  useEffect(() => {
    // Jika animasi sudah selesai (misalnya karena tombol SKIP ditekan)
    if (isTypingComplete) {
      setDisplayedText(fullMessage);
      return; // Hentikan proses
    }

    // Jika animasi belum selesai, mulai proses mengetik
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex < fullMessage.length) {
        // Tambahkan satu karakter ke teks yang ditampilkan
        setDisplayedText(
          (prevText) => prevText + fullMessage.charAt(currentIndex)
        );
        currentIndex++;
      } else {
        // Jika sudah selesai, hentikan interval dan tandai sebagai selesai
        clearInterval(intervalId);
        setIsTypingComplete(true);
      }
    }, 50); // Kecepatan mengetik: 50 milidetik per karakter

    // Fungsi cleanup: akan dijalankan jika komponen di-unmount
    // untuk mencegah memory leak
    return () => clearInterval(intervalId);
  }, [isTypingComplete, fullMessage]); // Efek ini akan berjalan lagi jika isTypingComplete berubah

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 p-2 sm:p-4 flex items-center justify-center">
      <div className="w-full max-w-[360px] sm:max-w-md mx-auto bg-gray-900 border-4 border-yellow-300 rounded-xl overflow-hidden shadow-2xl p-3 sm:p-6">
        {/* Layar Retro tempat pesan ditampilkan */}
        <div className="retro-screen bg-black rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 h-[70vh] sm:h-96 overflow-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-center text-green-400 mb-2 sm:mb-4 retro-text">
            Message
          </h1>
          {/* Tag <pre> digunakan agar format paragraf (enter) tetap terjaga */}
          <pre className="whitespace-pre-wrap text-green-400 font-mono text-xs sm:text-sm leading-relaxed text-justify">
            {displayedText || "Loading message..."}
          </pre>

          {/* Tombol SKIP hanya muncul jika animasi belum selesai */}
          {!isTypingComplete && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setIsTypingComplete(true)}
                className="bg-blue-500 px-4 py-2 rounded-lg text-white retro-text text-xs"
              >
                SKIP
              </button>
            </div>
          )}
        </div>

        {/* Tombol Navigasi */}
        <Link
          href="/galery"
          className="block w-full bg-green-500 text-white font-bold py-2 sm:py-3 px-4 rounded-lg text-center hover:bg-green-600 transition-colors retro-button mb-2 sm:mb-4 text-sm sm:text-base"
        >
          SELANJUTNYA
        </Link>
        <Link
          href="/"
          className="block w-full bg-red-500 text-white font-bold py-2 sm:py-3 px-4 rounded-lg text-center hover:bg-red-600 transition-colors retro-button text-sm sm:text-base"
        >
          KEMBALI
        </Link>
      </div>
    </div>
  );
}
