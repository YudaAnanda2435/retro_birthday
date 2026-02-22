"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import PhotoItem from "@/components/PhotoItem";

// Data untuk galeri, aslinya variabel 'g'
const mediaItems = [
  { type: "image", src: "/img/gallery/foto1.jpg", alt: "#1" },
  { type: "image", src: "/img/gallery/foto2.jpg", alt: "#2" },
  { type: "image", src: "/img/gallery/foto3.jpg", alt: "#3" },
  { type: "image", src: "/img/gallery/foto4.jpg", alt: "#4" },
  { type: "video", src: "/img/gallery/video.mp4", alt: "Clip Dump" },
];

export default function GalleryPage() {
  // Mengganti nama variabel e, s, o, c menjadi lebih deskriptif
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Mengganti nama ref f, m
  const scrollContainerRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Fungsi untuk memulai proses "cetak", aslinya variabel 'u'
  const startPrintingProcess = () => {
    setCurrentIndex(-1);
    setProgress(0);
    setIsPrinting(true);
    setTimeout(() => {
      printNextItem(0);
    }, 1000); // 1e3 = 1000ms
  };

  // Fungsi rekursif untuk "mencetak" item berikutnya, aslinya variabel 'h'
  const printNextItem = (index) => {
    if (index >= mediaItems.length) {
      setIsPrinting(false);
      return;
    }

    setCurrentIndex(index);
    setProgress(0);

    let startTime = null;
    const animateProgress = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;

      if (elapsedTime < 2500) {
        // Durasi animasi 2.5 detik
        setProgress(Math.min(100, (elapsedTime / 2500) * 100));
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop =
            scrollContainerRef.current.scrollHeight;
        }
        animationFrameRef.current = requestAnimationFrame(animateProgress);
      } else {
        setProgress(100);
        if (index === mediaItems.length - 1) {
          // Jika item terakhir selesai
          setTimeout(() => {
            setIsPrinting(false);
            if (mediaItems[index].type === "video") {
              setShowVideoModal(true);
            }
          }, 1000);
        } else {
          // Lanjut ke item berikutnya setelah jeda 1 detik
          setTimeout(() => {
            printNextItem(index + 1);
          }, 1000);
        }
      }
    };
    animationFrameRef.current = requestAnimationFrame(animateProgress);
  };

  // Membersihkan sisa animasi jika komponen di-unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleResetAndPrint = () => {
    setShowVideoModal(false);
    setCurrentIndex(-1);
    setProgress(0);
    setIsPrinting(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setTimeout(startPrintingProcess, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 p-4 relative">
      <div className="max-w-md mx-auto bg-gray-800 border-4 border-yellow-300 rounded-xl overflow-hidden shadow-2xl p-6 relative">
        <div className="retro-screen bg-black rounded-lg p-4 mb-6">
          <h1 className="text-2xl font-bold text-center text-green-400 mb-2 retro-text">
            Gallery
          </h1>

          {/* Header Photobox */}
          <div className="relative w-full h-12 bg-gray-700 rounded-t-lg flex items-center justify-between px-4 mb-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isPrinting ? "bg-red-500 animate-pulse" : "bg-red-800"
              }`}
            ></div>
            <div className="font-bold text-yellow-300 text-xs tracking-widest">
              Effort.Dong PHOTOBOX
            </div>
            <div
              className={`w-3 h-3 rounded-full ${
                !isPrinting && currentIndex >= 0
                  ? "bg-green-500"
                  : "bg-green-800"
              }`}
            ></div>
          </div>

          {/* Slot "kertas foto" */}
          <div className="relative w-full h-10 bg-gray-600 mb-2 overflow-hidden flex justify-center items-center">
            <div className="w-4/5 h-2 bg-black"></div>
            {isPrinting && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-4/5 h-3 bg-white animate-pulse"></div>
            )}
          </div>

          {/* Area Konten Utama */}
          <div className="bg-gray-800 rounded-lg p-2 border-2 border-gray-700 min-h-[400px] flex flex-col items-center justify-start relative">
            {/* Tampilan Awal */}
            {currentIndex === -1 && !isPrinting && (
              <div className="absolute inset-0 bg-gray-900 rounded flex flex-col items-center justify-center">
                <p className="text-gray-500 text-sm mb-6">
                  Photobox siap digunakan
                </p>
                <button
                  onClick={startPrintingProcess}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs py-2 px-4 rounded-lg retro-text transition-colors animate-pulse"
                >
                  MULAI CETAK
                </button>
              </div>
            )}

            {/* Tampilan Saat Loading Awal */}
            {currentIndex === -1 && isPrinting && (
              <div className="absolute inset-0 bg-gray-900 rounded flex items-center justify-center">
                <p className="text-gray-500 text-sm animate-pulse">
                  Mempersiapkan photobox...
                </p>
              </div>
            )}

            {/* Container untuk hasil "cetak" */}
            <div
              ref={scrollContainerRef}
              style={{ display: currentIndex >= 0 ? "block" : "none" }}
              className="w-full h-full overflow-y-auto hide-scrollbar"
            >
              <div className="flex flex-col items-center py-4 space-y-4">
                {/* Foto yang sudah selesai */}
                {Array.from({ length: currentIndex }).map((_, index) => (
                  <div key={index} className="w-4/5">
                    <PhotoItem photo={mediaItems[index]} index={index} />
                  </div>
                ))}

                {/* Foto yang sedang diproses */}
                {currentIndex >= 0 && currentIndex < mediaItems.length && (
                  <div className="w-4/5 relative overflow-hidden">
                    <div
                      style={{ clipPath: `inset(0 0 ${100 - progress}% 0)` }}
                      className="relative"
                    >
                      <PhotoItem
                        photo={mediaItems[currentIndex]}
                        index={currentIndex}
                        isActive={true}
                        onClick={() => {
                          if (
                            mediaItems[currentIndex].type === "video" &&
                            progress === 100
                          ) {
                            setShowVideoModal(true);
                          }
                        }}
                      />
                    </div>
                    {/* Progress Bar Animasi */}
                    {progress < 100 && (
                      <div
                        style={{
                          top: `${progress}%`,
                          transform: "translateY(-50%)",
                          boxShadow: "0 0 10px rgba(255,0,0,0.7)",
                        }}
                        className="absolute w-full h-3 bg-red-500 opacity-50"
                      ></div>
                    )}
                  </div>
                )}

                {/* Status Teks */}
                {isPrinting && currentIndex >= 0 && (
                  <div className="w-4/5 text-center mt-2">
                    <p className="text-yellow-300 text-xs animate-pulse">
                      Mencetak foto {currentIndex + 1} dari{" "}
                      {mediaItems.length - 1}... ({Math.round(progress)}%)
                    </p>
                  </div>
                )}

                {/* Tombol Cetak Ulang */}
                {currentIndex === mediaItems.length - 1 &&
                  progress === 100 &&
                  !isPrinting &&
                  !showVideoModal && (
                    <div className="w-4/5">
                      <button
                        onClick={handleResetAndPrint}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 w-full rounded-lg retro-text transition-colors"
                      >
                        CETAK ULANG
                      </button>
                    </div>
                  )}
              </div>
            </div>

            {/* Modal untuk Video */}
            {showVideoModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
                <div className="relative">
                  <button
                    onClick={() => setShowVideoModal(false)}
                    className="absolute -top-10 right-0 text-white text-xl bg-red-600 w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    &times;
                  </button>
                  <div className="bg-black rounded-lg shadow-2xl border-4 border-yellow-300 overflow-hidden flex flex-col">
                    <div className="p-2 bg-gray-800 text-yellow-300 text-center text-sm retro-text">
                      {mediaItems.find((item) => item.type === "video")?.alt}
                    </div>
                    <div className="w-[280px] md:w-[320px] bg-black">
                      <video controls autoPlay playsInline className="w-full">
                        <source
                          src={
                            mediaItems.find((item) => item.type === "video")
                              ?.src
                          }
                          type="video/mp4"
                        />
                        Browser Anda tidak mendukung pemutaran video.
                      </video>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Photobox */}
          <div className="relative w-full h-12 bg-gray-700 rounded-b-lg flex items-center justify-center gap-4 mt-2">
            <div className="w-12 h-5 rounded-full bg-gray-800"></div>
            <div className="w-12 h-5 rounded-full bg-gray-800"></div>
          </div>
        </div>

        {/* Tombol Navigasi */}
        <Link
          href="/music"
          className="block w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg text-center hover:bg-green-600 transition-colors retro-button mb-4"
        >
          SELANJUTNYA
        </Link>
        <Link
          href="/"
          className="block w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg text-center hover:bg-red-600 transition-colors retro-button"
        >
          KEMBALI
        </Link>
      </div>
    </div>
  );
}
