"use client"; // Diperlukan karena menggunakan Hooks (useState, useEffect, useRef)

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Data playlist didefinisikan di luar komponen agar tidak dibuat ulang setiap render
const playlist = [
  {
    id: 1,
    title: "On Bended Knee",
    artist: "Boyz II Men",
    duration: "05:28",
    file: "/music/lagu1.mp3",
    cover: "/img/music/fotocover1.jpg",
  },
  {
    id: 2,
    title: "(Everything I Do) I Do It For You",
    artist: "Bryan Adams",
    duration: "06:32",
    file: "/music/lagu2.mp3",
    cover: "/img/music/fotocover2.jpg",
  },
  {
    id: 3,
    title: "Just the Two of Us",
    artist: "Bill Withers",
    duration: "07:18",
    file: "/music/lagu3.mp3",
    cover: "/img/music/fotocover3.jpg",
  },
  {
    id: 4,
    title: "Nothing's Gonna Change My Love For You",
    artist: "George Benson",
    duration: "03:52",
    file: "/music/lagu4.mp3",
    cover: "/img/music/fotocover4.jpg",
  },
  {
    id: 5,
    title: "How Deep Is Your Love",
    artist: "Bee Gees",
    duration: "03:58",
    file: "/music/lagu5.mp3",
    cover: "/img/music/fotocover5.jpg",
  },
];

export default function MusicPage() {
  // State management
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  // Refs untuk mengakses elemen DOM secara langsung
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // Mendapatkan data lagu yang sedang aktif
  const currentTrack = playlist[currentTrackIndex];

  // Efek untuk menangani pemutaran saat lagu atau status isPlaying berubah
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  // Efek untuk mengatur event listener pada elemen audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
      }
    };

    const setAudioDuration = () => {
      setTrackDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setAudioDuration);
    audio.volume = volume;

    // Cleanup function untuk menghapus event listener saat komponen unmount
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, [volume]); // Dependensi volume untuk memperbarui volume audio saat slider digerakkan

  // Handler untuk kontrol pemutar musik
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    const prevIndex =
      (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  };

  const handlePlaylistClick = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const handleProgressBarClick = (e) => {
    const progressBar = progressBarRef.current;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const newTime =
      (clickPosition / progressBar.offsetWidth) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress((newTime / audioRef.current.duration) * 100);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  // Fungsi utilitas untuk format waktu dari detik ke M:SS
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 p-2 sm:p-4 flex items-center justify-center">
      <div className="w-full max-w-[320px] sm:max-w-md mx-auto bg-gray-900 border-4 border-yellow-300 rounded-xl overflow-hidden shadow-2xl p-3 sm:p-6">
        <div className="retro-screen bg-black rounded-lg p-2 sm:p-4 mb-3 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-center text-green-400 mb-2 sm:mb-4 retro-text">
            Music Player
          </h1>

          {/* Player Display */}
          <div className="bg-gray-800 rounded-lg p-2 sm:p-3 mb-2 sm:mb-4 border-2 border-gray-700">
            <div className="relative w-full h-32 sm:h-40 mb-2 sm:mb-4 border-2 border-gray-600 overflow-hidden">
              <Image
                src={currentTrack.cover}
                alt={`${currentTrack.title} cover`}
                fill
                sizes="100%"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
            <div className="mb-2 sm:mb-4">
              <p className="text-center text-green-400 font-bold retro-text truncate text-sm sm:text-base">
                {currentTrack.title}
              </p>
              <p className="text-center text-yellow-300 text-xs sm:text-sm retro-text truncate">
                {currentTrack.artist}
              </p>
            </div>
            <div
              ref={progressBarRef}
              onClick={handleProgressBarClick}
              className="h-1.5 sm:h-2 bg-gray-700 rounded-full cursor-pointer mb-1 sm:mb-2 relative"
            >
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-green-500 rounded-full relative"
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 sm:w-3 h-2 sm:h-3 bg-yellow-300 rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(trackDuration)}</span>
            </div>
          </div>

          {/* Kontrol Player */}
          <div className="grid grid-cols-5 gap-1 sm:gap-2 mb-2 sm:mb-4">
            <button
              onClick={handlePrevTrack}
              className="bg-blue-500 h-8 sm:h-10 rounded-lg text-white flex items-center justify-center"
            >
              ⏮
            </button>
            <button
              onClick={handlePlayPause}
              className="bg-blue-500 h-8 sm:h-10 rounded-lg text-white col-span-3 flex items-center justify-center"
            >
              {isPlaying ? "⏸" : "▶️"}
            </button>
            <button
              onClick={handleNextTrack}
              className="bg-blue-500 h-8 sm:h-10 rounded-lg text-white flex items-center justify-center"
            >
              ⏭
            </button>
          </div>

          {/* Playlist */}
          <div className="h-40 bg-gray-800 p-2 border-2 border-gray-700 rounded-lg overflow-y-auto mb-4">
            <h2 className="text-yellow-300 font-bold mb-2 retro-text">
              PLAYLIST:
            </h2>
            {playlist.map((track, index) => (
              <div
                key={track.id}
                onClick={() => handlePlaylistClick(index)}
                className={`flex justify-between items-center p-1 text-xs rounded cursor-pointer ${
                  currentTrackIndex === index ? "bg-gray-700" : ""
                }`}
              >
                <div className="flex">
                  <span className="text-gray-400 mr-2">{index + 1}.</span>
                  <span
                    className={`${
                      currentTrackIndex === index
                        ? "text-green-400"
                        : "text-gray-300"
                    }`}
                  >
                    {track.title}
                  </span>
                </div>
                <span className="text-gray-500">{track.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigasi */}
        <Link
          href="/tetris"
          className="block w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg text-center hover:bg-green-600 transition-colors retro-button mb-4"
        >
          SELANJUTNYA
        </Link>
        <Link
          href="/"
          className="block w-full bg-red-500 text-white font-bold py-2 sm:py-3 px-4 rounded-lg text-center hover:bg-red-600 transition-colors retro-button text-xs sm:text-base"
        >
          KEMBALI
        </Link>
      </div>

      {/* Elemen Audio yang tersembunyi */}
      <audio
        ref={audioRef}
        src={currentTrack.file}
        onEnded={handleNextTrack}
        className="hidden"
      />
    </div>
  );
}
