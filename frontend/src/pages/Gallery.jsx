import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  X,
  Heart,
  Download,
  ZoomIn,
  Grid,
  List,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Image,
  Clock,
  Film,
  Camera,
} from "lucide-react";

// Helper: deteksi video dari ekstensi
const isVideoUrl = (src) => {
  return /\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i.test(src);
};

function Gallery({ photos: externalPhotos }) {
  // Gunakan BASE_URL untuk fallback path
  const base = import.meta.env.BASE_URL; // => '/website-Kelas/'

  // Fallback photos dengan BASE_URL
  const defaultPhotos = [
    base + "foto1.jpeg",
    base + "foto2.jpeg",
    base + "foto3.jpeg",
    base + "foto4.jpeg",
    base + "foto5.jpeg",
    base + "foto6.jpeg",
    base + "foto7.jpeg",
    base + "foto8.jpeg",
    base + "foto9.jpeg",
    base + "foto10.jpeg",
    base + "foto11.jpeg",
    base + "foto12.jpeg",
    base + "foto13.jpeg",
    base + "foto14.jpeg",
    base + "foto15.jpeg",
    base + "foto16.jpeg",
    base + "foto17.jpeg",
    base + "foto18.jpeg",
    base + "foto19.jpeg",
    base + "foto20.jpeg",
    base + "foto21.jpeg",
    base + "foto22.jpeg",
    base + "foto23.jpeg",
    base + "foto24.jpeg",
    base + "foto25.jpeg",
    base + "foto26.jpeg",
    base + "foto27.jpeg",
    base + "foto28.jpeg",
    base + "foto29.jpeg",
    base + "foto30.jpeg",
    base + "foto31.jpeg",
    base + "foto32.jpeg",
    base + "foto33.jpeg",
    base + "foto34.jpeg",
    base + "foto35.jpeg",
    base + "foto36.jpeg",
    base + "foto37.jpeg",
    base + "foto38.jpeg",
    base + "foto39.jpeg",
    base + "foto40.jpeg",
    base + "video1.mp4",
  ];

  const allPhotos = externalPhotos?.length > 0 ? externalPhotos : defaultPhotos;

  // State filter: 'all' | 'photos' | 'videos'
  const [filterType, setFilterType] = useState("all");

  const filteredPhotos = useMemo(() => {
    if (filterType === "photos") {
      return allPhotos.filter((p) => !isVideoUrl(p));
    } else if (filterType === "videos") {
      return allPhotos.filter((p) => isVideoUrl(p));
    }
    return allPhotos;
  }, [allPhotos, filterType]);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Deteksi mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Parallax efek (nonaktif di mobile)
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePosition({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  // Partikel
  const particleCount = isMobile ? 25 : 50;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    size: Math.random() * 5 + 1,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 6,
    opacity: Math.random() * 0.3 + 0.05,
    type: ["dot", "sparkle", "square"][Math.floor(Math.random() * 3)],
  }));

  const openModal = (photo, index) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
    setTimeout(() => {
      setSelectedPhoto(null);
      setSelectedIndex(null);
    }, 300);
  };

  const navigatePhoto = (direction) => {
    if (selectedIndex === null) return;
    const newIndex =
      direction === "next"
        ? (selectedIndex + 1) % filteredPhotos.length
        : (selectedIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setSelectedIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft" && isModalOpen) navigatePhoto("prev");
      if (e.key === "ArrowRight" && isModalOpen) navigatePhoto("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, selectedIndex, filteredPhotos]);

  const downloadMedia = (src) => {
    const link = document.createElement("a");
    link.href = src;
    const fileName = src.split('/').pop() || `SISVOR009_${Date.now()}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const photoCount = allPhotos.filter((p) => !isVideoUrl(p)).length;
  const videoCount = allPhotos.filter((p) => isVideoUrl(p)).length;

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-600 dark:from-gray-900 dark:via-gray-800 dark:to-black text-white p-4 md:p-10 overflow-hidden relative"
    >
      {/* Background & partikel */}
      <div className="fixed inset-0 bg-[length:400%_400%] animate-gradient-slow bg-gradient-to-br from-indigo-700/30 via-purple-700/30 to-blue-600/30 dark:from-gray-900/30 dark:via-gray-800/30 dark:to-black/30 pointer-events-none"></div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => {
          let className = "absolute rounded-full ";
          if (p.type === "sparkle") className += "bg-yellow-300/40 animate-twinkle";
          else if (p.type === "square") className += "bg-white/20 animate-float rounded-none rotate-45";
          else className += "bg-white/30 animate-float";
          return (
            <div
              key={p.id}
              className={className}
              style={{
                width: p.size,
                height: p.size,
                top: p.top + "%",
                left: p.left + "%",
                animationDuration: p.duration + "s",
                animationDelay: p.delay + "s",
                opacity: p.opacity,
                ...(p.type === "sparkle" && { boxShadow: "0 0 15px rgba(251,191,36,0.3)" }),
              }}
            />
          );
        })}
      </div>

      {!isMobile && (
        <>
          <div className="fixed -top-40 -left-40 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl pointer-events-none transition-transform duration-300 ease-out" style={{ transform: `translate(${mousePosition.x * -25}px, ${mousePosition.y * -25}px)` }} />
          <div className="fixed top-60 -right-40 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none transition-transform duration-300 ease-out" style={{ transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * -25}px)` }} />
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-yellow-300/10 rounded-full blur-3xl pointer-events-none transition-transform duration-300 ease-out" style={{ transform: `translate(${mousePosition.x * -35}px, ${mousePosition.y * 35}px)` }} />
        </>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <Link
          to="/"
          className="group inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-white/20 backdrop-blur-xl rounded-xl hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg border border-white/10 mb-6 md:mb-12 text-sm md:text-base"
        >
          <ArrowLeft size={16} className="md:w-[18px] md:h-[18px] group-hover:-translate-x-1 transition-transform" />
          <span>Kembali</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-10 md:mb-14 animate-fadeUp">
          <div className="inline-block relative">
            <span className="absolute -top-6 -right-6 md:-top-8 md:-right-8 text-3xl md:text-5xl opacity-20 animate-pulse">✦</span>
            <span className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 text-3xl md:text-5xl opacity-20 animate-pulse delay-1000">✦</span>
            <h1 className="text-2xl md:text-6xl font-extrabold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(251,191,36,0.3)]">
              Galeri Kenangan
            </h1>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/3 md:w-1/2 h-0.5 md:h-1 bg-gradient-to-r from-yellow-300 to-purple-400 rounded-full"></div>
          </div>
          <p className="text-white/50 mt-3 md:mt-6 max-w-xl mx-auto text-xs md:text-sm flex items-center justify-center gap-2">
            <Sparkles size={12} className="md:w-[16px] md:h-[16px] text-yellow-400/60" />
            Kumpulan momen terbaik SISVOR 009
          </p>
        </div>

        {/* Toolbar dengan Tab Filter */}
        <div className="flex flex-wrap justify-between items-center gap-3 md:gap-4 mb-8 md:mb-10">
          <div className="flex items-center gap-3 md:gap-6 flex-wrap">
            <div className="flex items-center gap-1.5 md:gap-2 text-white/40 text-[10px] md:text-sm font-mono bg-white/5 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/10">
              <Image size={14} className="md:w-[16px] md:h-[16px] text-yellow-400/50" />
              <span>{filteredPhotos.length} item</span>
            </div>

            <div className="flex gap-1 bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 p-1">
              <button
                onClick={() => setFilterType("all")}
                className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-xs font-medium transition-all duration-300 ${
                  filterType === "all"
                    ? "bg-gradient-to-r from-yellow-300 to-orange-400 text-black shadow-lg"
                    : "text-white/50 hover:text-white hover:bg-white/10"
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterType("photos")}
                className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-xs font-medium transition-all duration-300 flex items-center gap-1 ${
                  filterType === "photos"
                    ? "bg-gradient-to-r from-yellow-300 to-orange-400 text-black shadow-lg"
                    : "text-white/50 hover:text-white hover:bg-white/10"
                }`}
              >
                <Camera size={12} /> Foto ({photoCount})
              </button>
              <button
                onClick={() => setFilterType("videos")}
                className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-xs font-medium transition-all duration-300 flex items-center gap-1 ${
                  filterType === "videos"
                    ? "bg-gradient-to-r from-yellow-300 to-orange-400 text-black shadow-lg"
                    : "text-white/50 hover:text-white hover:bg-white/10"
                }`}
              >
                <Film size={12} /> Video ({videoCount})
              </button>
            </div>
          </div>

          <div className="flex gap-1.5 md:gap-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 md:p-2.5 rounded-lg transition-all duration-300 ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-yellow-300 to-orange-400 text-black shadow-lg"
                  : "text-white/40 hover:text-white hover:bg-white/10"
              }`}
            >
              <Grid size={isMobile ? 14 : 18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 md:p-2.5 rounded-lg transition-all duration-300 ${
                viewMode === "list"
                  ? "bg-gradient-to-r from-yellow-300 to-orange-400 text-black shadow-lg"
                  : "text-white/40 hover:text-white hover:bg-white/10"
              }`}
            >
              <List size={isMobile ? 14 : 18} />
            </button>
          </div>
        </div>

        {/* Gallery */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            <p className="text-lg">Tidak ada {filterType === 'photos' ? 'foto' : 'video'} ditemukan</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {filteredPhotos.map((photo, index) => (
              <GalleryCard
                key={index}
                photo={photo}
                index={index}
                onClick={() => openModal(photo, index)}
                isMobile={isMobile}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 md:gap-4">
            {filteredPhotos.map((photo, index) => (
              <GalleryListItem
                key={index}
                photo={photo}
                index={index}
                onClick={() => openModal(photo, index)}
                isMobile={isMobile}
              />
            ))}
          </div>
        )}

        <div className="mt-12 md:mt-16 text-center text-white/20 text-[10px] md:text-xs font-mono flex flex-col items-center gap-1.5 md:gap-2">
          <p>SISVOR 009 © {new Date().getFullYear()} — Galeri Kenangan</p>
          <div className="flex items-center gap-2 md:gap-4 text-[8px] md:text-[10px] text-white/10">
            <span>✨ Momen terbaik</span>
            <span className="w-px h-2 bg-white/10"></span>
            <span>📸 Kenangan</span>
            <span className="w-px h-2 bg-white/10"></span>
            <span>❤️ Bersama</span>
          </div>
        </div>
      </div>

      {/* Modal Lightbox */}
      {isModalOpen && selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center z-50 p-3 md:p-4 animate-fadeUp"
          onClick={closeModal}
        >
          <div
            className="relative max-w-7xl w-full max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 md:top-4 md:right-4 z-20 p-2 md:p-3 rounded-full bg-black/60 hover:bg-white/20 border border-white/10 transition-all duration-300 hover:scale-110 hover:rotate-90"
              aria-label="Tutup"
            >
              <X size={isMobile ? 18 : 22} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadMedia(selectedPhoto);
              }}
              className="absolute top-2 left-2 md:top-4 md:left-4 z-20 p-2 md:p-3 rounded-full bg-black/60 hover:bg-yellow-300 border border-white/10 transition-all duration-300 hover:scale-110 hover:text-black group"
              aria-label="Download"
            >
              <Download size={isMobile ? 16 : 20} className="group-hover:text-black" />
            </button>

            <div className="flex items-center justify-center h-full p-2 md:p-8">
              {isVideoUrl(selectedPhoto) ? (
                <video
                  src={selectedPhoto}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[75vh] md:max-h-[80vh] max-w-[95vw] md:max-w-[90vw] w-auto h-auto object-contain rounded-xl shadow-2xl border border-white/10"
                />
              ) : (
                <img
                  src={selectedPhoto}
                  alt={`Media ${selectedIndex + 1}`}
                  className="max-h-[75vh] md:max-h-[80vh] max-w-[95vw] md:max-w-[90vw] w-auto h-auto object-contain rounded-xl shadow-2xl border border-white/10 animate-fadeUp"
                  style={{ imageRendering: "auto", WebkitOptimizeContrast: "auto" }}
                  loading="eager"
                  draggable="false"
                />
              )}
            </div>

            {filteredPhotos.length > 1 && (
              <>
                <div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigatePhoto("prev");
                    }}
                    className="p-2 md:p-3 rounded-full bg-black/60 hover:bg-white/20 border border-white/10 transition-all duration-300 hover:scale-110"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={isMobile ? 18 : 24} />
                  </button>
                </div>
                <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigatePhoto("next");
                    }}
                    className="p-2 md:p-3 rounded-full bg-black/60 hover:bg-white/20 border border-white/10 transition-all duration-300 hover:scale-110"
                    aria-label="Next"
                  >
                    <ChevronRight size={isMobile ? 18 : 24} />
                  </button>
                </div>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:bottom-6 bg-black/60 backdrop-blur-xl px-4 md:px-6 py-1.5 md:py-2 rounded-full border border-white/10 text-white/80 text-xs md:text-sm font-mono">
              {selectedIndex !== null && (
                <>
                  {selectedIndex + 1} / {filteredPhotos.length}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Komponen Card Grid
function GalleryCard({ photo, index, onClick, isMobile }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const isVideo = isVideoUrl(photo);

  const handleMouseMove = (e) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: y * -6, rotateY: x * 6 });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className="group relative rounded-xl md:rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-yellow-300/30 animate-fadeUp"
      style={{
        animationDelay: `${(index % 12) * 80}ms`,
        perspective: isMobile ? 'none' : '800px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      <div
        className="transition-transform duration-300 ease-out"
        style={{
          transform: isMobile ? 'none' : `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
          transformStyle: "preserve-3d",
        }}
      >
        {isVideo ? (
          <video
            src={photo}
            className="w-full h-[160px] md:h-[240px] object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={photo}
            alt={`Gallery ${index + 1}`}
            className="w-full h-[160px] md:h-[240px] object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            draggable="false"
          />
        )}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4 flex justify-between items-center">
            <span className="text-white/90 text-[10px] md:text-sm font-medium drop-shadow-lg">
              #{String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex gap-1.5 md:gap-2">
              <ZoomIn size={isMobile ? 14 : 18} className="text-white/70 hover:text-white transition-transform hover:scale-110" />
              <Heart size={isMobile ? 14 : 18} className="text-white/50 hover:text-red-400 transition-colors hover:scale-110" />
            </div>
          </div>
        </div>
        <div className="absolute top-2 left-2 md:top-3 md:left-3 text-[8px] md:text-[10px] bg-black/60 px-2 md:px-3 py-0.5 md:py-1 rounded-full backdrop-blur-sm border border-white/10 font-mono tracking-wider">
          {isVideo ? "🎬 Video" : "📸 Foto"}
        </div>
      </div>
    </div>
  );
}

// Komponen List Item
function GalleryListItem({ photo, index, onClick, isMobile }) {
  const isVideo = isVideoUrl(photo);

  return (
    <div
      className="group flex items-center gap-3 md:gap-4 bg-white/10 backdrop-blur-xl p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/10 hover:border-yellow-300/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-500/10 cursor-pointer animate-fadeUp"
      style={{ animationDelay: `${(index % 12) * 80}ms` }}
      onClick={onClick}
    >
      <div className="w-14 h-14 md:w-20 md:h-20 rounded-lg md:rounded-xl overflow-hidden flex-shrink-0 shadow-md bg-black/30">
        {isVideo ? (
          <video
            src={photo}
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={photo}
            alt={`Gallery ${index + 1}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
            draggable="false"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs md:text-sm font-semibold group-hover:text-yellow-300 transition-colors flex items-center gap-2">
          <span>{isVideo ? "🎬" : "📸"}</span>
          <span>#{String(index + 1).padStart(2, "0")}</span>
          <span className="text-[10px] text-white/40 font-normal">{isVideo ? "Video" : "Foto"}</span>
        </div>
        <div className="text-[10px] md:text-xs text-white/40 flex items-center gap-1.5 md:gap-2">
          <span className="hidden sm:inline">Kenangan SISVOR 009</span>
          <span className="sm:hidden">SISVOR 009</span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span className="text-white/20 font-mono text-[8px] md:text-[10px]">✨</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 md:gap-2">
        <ZoomIn size={isMobile ? 14 : 18} className="text-white/30 group-hover:text-white transition-transform group-hover:scale-110" />
        <span className="text-[10px] md:text-xs text-white/20 font-mono">→</span>
      </div>
    </div>
  );
}

export default Gallery;