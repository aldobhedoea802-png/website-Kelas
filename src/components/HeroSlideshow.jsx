import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

function HeroSlideshow({ photos }) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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

  // Auto slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % photos.length);
    }, 5000);
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [photos.length]);

  useEffect(() => {
    setProgress(0);
  }, [current]);

  // Mouse parallax (nonaktif di mobile)
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

  const goToSlide = (index) => setCurrent(index);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % photos.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + photos.length) % photos.length);

  const particleCount = isMobile ? 20 : 50;

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex items-center justify-center text-center overflow-hidden"
    >
      {/* Slides */}
      {photos.map((photo, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-[1.5s] ease-in-out
            ${index === current ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
        >
          <img
            src={photo}
            className="w-full h-full object-cover transition-transform duration-[25s] ease-out"
            style={{
              transform: index === current ? "scale(1.15)" : "scale(1)",
            }}
            alt={`Slide ${index + 1}`}
          />
        </div>
      ))}

      {/* Overlay gradien */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/70"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,black/50_100%)]"></div>

      {/* Partikel bintang */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(particleCount)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              width: (Math.random() * 2 + 1) + "px",
              height: (Math.random() * 2 + 1) + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDuration: Math.random() * 3 + 2 + "s",
              animationDelay: Math.random() * 4 + "s",
              opacity: Math.random() * 0.6 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Konten utama */}
      <div
        className="relative z-10 px-4 md:px-6 max-w-3xl mx-auto transition-transform duration-300 ease-out"
        style={{
          transform: isMobile ? 'none' : `translate(${mousePosition.x * -8}px, ${mousePosition.y * -8}px)`,
        }}
      >
        <div className="bg-white/5 p-6 md:p-12 rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl shadow-black/50 relative overflow-hidden">
          {/* Glow */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-yellow-300/5 rounded-full"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-pink-400/5 rounded-full"></div>

          <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold mb-4 md:mb-6 tracking-wide animate-fadeUp relative z-10">
            <span className="block text-white/90 drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              WELCOME TO
            </span>
            <span className="block bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 
                             bg-[length:200%_auto] animate-gradient-x 
                             bg-clip-text text-transparent mt-1 md:mt-2 
                             drop-shadow-[0_4px_40px_rgba(251,191,36,0.4)]">
              SISVOR 009
            </span>
          </h1>

          <p className="text-sm md:text-lg text-white/80 max-w-lg mx-auto mb-6 md:mb-8 animate-fadeUp delay-200 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)] relative z-10">
            Selamat datang di ruang digital penyimpanan kelas SISVOR 009
            untuk berbagi karya dan menunjukkan kemampuan terbaik kita.
          </p>

          <div className="flex gap-3 md:gap-4 justify-center flex-wrap animate-fadeUp delay-300 relative z-10">
            <Link
              to="/student-websites"
              className="group relative px-4 md:px-6 py-2 md:py-2.5 bg-yellow-300 text-black font-semibold rounded-full text-sm md:text-base
                         shadow-lg shadow-yellow-500/40 hover:shadow-yellow-400/60 
                         transition-all duration-300 hover:scale-105 hover:-translate-y-1
                         flex items-center gap-2 overflow-hidden"
            >
              <span className="relative z-10">Lihat Website</span>
              <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            <Link
              to="/students"
              className="group relative px-4 md:px-6 py-2 md:py-2.5 bg-white/10 text-white font-semibold rounded-full text-sm md:text-base
                         border border-white/20 hover:border-yellow-300/60 
                         transition-all duration-300 hover:scale-105 hover:-translate-y-1
                         flex items-center gap-2 overflow-hidden"
            >
              <span className="relative z-10">Mahasiswa</span>
              <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 bg-gradient-to-r from-white/5 to-yellow-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          </div>
        </div>

        {/* Indikator */}
        <div className="flex flex-col items-center gap-3 md:gap-4 mt-6 md:mt-8">
          <div className="flex justify-center gap-1.5 md:gap-2">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative rounded-full transition-all duration-500 
                  ${index === current 
                    ? "w-6 md:w-8 h-1.5 md:h-2 bg-yellow-300 shadow-lg shadow-yellow-500/50" 
                    : "w-1.5 md:w-2 h-1.5 md:h-2 bg-white/30 hover:bg-white/60"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress circular */}
          <div className="relative w-6 h-6 md:w-8 md:h-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 32 32">
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fcd34d" />
                  <stop offset="100%" stopColor="#fb923c" />
                </linearGradient>
              </defs>
              <circle
                cx="16"
                cy="16"
                r="12"
                stroke="white/20"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="16"
                cy="16"
                r="12"
                stroke="url(#progressGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 12}
                strokeDashoffset={2 * Math.PI * 12 * (1 - progress / 100)}
                className="transition-all duration-50"
              />
            </svg>
          </div>
        </div>

        <div className="text-white/40 text-[10px] md:text-xs mt-1 md:mt-2 font-mono tracking-wider">
          {String(current + 1).padStart(2, "0")} · {String(photos.length).padStart(2, "0")}
        </div>
      </div>

      {/* Navigasi */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-10 p-2 md:p-2.5 rounded-full 
                   bg-white/10 border border-white/10 text-white/70 
                   hover:bg-white/20 hover:scale-110 transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft size={isMobile ? 18 : 24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-10 p-2 md:p-2.5 rounded-full 
                   bg-white/10 border border-white/10 text-white/70 
                   hover:bg-white/20 hover:scale-110 transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight size={isMobile ? 18 : 24} />
      </button>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce-slow">
        <div className="w-4 h-6 md:w-6 md:h-10 border-2 border-white/20 rounded-full flex justify-center pt-1 md:pt-2">
          <div className="w-0.5 h-1.5 md:w-1 md:h-2 bg-white/30 rounded-full animate-scroll-down"></div>
        </div>
      </div>
    </section>
  );
}

export default HeroSlideshow;