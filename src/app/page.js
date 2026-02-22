"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppContext } from "@/app/AppContext"; // Sesuaikan path ke file context Anda
import LoadingScreen from "@/app/LoadingScreen"; // Sesuaikan path ke komponen LoadingScreen

export default function TetrisPage() {
  // Mengambil state dan fungsi dari context global
  const { showLoadingScreen, completeLoading } = useAppContext();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Relaxing.jpg"
          alt="Background"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          // quality={100}
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Menampilkan Loading Screen secara kondisional */}
      {showLoadingScreen && (
        <LoadingScreen onLoadingComplete={completeLoading} />
      )}

      {/* Konten Utama (Konsol Game Boy) */}
      <div className="relative z-10 w-full max-w-[320px] sm:max-w-md mx-auto">
        <div className="bg-gray-300 rounded-[30px] p-3 sm:p-5 pt-6 sm:pt-8 pb-12 sm:pb-16 shadow-xl border-4 border-gray-400">
          <div className="flex items-center">
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-red-500 mr-0.5 sm:mr-1"></div>
            <span className="text-[6px] sm:text-[10px] text-gray-700 font-semibold">
              Power
            </span>
          </div>
          {/* Layar Game */}
          <div className="bg-gray-800 rounded-lg p-2 sm:p-3 mb-4 sm:mb-8 mt-2 sm:mt-3">
            <div className="retro-screen bg-black rounded-lg p-2 sm:p-4 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-center text-green-400 mb-0.5 sm:mb-2 retro-text">
                Happy Birthday!
              </h1>
              <p className="text-sm sm:text-base text-yellow-300 text-center retro-text whitespace-nowrap">
                Press Start Button
              </p>
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[6px] sm:text-[8px] text-gray-500 font-bold">
                DOT MATRIX WITH STEREO SOUND
              </span>
              <div className="flex items-center">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-red-500 mr-0.5 sm:mr-1"></div>
                <span className="text-[6px] sm:text-[8px] text-gray-500">
                  BATTERY
                </span>
              </div>
            </div>
          </div>

          {/* Tombol-tombol Navigasi */}
          <div className="col-span-2 grid grid-cols-2 gap-2 sm:gap-4 mb-7">
            <Link
              href="/message"
              className="retro-button bg-blue-500 text-white font-bold py-2 sm:py-3 px-2 sm:px-4 rounded-lg text-center hover:bg-blue-600 transition-colors text-xs sm:text-base"
            >
              Message
            </Link>
            <Link
              href="/galery"
              className="retro-button bg-red-500 text-white font-bold py-2 sm:py-3 px-2 sm:px-4 rounded-lg text-center hover:bg-red-600 transition-colors text-xs sm:text-base"
            >
              Gallery
            </Link>
            <Link
              href="/music"
              className="retro-button bg-purple-500 text-white font-bold py-2 sm:py-3 px-2 sm:px-4 rounded-lg text-center hover:bg-purple-600 transition-colors text-xs sm:text-base"
            >
              Music
            </Link>
            <Link
              href="/tetris"
              className="retro-button bg-green-500 text-white font-bold py-2 sm:py-3 px-2 sm:px-4 rounded-lg text-center hover:bg-green-600 transition-colors text-xs sm:text-base"
            >
              Tetris
            </Link>
          </div>
          {/* Kontainer untuk D-pad dan Tombol A/B */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 px-2 sm:px-4">
            {/* D-Pad (Tombol Arah) */}
            <div className="relative w-24 h-24">
              {" "}
              {/* Kontainer D-Pad */}
              {/* Batang Vertikal */}
              <div className="absolute left-1/3 top-0 -translate-x-[26] w-8 h-full bg-gray-900 rounded-sm"></div>
              {/* Batang Horizontal */}
              <div className="absolute top-[60%] left-0 -translate-y-1/2 h-8 w-full bg-gray-900 rounded-sm"></div>
              {/* Tombol Arah Individual (untuk event klik di masa depan) */}
              <div className="absolute top-0 left-1/3 -translate-x-[26] w-8 h-8 flex items-center justify-center text-gray-400">
                ↑
              </div>
              <div className="absolute bottom-0 left-1/3 -translate-x-[26] w-8 h-8 flex items-center justify-center text-gray-400">
                ↓
              </div>
              <div className="absolute left-0 top-[60%] -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400">
                ←
              </div>
              <div className="absolute right-0 top-[60%] -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400">
                →
              </div>
            </div>

            {/* Tombol A & B */}
            <div className="flex items-center justify-end space-x-2 sm:space-x-4">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-xs font-bold text-white">B</span>
              </div>
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-xs font-bold text-white">A</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center mt-8 space-x-3 sm:space-x-4">
            <div className="w-10 sm:w-12 h-3 sm:h-4 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-[6px] sm:text-[8px] text-gray-400">
                SELECT
              </span>
            </div>
            <Link
              href="/message"
              className="w-10 sm:w-12 h-3 sm:h-4 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <span className="text-[6px] sm:text-[8px] text-gray-400">
                START
              </span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
