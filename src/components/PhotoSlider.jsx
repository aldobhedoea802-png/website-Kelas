import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Heart, Camera, Play, Pause, Sparkles } from "lucide-react";

function PhotoSlider({ photos }) {
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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

  // Parallax hanya di desktop
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

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Partikel dikurangi di mobile
  const particleCount = isMobile ? 15 : 30;
  const sparkles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.5 + 0.1,
  }));

  return (
    <section ref={containerRef} className="mt-24 md:mt-40 px-3 md:px-8 relative overflow-hidden">
      {/* Partikel latar belakang */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {sparkles.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-gold-400/30 animate-twinkle"
            style={{
              width: s.size,
              height: s.size,
              top: s.top + '%',
              left: s.left + '%',
              animationDuration: s.duration + 's',
              animationDelay: s.delay + 's',
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      {/* Header dengan efek parallax (hanya desktop) */}
      <div
        className="text-center mb-10 md:mb-16 transition-transform duration-300 ease-out relative z-10"
        style={{
          transform: isMobile ? 'none' : `translate(${mousePosition.x * -5}px, ${mousePosition.y * -5}px)`,
        }}
      >
        <div className="inline-block relative">
          <h2 className="font-display text-2xl md:text-5xl lg:text-6xl font-semibold 
                         bg-gradient-to-r from-gold-400 via-coral-400 to-teal-400 
                         bg-[length:200%_auto] animate-gradient-x 
                         bg-clip-text text-transparent">
            Foto Kenangan SISVOR 009
          </h2>
          <div className="absolute -bottom-2 md:-bottom-3 left-1/2 -translate-x-1/2 w-1/3 md:w-1/2 h-0.5 md:h-1 
                          bg-gradient-to-r from-gold-400 via-coral-400 to-teal-400 
                          rounded-full"></div>
        </div>
        <p className="text-paper-100/50 max-w-xl mx-auto mt-4 md:mt-6 text-xs md:text-base 
                      flex items-center justify-center gap-1.5 md:gap-2">
          <Camera size={14} className="md:w-[18px] md:h-[18px] text-gold-500/60" />
          <span className="hidden sm:inline">Momen kebersamaan, perjalanan, dan kenangan terbaik kelas kita</span>
          <span className="sm:hidden">Momen terbaik kelas kita</span>
          <span className="text-gold-500/60">✨</span>
        </p>
      </div>

      {/* Container slider dengan border gradien animasi */}
      <div
        className="relative overflow-hidden rounded-2xl md:rounded-3xl 
                   bg-gradient-to-br from-white/5 to-white/10 
                   backdrop-blur-xl border-2 border-transparent 
                   py-6 md:py-10 px-1.5 md:px-2 shadow-2xl shadow-ink-950/30
                   hover:border-paper-100/20 transition-colors duration-500
                   before:absolute before:inset-0 before:rounded-2xl md:before:rounded-3xl before:p-[2px] 
                   before:bg-gradient-to-r before:from-gold-400 before:via-coral-400 before:to-teal-400 
                   before:bg-[length:300%_auto] before:animate-gradient-x 
                   before:-z-10"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Efek glow di dalam container */}
        <div className="absolute -top-20 -left-20 w-40 md:w-60 h-40 md:h-60 bg-gold-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 md:w-60 h-40 md:h-60 bg-coral-400/10 rounded-full blur-3xl"></div>

        {/* Fade kiri & kanan — lebih tipis di mobile */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 
                        bg-gradient-to-r from-ink-950/90 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 
                        bg-gradient-to-l from-ink-950/90 to-transparent z-10"></div>

        {/* Slider 1 */}
        <div
          className={`flex w-max ${isPaused ? "pause-animation" : ""}`}
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          <div className="flex animate-scroll-left">
            {[...photos, ...photos].map((photo, index) => (
              <PhotoCard key={index} photo={photo} index={index} isMobile={isMobile} />
            ))}
          </div>
        </div>

        {/* Slider 2 */}
        <div
          className={`flex w-max mt-4 md:mt-10 ${isPaused ? "pause-animation" : ""}`}
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          <div className="flex animate-scroll-right">
            {[...photos, ...photos].map((photo, index) => (
              <PhotoCard key={index} photo={photo} index={index} reverse isMobile={isMobile} />
            ))}
          </div>
        </div>

        {/* Indikator Play/Pause dan jumlah foto */}
        <div className="absolute bottom-3 right-3 md:bottom-6 md:right-6 
                        flex items-center gap-2 md:gap-3 z-20">
          <div className="text-paper-100/20 text-[8px] md:text-xs font-mono tracking-widest
                          bg-ink-950/30 backdrop-blur-sm px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-paper-100/5">
            {photos.length} foto
          </div>
          <div className="bg-ink-950/30 backdrop-blur-sm px-1.5 md:px-2 py-0.5 md:py-1 rounded-full border border-paper-100/5">
            {isPaused ? (
              <Play size={12} className="md:w-[14px] md:h-[14px] text-gold-500/60" />
            ) : (
              <Pause size={12} className="md:w-[14px] md:h-[14px] text-paper-100/40" />
            )}
          </div>
        </div>

        {/* Tombol Lihat Galeri — lebih kecil di mobile */}
        <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6 z-20">
          <Link
            to="/gallery"
            className="group flex items-center gap-1 md:gap-1.5 text-[8px] md:text-sm 
                       text-paper-100/40 hover:text-paper-100/80 
                       bg-ink-950/30 backdrop-blur-sm px-2 md:px-3 py-0.5 md:py-1.5 rounded-full 
                       border border-paper-100/5 hover:border-gold-400/20 
                       transition-all duration-300"
          >
            <Sparkles size={10} className="md:w-[14px] md:h-[14px] text-gold-500/60 group-hover:scale-110 transition-transform duration-300" />
            <span className="hidden sm:inline">Lihat Galeri</span>
            <span className="sm:hidden">Galeri</span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Komponen kartu foto dengan efek 3D tilt (nonaktif di mobile)
function PhotoCard({ photo, index, reverse, isMobile }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: y * -10,
      rotateY: x * 10,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Ukuran gambar lebih kecil di mobile
  const imageSize = isMobile 
    ? 'w-[120px] h-[80px] sm:w-[160px] sm:h-[110px]' 
    : 'w-[200px] sm:w-[220px] md:w-[260px] h-[130px] sm:h-[140px] md:h-[170px]';

  return (
    <div
      ref={cardRef}
      className="relative group mx-1.5 md:mx-4 transition-all duration-300 hover:z-20"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: isMobile ? 'none' : '800px',
      }}
    >
      <div
        className="transition-transform duration-200 ease-out"
        style={{
          transform: isMobile 
            ? 'none' 
            : `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isHovered ? 1.08 : 1})`,
          transformStyle: 'preserve-3d',
        }}
      >
        <img
          src={photo}
          className={`${imageSize} object-cover rounded-lg md:rounded-xl 
                      shadow-lg shadow-ink-950/30 
                      transition-all duration-300 
                      border border-transparent md:border-2 
                      group-hover:border-gold-400/30
                      group-hover:shadow-2xl group-hover:shadow-gold-600/20`}
          alt={`Foto ${index + 1}`}
        />

        {/* Overlay gradien + nomor + hati — lebih sederhana di mobile */}
        <div className={`absolute inset-0 rounded-lg md:rounded-xl 
                         bg-gradient-to-t from-ink-950/70 via-transparent to-transparent 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-500
                         pointer-events-none`}>
          <div className="absolute bottom-1.5 md:bottom-3 left-1.5 md:left-3 right-1.5 md:right-3 flex justify-between items-center">
            <span className="text-paper-100/80 text-[8px] md:text-xs font-medium drop-shadow-md">
              #{String(index + 1).padStart(2, '0')}
            </span>
            <Heart size={12} className="md:w-[16px] md:h-[16px] text-paper-100/50 group-hover:text-red-400 transition-colors duration-300" />
          </div>
        </div>

        {/* Efek refleksi cahaya hanya di desktop */}
        {!isMobile && (
          <div className={`absolute inset-0 rounded-xl overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700`}>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent 
                            transform -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] 
                            transition-transform duration-1000 ease-in-out"></div>
          </div>
        )}

        {/* Efek glow di belakang */}
        <div className={`absolute -inset-1 rounded-xl 
                         bg-gradient-to-r from-gold-400/0 via-gold-400/15 to-gold-400/0 
                         opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10`}>
        </div>
      </div>
    </div>
  );
}

export default PhotoSlider;