import { Link } from "react-router-dom";
import {
  Github,
  Instagram,
  Twitter,
  Youtube,
  ArrowUp,
  Heart,
  Send,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const footerRef = useRef(null);
  const [typedText, setTypedText] = useState("");
  const fullText = "Ruang digital untuk berbagi karya dan menunjukkan kemampuan terbaik dari kelas SISVOR 009.";
  const [isTypingDone, setIsTypingDone] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Typing effect — lebih cepat di mobile
  useEffect(() => {
    let index = 0;
    const speed = isMobile ? 20 : 30;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        setIsTypingDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [isMobile]);

  // Parallax efek hanya di desktop
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e) => {
      if (!footerRef.current) return;
      const rect = footerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePosition({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Partikel — lebih sedikit di mobile
  const particleCount = isMobile ? 12 : 25;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 12 + 10,
    delay: Math.random() * 6,
    opacity: 0.1 + Math.random() * 0.2,
  }));

  return (
    <footer
      ref={footerRef}
      className="relative mt-20 md:mt-40 border-t border-paper-100/5 bg-gradient-to-b from-ink-950/20 to-ink-950/40 overflow-hidden"
    >
      {/* Partikel */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-paper-100/40 animate-float"
            style={{
              width: p.size + 'px',
              height: p.size + 'px',
              top: p.top + '%',
              left: p.left + '%',
              animationDuration: p.duration + 's',
              animationDelay: p.delay + 's',
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* Garis gradien */}
      <div className="absolute -top-px left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent animate-gradient-x"></div>

      {/* Dekorasi blur (hanya desktop) */}
      {!isMobile && (
        <>
          <div
            className="absolute -bottom-20 -left-20 w-72 h-72 bg-gold-400/10 rounded-full blur-3xl transition-transform duration-300 ease-out"
            style={{
              transform: `translate(${mousePosition.x * -25}px, ${mousePosition.y * -25}px)`,
            }}
          />
          <div
            className="absolute -bottom-20 -right-20 w-72 h-72 bg-coral-400/10 rounded-full blur-3xl transition-transform duration-300 ease-out"
            style={{
              transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * -25}px)`,
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-300/5 rounded-full blur-3xl transition-transform duration-300 ease-out"
            style={{
              transform: `translate(${mousePosition.x * -35}px, ${mousePosition.y * 35}px)`,
            }}
          />
        </>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 relative z-10">
        {/* Grid — 1 kolom di mobile, 4 di desktop */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="space-y-2 animate-fadeUp">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-md id-card bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-ink-950 font-display font-bold text-xs shrink-0">
                S9
              </span>
              <h2 className="text-lg md:text-2xl font-display font-semibold tracking-tight text-paper-100">
                SISVOR <span className="text-gold-400">009</span>
              </h2>
            </div>
            <p className="text-paper-100/40 text-xs md:text-sm leading-relaxed max-w-xs min-h-[40px] md:min-h-[60px]">
              {typedText}
              {!isTypingDone && (
                <span className="inline-block w-0.5 h-3 md:h-4 bg-gold-500/60 animate-pulse ml-0.5"></span>
              )}
            </p>
            <div className="flex items-center gap-1.5 md:gap-2 text-paper-100/30 text-xs md:text-sm">
              <span>Made with</span>
              <Heart size={12} className="md:w-[14px] md:h-[14px] text-red-400 animate-pulse" />
              <span>by Tim SISVOR</span>
            </div>
          </div>

          {/* Tautan */}
          <div className="animate-fadeUp delay-200">
            <h3 className="text-paper-100 font-semibold text-sm md:text-base mb-3 md:mb-4 relative inline-block">
              Tautan
              <span className="absolute -bottom-1 left-0 w-6 h-0.5 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full"></span>
            </h3>
            <ul className="space-y-2 md:space-y-2.5 mt-3 md:mt-4">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/students">Mahasiswa</FooterLink>
              <FooterLink to="/student-websites">Portfolio</FooterLink>
              <FooterLink to="/about">Tentang</FooterLink>
            </ul>
          </div>

          {/* Sosial Media */}
          <div className="animate-fadeUp delay-300">
            <h3 className="text-paper-100 font-semibold text-sm md:text-base mb-3 md:mb-4 relative inline-block">
              Ikuti Kami
              <span className="absolute -bottom-1 left-0 w-6 h-0.5 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full"></span>
            </h3>
            <div className="flex flex-wrap gap-2 md:gap-3 mt-3 md:mt-4">
              <SocialIcon href="https://www.instagram.com/nakmm009/" icon={<Instagram size={16} className="md:w-[18px] md:h-[18px]" />} label="Instagram" />
            </div>
          </div>

          {/* Kontak */}
          <div className="animate-fadeUp delay-400">
            <h3 className="text-paper-100 font-semibold text-sm md:text-base mb-3 md:mb-4 relative inline-block">
              Hubungi
              <span className="absolute -bottom-1 left-0 w-6 h-0.5 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full"></span>
            </h3>
            <div className="space-y-2 mt-3 md:mt-4">
              <a
                href="mailto:Aldofrsyh21@gmail.com"
                className="text-paper-100/40 hover:text-paper-100/70 text-xs md:text-sm flex items-center gap-1.5 md:gap-2 transition-all duration-300 group"
              >
                <span className="text-gold-500/50 group-hover:scale-110 transition-transform duration-300">📧</span>
                Aldofrsyh21@gmail.com
              </a>
              <a
                href="https://www.google.com/maps/search/Universitas+Pamulang"
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper-100/40 hover:text-paper-100/70 text-xs md:text-sm flex items-center gap-1.5 md:gap-2 transition-all duration-300 group"
              >
                <span className="text-gold-500/50 group-hover:scale-110 transition-transform duration-300">📍</span>
                Kampus Universitas Pamulang
              </a>
              <Link
                to="/contact"
                className="group relative inline-block mt-2 md:mt-3 px-4 md:px-5 py-1.5 md:py-2 bg-gradient-to-r from-gold-400 to-gold-600 
                           text-black font-semibold rounded-full text-xs md:text-sm overflow-hidden
                           shadow-md shadow-gold-600/20 hover:shadow-gold-500/40 
                           hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-1.5 md:gap-2">
                  <Send size={12} className="md:w-[14px] md:h-[14px] group-hover:translate-x-1 transition-transform duration-300" />
                  Kontak
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-gold-200 to-gold-300 
                                 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 md:mt-16 pt-4 md:pt-6 border-t border-paper-100/5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-paper-100/20 text-[10px] md:text-xs flex items-center gap-1">
            &copy; {new Date().getFullYear()} SISVOR 009.
            <span className="text-paper-100/10 text-[8px]">•</span>
            <span className="text-paper-100/10">All rights reserved</span>
          </p>
          <div className="flex items-center gap-1.5 md:gap-2 text-paper-100/20 text-[8px] md:text-[10px]">
            <span>Built with</span>
            <span className="px-1.5 md:px-2 py-0.5 rounded bg-paper-100/5 hover:bg-paper-100/10 transition-all duration-300 hover:scale-105 cursor-default hover:text-paper-100/40">
              React
            </span>
            <span className="px-1.5 md:px-2 py-0.5 rounded bg-paper-100/5 hover:bg-paper-100/10 transition-all duration-300 hover:scale-105 cursor-default hover:text-paper-100/40">
              Node
            </span>
            <span className="px-1.5 md:px-2 py-0.5 rounded bg-paper-100/5 hover:bg-paper-100/10 transition-all duration-300 hover:scale-105 cursor-default hover:text-paper-100/40">
              Mongo
            </span>
          </div>
        </div>
      </div>

      {/* Back to Top — ukuran lebih kecil di mobile */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-4 md:bottom-6 right-4 md:right-6 z-50 group
                   ${showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
        aria-label="Back to top"
      >
        <div className="relative w-10 h-10 md:w-12 md:h-12">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 48 48">
            <defs>
              <linearGradient id="backToTopGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#DFAD48" />
                <stop offset="100%" stopColor="#BD8A34" />
              </linearGradient>
            </defs>
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="3"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="url(#backToTopGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="125.6"
              strokeDashoffset="125.6"
              className="transition-all duration-700"
              style={{ strokeDashoffset: showBackToTop ? '0' : '125.6' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <ArrowUp
              size={16}
              className="md:w-[20px] md:h-[20px] text-paper-100/70 group-hover:text-paper-100 group-hover:-translate-y-1 transition-all duration-300"
            />
          </div>
          <div className="absolute -inset-1 rounded-full bg-gold-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </button>
    </footer>
  );
}

// Footer Link
function FooterLink({ to, children }) {
  return (
    <li>
      <Link
        to={to}
        className="text-paper-100/40 hover:text-paper-100 transition-colors duration-200 
                   relative inline-block group text-xs md:text-sm
                   after:absolute after:left-0 after:-bottom-0.5 
                   after:w-0 after:h-[1.5px] 
                   after:bg-gradient-to-r after:from-gold-400 after:to-gold-600 
                   after:transition-all after:duration-300 
                   hover:after:w-full
                   hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.2)]
                   flex items-center gap-1.5"
      >
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gold-500/50 text-[8px] md:text-[10px]">
          ▸
        </span>
        {children}
      </Link>
    </li>
  );
}

// Social Icon
function SocialIcon({ href, icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group relative p-2 md:p-2.5 rounded-full 
                 bg-paper-100/5 hover:bg-gold-400 
                 text-paper-100/40 hover:text-black 
                 transition-all duration-300 
                 hover:scale-110 hover:-translate-y-1 
                 shadow-sm hover:shadow-md hover:shadow-gold-600/20
                 relative overflow-hidden"
    >
      <span className="relative z-10">{icon}</span>
      <span className="absolute inset-0 bg-gradient-to-r from-gold-200 to-gold-300 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      <span className="absolute inset-0 rounded-full border-2 border-gold-400/30 scale-0 group-hover:scale-100 transition-transform duration-500"></span>
      <span className="absolute -top-7 md:-top-8 left-1/2 -translate-x-1/2 bg-ink-950/80 text-paper-100 text-[8px] md:text-[10px] px-1.5 md:px-2 py-0.5 md:py-1 rounded 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none
                       after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-t-ink-950/80 after:border-transparent">
        {label}
      </span>
    </a>
  );
}

export default Footer;