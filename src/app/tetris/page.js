"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// --- KONFIGURASI DAN FUNGSI BANTUAN ---

// Mendefinisikan bentuk dan warna dari setiap balok Tetris (Tetromino)
const TETROMINOS = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "bg-cyan-500",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "bg-blue-500",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "bg-orange-500",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "bg-yellow-500",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: "bg-green-500",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "bg-purple-500",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: "bg-red-500",
  },
};

// Fungsi untuk membuat papan permainan kosong (15 baris x 10 kolom)
const createEmptyBoard = () => Array.from(Array(15), () => Array(10).fill(0));

// Fungsi untuk menghasilkan balok acak baru
const generateRandomTetromino = () => {
  const tetrominoKeys = Object.keys(TETROMINOS);
  const randomKey =
    tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)];
  const tetromino = TETROMINOS[randomKey];
  return {
    shape: tetromino.shape,
    color: tetromino.color,
    pos: { x: 4, y: 0 }, // Posisi awal di tengah atas
  };
};

// --- KOMPONEN UTAMA GAME ---

export default function TetrisPage() {
  // State untuk papan yang terlihat oleh pemain (termasuk balok yang bergerak)
  const [board, setBoard] = useState(createEmptyBoard());
  // State untuk papan yang hanya berisi balok yang sudah jatuh
  const [staticBoard, setStaticBoard] = useState(createEmptyBoard());
  // State untuk balok yang sedang dikontrol pemain
  const [player, setPlayer] = useState(generateRandomTetromino());

  // State untuk status permainan
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [linesCleared, setLinesCleared] = useState(0);
  const [dropTime, setDropTime] = useState(120); // Kecepatan jatuh balok

  // State untuk modal/popup
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  // Fungsi untuk memulai atau mereset game
  const startGame = () => {
    setStaticBoard(createEmptyBoard());
    setBoard(createEmptyBoard());
    setPlayer(generateRandomTetromino());
    setGameOver(false);
    setShowGameOverModal(false);
    setShowFinalMessage(false);
    setScore(0);
    setLevel(1);
    setLinesCleared(0);
    setDropTime(120);
    setGameStarted(true);
  };

  // Fungsi untuk mengecek tabrakan
  const checkCollision = useCallback(
    (playerPos, playerShape) => {
      for (let y = 0; y < playerShape.length; y++) {
        for (let x = 0; x < playerShape[y].length; x++) {
          if (playerShape[y][x] !== 0) {
            const newY = playerPos.y + y;
            const newX = playerPos.x + x;
            // Cek tabrakan dengan batas papan atau balok lain
            if (
              newY < 0 ||
              newY >= 15 ||
              newX < 0 ||
              newX >= 10 ||
              (newY >= 0 && staticBoard[newY][newX] !== 0)
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    [staticBoard]
  );

  // Fungsi untuk memindahkan balok ke kiri atau kanan
  const movePlayer = useCallback(
    (direction) => {
      const newPos = { ...player.pos, x: player.pos.x + direction };
      if (!checkCollision(newPos, player.shape)) {
        setPlayer((prev) => ({ ...prev, pos: newPos }));
      }
    },
    [player, checkCollision]
  );

  // Fungsi untuk memutar balok
  const rotatePlayer = useCallback(() => {
    const rotatedShape = player.shape[0].map((_, colIndex) =>
      player.shape.map((row) => row[colIndex]).reverse()
    );
    let newPos = player.pos;
    let offset = 0;

    // "Wall kick" logic: jika rotasi menyebabkan tabrakan, coba geser sedikit
    if (checkCollision(newPos, rotatedShape)) {
      offset = -1;
      if (checkCollision({ ...newPos, x: newPos.x + offset }, rotatedShape)) {
        offset = 1;
        if (checkCollision({ ...newPos, x: newPos.x + offset }, rotatedShape)) {
          return; // Rotasi tidak memungkinkan
        }
      }
    }

    setPlayer((prev) => ({
      ...prev,
      shape: rotatedShape,
      pos: { ...prev.pos, x: prev.pos.x + offset },
    }));
  }, [player, checkCollision]);

  // Fungsi untuk menjatuhkan balok satu langkah
  const dropPlayer = useCallback(() => {
    const newPos = { ...player.pos, y: player.pos.y + 1 };
    if (checkCollision(newPos, player.shape)) {
      // Balok mendarat
      const newStaticBoard = staticBoard.map((row) => [...row]);
      player.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell !== 0) {
            const boardY = player.pos.y + y;
            const boardX = player.pos.x + x;
            if (boardY >= 0) newStaticBoard[boardY][boardX] = player.color;
          }
        });
      });
      setStaticBoard(newStaticBoard);

      const newPlayer = generateRandomTetromino();
      setPlayer(newPlayer);

      // Cek game over
      if (checkCollision({ x: 4, y: 0 }, newPlayer.shape)) {
        setGameOver(true);
        setGameStarted(false);
        setShowGameOverModal(true);
      }
    } else {
      setPlayer((prev) => ({ ...prev, pos: newPos }));
    }
  }, [player, checkCollision, staticBoard]);

  // Fungsi untuk menjatuhkan balok langsung ke bawah (hard drop)
  const hardDropPlayer = useCallback(() => {
    let y = player.pos.y;
    while (!checkCollision({ ...player.pos, y: y + 1 }, player.shape)) {
      y++;
    }
    setPlayer((prev) => ({ ...prev, pos: { ...prev.pos, y } }));
  }, [player, checkCollision]);

  // Fungsi untuk membersihkan baris yang penuh
  const clearCompletedLines = useCallback(() => {
    let linesRemoved = 0;
    const newBoard = staticBoard.reduce((acc, row) => {
      if (row.every((cell) => cell !== 0)) {
        linesRemoved++;
        acc.unshift(Array(10).fill(0)); // Tambah baris kosong di atas
      } else {
        acc.push(row);
      }
      return acc;
    }, []);

    if (linesRemoved > 0) {
      const points = [0, 40, 100, 300, 1200][linesRemoved] * level;
      setScore((prev) => prev + points);

      setLinesCleared((prevLines) => {
        const totalLines = prevLines + linesRemoved;
        const newLevel = Math.floor(totalLines / 3) + 1;
        if (newLevel > level) {
          setLevel(newLevel);
          setDropTime(Math.max(50, 120 - (newLevel - 1) * 10)); // Percepat game
        }
        return totalLines;
      });
      setStaticBoard(newBoard);
    }
  }, [staticBoard, level]);

  // Efek untuk menggabungkan papan statis dan balok pemain menjadi satu papan
  useEffect(() => {
    const newVisibleBoard = staticBoard.map((row) => [...row]);
    player.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          const boardY = player.pos.y + y;
          const boardX = player.pos.x + x;
          if (boardY >= 0 && boardY < 15 && boardX >= 0 && boardX < 10) {
            newVisibleBoard[boardY][boardX] = player.color;
          }
        }
      });
    });
    setBoard(newVisibleBoard);
  }, [player, staticBoard]);

  // Efek untuk membersihkan baris setelah balok mendarat
  useEffect(() => {
    clearCompletedLines();
  }, [staticBoard, clearCompletedLines]);

  // Game Loop Utama
  useEffect(() => {
    let gameInterval = null;
    if (gameStarted && !gameOver) {
      gameInterval = setInterval(() => {
        dropPlayer();
      }, dropTime);
    }
    return () => {
      if (gameInterval) clearInterval(gameInterval);
    };
  }, [gameStarted, gameOver, dropPlayer, dropTime]);

  // Handler untuk input keyboard
  const handleKeyDown = useCallback(
    (e) => {
      if (gameStarted && !gameOver) {
        if (e.keyCode === 37) movePlayer(-1); // Kiri
        else if (e.keyCode === 39) movePlayer(1); // Kanan
        else if (e.keyCode === 40) dropPlayer(); // Bawah
        else if (e.keyCode === 38) rotatePlayer(); // Atas (Rotasi)
        else if (e.keyCode === 32) hardDropPlayer(); // Spasi (Hard Drop)
      }
    },
    [
      gameStarted,
      gameOver,
      movePlayer,
      dropPlayer,
      rotatePlayer,
      hardDropPlayer,
    ]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-2 sm:p-4 flex items-center justify-center">
      <div className="w-full max-w-[320px] sm:max-w-md mx-auto bg-gray-900 border-4 border-yellow-300 rounded-xl overflow-hidden shadow-2xl p-3 sm:p-6">
        <div className="retro-screen bg-black rounded-lg p-2 sm:p-4 mb-3 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-center text-green-400 mb-1 sm:mb-2 retro-text">
            Tetris
          </h1>

          {/* Info Panel */}
          <div className="flex justify-between mb-1 sm:mb-2 text-yellow-300 retro-text text-xs sm:text-sm">
            <div>Score: {score}</div>
            <div>Level: {level}</div>
          </div>
          <div className="flex justify-between mb-2 sm:mb-4 text-yellow-300 retro-text text-xs sm:text-sm">
            <div>Lines: {linesCleared}</div>
            {gameOver && !showGameOverModal && !showFinalMessage && (
              <div className="text-red-500">GAME OVER</div>
            )}
          </div>

          {/* Papan Game */}
          <div
            className="grid grid-cols-10 gap-0.5 bg-gray-800 p-1 border-2 border-gray-700 mb-3 sm:mb-4 mx-auto"
            style={{ maxWidth: "280px" }}
          >
            {board.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                  className={`w-[25px] h-[25px] sm:w-5 sm:h-5 ${
                    cell || "bg-gray-900"
                  }`}
                />
              ))
            )}
          </div>

          {/* Kontrol di Layar */}
          <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-3 sm:mb-4">
            <button
              onClick={() => gameStarted && !gameOver && movePlayer(-1)}
              className="bg-blue-500 h-8 sm:h-10 rounded-lg text-white retro-text text-xs flex items-center justify-center"
            >
              {"<"}
            </button>
            <button
              onClick={() => gameStarted && !gameOver && rotatePlayer()}
              className="bg-blue-500 h-8 sm:h-10 rounded-lg text-white retro-text text-xs flex items-center justify-center"
            >
              ROTATE
            </button>
            <button
              onClick={() => gameStarted && !gameOver && movePlayer(1)}
              className="bg-blue-500 h-8 sm:h-10 rounded-lg text-white retro-text text-xs flex items-center justify-center"
            >
              {">"}
            </button>
          </div>

          {!gameStarted && !showGameOverModal && !showFinalMessage && (
            <button
              onClick={startGame}
              className="w-full bg-green-500 py-2 rounded-lg text-white retro-text text-xs sm:text-sm"
            >
              {gameOver ? "PLAY AGAIN" : "START GAME"}
            </button>
          )}
        </div>
        <Link
          href="/"
          className="block w-full bg-red-500 text-white font-bold py-2 sm:py-3 px-4 rounded-lg text-center hover:bg-red-600 transition-colors retro-button text-xs sm:text-base"
        >
          KEMBALI
        </Link>
      </div>

      {/* Modal Game Over */}
      {showGameOverModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
          <div className="retro-screen bg-black rounded-lg p-4 sm:p-6 max-w-[320px] sm:max-w-md w-full border-4 border-yellow-300 shadow-2xl">
            <h2 className="text-3xl sm:text-5xl font-bold text-center text-red-500 mb-6 sm:mb-10 retro-text animate-pulse tracking-widest">
              GAME OVER
            </h2>
            <div className="flex justify-center mt-6 sm:mt-10">
              <button
                onClick={() => {
                  setShowGameOverModal(false);
                  setShowFinalMessage(true);
                }}
                className="bg-blue-500 px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-white retro-text text-sm hover:bg-blue-600 transition-colors"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pesan Akhir */}
      {showFinalMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
          <div className="retro-screen bg-black rounded-lg p-4 sm:p-6 max-w-[320px] sm:max-w-md w-full border-4 border-yellow-300 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-yellow-300 mb-4 sm:mb-6 retro-text">
              INGET YA!
            </h2>
            <div className="text-green-400 text-center retro-text mb-6 sm:mb-8 space-y-3 sm:space-y-4 text-sm sm:text-base">
              <p>walaupun kamu kalah,</p>
              <p>tapi kamu selalu menang</p>
              <p>kok di hati aku, HEHE ^_^</p>
              <p className="text-pink-400 text-xl sm:text-2xl mt-6 sm:mt-8">
                I LOVE YOU {"<3"}
              </p>
            </div>
            <div className="flex justify-center mt-4 sm:mt-6">
              <button
                onClick={() => setShowFinalMessage(false)}
                className="bg-blue-500 px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-white retro-text text-sm hover:bg-blue-600 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
