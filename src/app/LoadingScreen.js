"use client";

import React, { useState, useEffect, useRef } from "react";

export default function LoadingScreen({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("BOOTING...");
  const intervalRef = useRef(null);

  // Fungsi untuk mengubah teks status berdasarkan progres
  const updateStatusText = (currentProgress) => {
    if (currentProgress < 20) {
      setStatusText("BOOTING SYSTEM...");
    } else if (currentProgress < 40) {
      setStatusText("INITIALIZING...");
    } else if (currentProgress < 60) {
      setStatusText("LOADING GAME DATA...");
    } else if (currentProgress < 80) {
      setStatusText("PREPARING BIRTHDAY SURPRISE...");
    } else {
      setStatusText("READY!");
    }
  };

  // Efek untuk menjalankan interval animasi loading
  useEffect(() => {
    let currentProgress = 0;
    intervalRef.current = setInterval(() => {
      currentProgress += 2;
      setProgress(currentProgress);
      updateStatusText(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(intervalRef.current);
        setTimeout(() => {
          // Panggil fungsi onLoadingComplete dari parent
          if (onLoadingComplete) {
            onLoadingComplete();
          }
          // Kirim event global bahwa loading telah selesai
          window.dispatchEvent(new Event("loadingComplete"));
        }, 800);
      }
    }, 150);

    // Fungsi cleanup untuk membereskan interval jika komponen di-unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-6">
        <div className="border-4 border-green-500 rounded-lg p-6 bg-black">
          <h2 className="text-green-400 text-xl mb-4 font-bold retro-text text-center">
            Effort.Dong
          </h2>
          <div className="mb-4 font-mono text-green-400 flex items-center">
            <span className="mr-2">&gt;</span>
            <span>{statusText}</span>
            <span className="animate-pulse ml-1">_</span>
          </div>
          <div className="w-full bg-gray-900 h-6 rounded-lg overflow-hidden border border-green-800 mb-2">
            <div
              className="h-full bg-green-500 transition-all duration-300 flex items-center justify-end px-2"
              style={{ width: `${progress}%` }}
            >
              <span className="text-black text-xs font-bold">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <p className="text-yellow-400 text-xs text-center mt-4 retro-text animate-pulse">
            SMILE!
          </p>
        </div>
      </div>
    </div>
  );
}
