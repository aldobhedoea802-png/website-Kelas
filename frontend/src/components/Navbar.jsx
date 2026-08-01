import { Link } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle.jsx";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

function Navbar({ scrolled }) {
  const [isOpen, setIsOpen] = useState(false);

  // Tutup menu saat layar berubah ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Tutup menu saat scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  return (
    <>
      <nav
        className={`
          fixed top-0 w-full z-50 
          flex justify-between items-center 
          px-4 md:px-12 py-3 md:py-4 
          transition-all duration-500 ease-in-out
          ${
            scrolled
              ? "bg-black/70 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/30"
              : "bg-transparent"
          }
        `}
      >
        {/* Logo — ukuran di HP lebih kecil */}
        <Link
          to="/"
          className="group relative text-lg md:text-3xl font-black tracking-widest 
                     bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 
                     bg-[length:200%_auto] animate-gradient-x 
                     bg-clip-text text-transparent 
                     hover:scale-105 transition-transform duration-300"
        >
          SISVOR 009
          {/* Efek glow di belakang logo */}
          <span className="absolute inset-0 blur-2xl bg-gradient-to-r from-yellow-300/20 via-orange-400/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/students">Mahasiswa</NavLink>
          <Link
            to="/student-websites"
            className="group relative bg-gradient-to-r from-yellow-300 to-orange-400 
                       text-black px-7 py-2.5 rounded-full font-bold 
                       shadow-lg shadow-yellow-500/30 hover:shadow-yellow-400/50 
                       transition-all duration-300 hover:scale-105 
                       overflow-hidden"
          >
            <span className="relative z-10">Portfolio</span>
            <span className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-orange-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></span>
          </Link>
          <DarkModeToggle />
        </div>

        {/* Mobile Hamburger — ukuran lebih besar agar mudah diklik */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white/80 hover:text-white focus:outline-none transition-all duration-300 hover:scale-110 ml-2 p-1"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X size={32} className="rotate-90 transition-transform duration-300" />
          ) : (
            <Menu size={32} className="rotate-0 transition-transform duration-300" />
          )}
        </button>
      </nav>

      {/* Mobile Menu — lebih lebar dan nyaman di HP */}
      <div
        className={`
          fixed top-0 right-0 h-full w-[280px] sm:w-80 
          bg-black/85 backdrop-blur-2xl 
          border-l border-white/5 shadow-2xl z-40 
          transform transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          md:hidden
          flex flex-col items-start gap-6 p-6 pt-24
        `}
      >
        <MobileNavLink to="/" onClick={() => setIsOpen(false)} delay="0ms">
          Home
        </MobileNavLink>
        <MobileNavLink to="/students" onClick={() => setIsOpen(false)} delay="80ms">
          Mahasiswa
        </MobileNavLink>
        <MobileNavLink
          to="/student-websites"
          onClick={() => setIsOpen(false)}
          delay="160ms"
          className="bg-gradient-to-r from-yellow-300 to-orange-400 
                     text-black px-5 py-2.5 rounded-full font-bold 
                     w-full text-center shadow-lg shadow-yellow-500/20
                     hover:scale-105 transition-transform duration-300"
        >
          Portfolio
        </MobileNavLink>
        <div className="mt-4 w-full flex justify-center animate-fadeInMobile" style={{ animationDelay: "240ms" }}>
          <DarkModeToggle />
        </div>
        {/* Tambahan footer menu */}
        <div className="mt-auto pt-8 w-full border-t border-white/5 text-center text-white/20 text-xs font-mono">
          SISVOR 009
        </div>
      </div>
    </>
  );
}

// Komponen NavLink desktop dengan animasi underline
function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="relative text-white/70 hover:text-white transition-colors duration-300
                 after:absolute after:left-0 after:-bottom-1 
                 after:w-0 after:h-[2px] 
                 after:bg-gradient-to-r after:from-yellow-300 after:to-orange-400 
                 after:transition-all after:duration-300 
                 hover:after:w-full
                 hover:scale-105 transition-all duration-300"
    >
      {children}
    </Link>
  );
}

// Komponen MobileNavLink dengan animasi fade + slide dan efek hover lebih baik
function MobileNavLink({ to, children, onClick, delay = "0ms", className = "" }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        text-white/80 hover:text-white text-xl font-medium 
        border-b border-transparent hover:border-yellow-300/50 pb-2 
        transition-all duration-300 w-full hover:translate-x-2
        animate-fadeInMobile
        ${className}
      `}
      style={{ animationDelay: delay }}
    >
      {children}
    </Link>
  );
}

export default Navbar;