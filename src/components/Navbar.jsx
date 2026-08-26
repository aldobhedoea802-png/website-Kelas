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
              ? "bg-ink-950/80 backdrop-blur-xl border-b border-gold-500/10 shadow-2xl shadow-ink-950/30"
              : "bg-transparent"
          }
        `}
      >
        {/* Logo — mark kartu ID + wordmark */}
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="w-8 h-8 md:w-9 md:h-9 rounded-md id-card bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-ink-950 font-display font-bold text-sm md:text-base shadow-gold shrink-0">
            S9
          </span>
          <span className="text-base md:text-xl font-display font-semibold tracking-tight text-paper-100 group-hover:text-gold-400 transition-colors duration-300">
            SISVOR <span className="text-gold-400">009</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/students">Mahasiswa</NavLink>
          <NavLink to="/gallery">Galeri</NavLink>
          <NavLink to="/about">Tentang</NavLink>
          <Link
            to="/student-websites"
            className="relative bg-gold-400 text-ink-950 px-6 py-2.5 rounded-md font-semibold
                       shadow-gold hover:bg-gold-300 
                       transition-all duration-300
                       overflow-hidden"
          >
            Portfolio
          </Link>
          <DarkModeToggle />
        </div>

        {/* Mobile Hamburger — ukuran lebih besar agar mudah diklik */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-paper-100/80 hover:text-paper-100 focus:outline-none transition-all duration-300 ml-2 p-1"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X size={30} className="rotate-90 transition-transform duration-300" />
          ) : (
            <Menu size={30} className="rotate-0 transition-transform duration-300" />
          )}
        </button>
      </nav>

      {/* Mobile Menu — lebih lebar dan nyaman di HP */}
      <div
        className={`
          fixed top-0 right-0 h-full w-[280px] sm:w-80 
          bg-ink-950/95 backdrop-blur-2xl 
          border-l border-gold-500/10 shadow-2xl z-40 
          transform transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          md:hidden
          flex flex-col items-start gap-6 p-6 pt-24
        `}
      >
        <MobileNavLink to="/" onClick={() => setIsOpen(false)} delay="0ms">
          Home
        </MobileNavLink>
        <MobileNavLink to="/students" onClick={() => setIsOpen(false)} delay="60ms">
          Mahasiswa
        </MobileNavLink>
        <MobileNavLink to="/gallery" onClick={() => setIsOpen(false)} delay="120ms">
          Galeri
        </MobileNavLink>
        <MobileNavLink to="/about" onClick={() => setIsOpen(false)} delay="160ms">
          Tentang
        </MobileNavLink>
        <MobileNavLink
          to="/student-websites"
          onClick={() => setIsOpen(false)}
          delay="200ms"
          className="bg-gold-400 text-ink-950 px-5 py-2.5 rounded-md font-semibold
                     w-full text-center shadow-gold border-transparent
                     hover:bg-gold-300"
        >
          Portfolio
        </MobileNavLink>
        <div className="mt-4 w-full flex justify-center animate-fadeInMobile" style={{ animationDelay: "260ms" }}>
          <DarkModeToggle />
        </div>
        {/* Tambahan footer menu */}
        <div className="mt-auto pt-8 w-full border-t border-paper-100/5 text-center text-paper-100/20 text-xs roll-badge">
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
      className="relative text-paper-100/70 hover:text-paper-100 transition-colors duration-300
                 after:absolute after:left-0 after:-bottom-1 
                 after:w-0 after:h-[2px] 
                 after:bg-gold-400
                 after:transition-all after:duration-300 
                 hover:after:w-full"
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
        text-paper-100/80 hover:text-paper-100 text-xl font-medium 
        border-b border-transparent hover:border-gold-400/50 pb-2 
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