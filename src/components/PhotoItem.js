import Image from "next/image";

export default function PhotoItem({ photo, isActive = false, onClick }) {
  if (!photo) return null;

  const todayDate = new Date().toLocaleDateString("id-ID", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <div
      className={`bg-white p-3 rounded-md shadow-lg relative ${
        isActive ? "ring-2 ring-green-400" : ""
      }`}
    >
      <div
        className="relative bg-black w-full h-52 mb-2 overflow-hidden"
        onClick={onClick}
        style={{
          cursor: photo.type === "video" && isActive ? "pointer" : "default",
        }}
      >
        {photo.type === "image" ? (
          <div className="relative w-full h-full">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill={true}
              style={{ objectFit: "contain" }}
              priority={true}
            />
          </div>
        ) : (
          // Tampilan placeholder untuk video
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
            <div className="w-16 h-16 rounded-full bg-red-600 bg-opacity-75 flex items-center justify-center mb-2">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-white border-b-8 border-b-transparent ml-1"></div>
            </div>
            <p className="text-white text-xs animate-pulse mb-1">
              Klik untuk memutar video
            </p>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 py-1 px-2">
          <p className="text-yellow-300 text-xs text-center retro-text">
            {photo.alt}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="w-2 h-2 rounded-full bg-black"></div>
        <div className="px-3 py-0.5 bg-yellow-400 text-xs text-black font-bold rounded">
          {todayDate}
        </div>
        <div className="w-2 h-2 rounded-full bg-black"></div>
      </div>
    </div>
  );
}
