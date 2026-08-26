import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  ArrowLeft,
  Search,
  X,
  Grid,
  List,
  ExternalLink,
  Image,
  User,
  Sparkles,
  LayoutGrid,
} from "lucide-react";

function StudentWebsites() {
  const [websites, setWebsites] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [sortBy, setSortBy] = useState("name");
  const headerRef = useRef(null);
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

  // Parallax header (nonaktif di mobile)
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e) => {
      if (!headerRef.current) return;
      const rect = headerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePosition({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  // Fetch data
  useEffect(() => {
    api
      .get("/student-websites")
      .then((res) => {
        let data = res.data;
        if (data && data.data && Array.isArray(data.data)) {
          data = data.data;
        } else if (data && !Array.isArray(data) && typeof data === "object") {
          for (const key of Object.keys(data)) {
            if (Array.isArray(data[key])) {
              data = data[key];
              break;
            }
          }
        }
        if (Array.isArray(data)) {
          setWebsites(data);
        } else {
          setWebsites([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // Filter & Sort
  const filteredWebsites = websites
    .filter((w) => (w.name?.toLowerCase() || "").includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (sortBy === "latest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      return 0;
    });

  // Partikel (dikurangi di mobile)
  const particleCount = isMobile ? 20 : 35;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.3 + 0.05,
  }));

  // Skeleton loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ink-600 via-teal-600 to-ink-500 dark:from-ink-950 dark:via-ink-900 dark:to-ink-950 p-4 md:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-12 gap-4 md:gap-6">
            <div className="w-20 md:w-24 h-8 md:h-10 bg-paper-100/10 rounded-xl animate-pulse"></div>
            <div className="w-40 md:w-48 h-8 md:h-12 bg-paper-100/10 rounded-2xl animate-pulse"></div>
            <div className="w-full md:w-72 h-10 md:h-12 bg-paper-100/10 rounded-full animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-paper-100/10 backdrop-blur-md rounded-2xl md:rounded-3xl overflow-hidden animate-pulse">
                <div className="h-[140px] md:h-[220px] bg-paper-100/10"></div>
                <div className="p-3 md:p-5 space-y-2 md:space-y-3">
                  <div className="h-4 md:h-5 bg-paper-100/10 rounded w-3/4"></div>
                  <div className="h-7 md:h-10 bg-paper-100/10 rounded-full w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-ink-600 via-teal-600 to-ink-500 dark:from-ink-950 dark:via-ink-900 dark:to-ink-950 text-paper-100 overflow-hidden">
      {/* Partikel latar */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-paper-100/20 animate-float"
            style={{
              width: p.size,
              height: p.size,
              top: p.top + "%",
              left: p.left + "%",
              animationDuration: p.duration + "s",
              animationDelay: p.delay + "s",
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* Background glow — lebih kecil di mobile */}
      <div className="fixed -top-40 -left-40 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-teal-500/30 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="fixed top-60 -right-40 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-ink-500/30 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[400px] md:w-[600px] h-[100px] md:h-[200px] bg-gold-400/10 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Navbar — lebih ringkas di mobile */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-paper-100/10 dark:bg-ink-950/30 border-b border-paper-100/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 md:py-4 flex items-center justify-between">
          <Link
            to="/"
            className="group flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-full bg-paper-100/20 backdrop-blur border border-paper-100/20 hover:bg-teal-500 hover:border-teal-400 transition-all duration-300 shadow-lg hover:shadow-teal-500/20"
          >
            <ArrowLeft size={14} className="md:w-[16px] md:h-[16px] group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs md:text-sm font-medium">Home</span>
          </Link>
          <div className="text-[10px] md:text-sm text-paper-100/50 tracking-wider font-mono flex items-center gap-1.5 md:gap-2">
            <Sparkles size={12} className="md:w-[14px] md:h-[14px] text-gold-500/60" />
            <span className="hidden xs:inline">SISVOR 009</span>
            <span className="xs:hidden">SISVOR</span>
          </div>
        </div>
      </div>

      {/* Hero — lebih ringkas di mobile */}
      <div
        ref={headerRef}
        className="relative text-center pt-28 md:pt-44 pb-8 md:pb-20 px-4 md:px-6 transition-transform duration-300 ease-out"
        style={{
          transform: isMobile ? 'none' : `translate(${mousePosition.x * -3}px, ${mousePosition.y * -3}px)`,
        }}
      >
        <h1 className="font-display text-2xl md:text-6xl lg:text-7xl font-semibold mb-2 md:mb-4 bg-gradient-to-r from-gold-400 via-coral-400 to-ink-400 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(251,191,36,0.2)]">
          {isMobile ? "Portfolio" : "Portfolio Showcase"}
        </h1>
        <p className="text-paper-100/60 text-xs md:text-lg max-w-xl mx-auto flex items-center justify-center gap-1.5 md:gap-2 flex-wrap">
          <span>Galeri portfolio mahasiswa</span>
          <span className="text-gold-400 font-semibold">SISVOR 009</span>
        </p>

        {/* Search & Controls — stack di mobile */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-4 mt-4 md:mt-8 max-w-2xl mx-auto w-full px-1">
          <div className="relative w-full">
            <Search size={isMobile ? 14 : 18} className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-paper-100/40" />
            <input
              type="text"
              placeholder="Cari mahasiswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 md:pl-11 pr-8 md:pr-11 py-2 md:py-3.5 text-sm md:text-base rounded-full bg-paper-100/10 backdrop-blur-xl border border-paper-100/10 focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none transition-all placeholder-white/40 shadow-lg"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-paper-100/40 hover:text-paper-100 transition"
              >
                <X size={isMobile ? 12 : 16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            {/* View toggle */}
            <div className="flex bg-paper-100/10 backdrop-blur-xl rounded-full border border-paper-100/10 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 md:p-2 rounded-full transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-teal-500/30 text-teal-300"
                    : "text-paper-100/40 hover:text-paper-100"
                }`}
              >
                <Grid size={isMobile ? 14 : 18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 md:p-2 rounded-full transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-teal-500/30 text-teal-300"
                    : "text-paper-100/40 hover:text-paper-100"
                }`}
              >
                <List size={isMobile ? 14 : 18} />
              </button>
            </div>

            {/* Sort dropdown — lebih kecil di mobile */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 md:px-4 py-1.5 md:py-3 rounded-full bg-paper-100/10 backdrop-blur-xl border border-paper-100/10 focus:ring-2 focus:ring-teal-400 outline-none text-xs md:text-sm text-paper-100/80 appearance-none cursor-pointer transition-all hover:border-teal-400/30 flex-1 sm:flex-none"
            >
              <option value="name" className="bg-ink-900">Nama</option>
              <option value="latest" className="bg-ink-900">Terbaru</option>
            </select>
          </div>
        </div>

        {/* Stats — lebih kecil di mobile */}
        <div className="flex items-center justify-center gap-3 md:gap-6 mt-3 md:mt-6 text-[10px] md:text-sm text-paper-100/40">
          <span className="flex items-center gap-0.5 md:gap-1">
            <LayoutGrid size={isMobile ? 10 : 14} />
            {filteredWebsites.length} portfolio
          </span>
          <span className="w-px h-3 md:h-4 bg-paper-100/10"></span>
          <span className="flex items-center gap-0.5 md:gap-1">
            <User size={isMobile ? 10 : 14} />
            {websites.length} mahasiswa
          </span>
        </div>
      </div>

      {/* Grid / List */}
      <div className="max-w-7xl mx-auto px-3 md:px-10 pb-16 md:pb-28">
        {filteredWebsites.length === 0 ? (
          <div className="text-center text-paper-100/60 mt-10 md:mt-16">
            <div className="text-5xl md:text-7xl mb-4 md:mb-6 animate-bounce">🔎</div>
            <p className="text-base md:text-xl font-medium">Portfolio tidak ditemukan</p>
            <p className="text-paper-100/40 text-xs md:text-sm mt-1 md:mt-2">Coba dengan kata kunci lain</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {filteredWebsites.map((w, index) => (
              <WebsiteCard key={w._id} website={w} index={index} isMobile={isMobile} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 md:gap-4">
            {filteredWebsites.map((w, index) => (
              <WebsiteListItem key={w._id} website={w} index={index} isMobile={isMobile} />
            ))}
          </div>
        )}
      </div>

      {/* Footer — lebih ringkas di mobile */}
      <footer className="border-t border-paper-100/10 py-8 md:py-12 text-center">
        <p className="text-sm md:text-base font-semibold text-paper-100/60">SISVOR 009 Portfolio Showcase</p>
        <p className="mt-1 md:mt-2 text-[10px] md:text-xs text-paper-100/30 flex items-center justify-center gap-2 md:gap-3 flex-wrap">
          <span>React</span>
          <span className="w-px h-2 md:h-3 bg-paper-100/10"></span>
          <span>Node</span>
          <span className="w-px h-2 md:h-3 bg-paper-100/10"></span>
          <span>MongoDB</span>
          <span className="w-px h-2 md:h-3 bg-paper-100/10"></span>
          <span>Express</span>
        </p>
      </footer>
    </div>
  );
}

// Website Card (Grid View)
function WebsiteCard({ website, index, isMobile }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: y * -8,
      rotateY: x * 8,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => setIsHovered(true);

  // 🔥 Gunakan path absolut untuk gambar (akan diproxy oleh Vite)
  const imageUrl = website.photo
    ? `/uploads/websites/${website.photo}`
    : "https://via.placeholder.com/400x250?text=Portfolio";

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden rounded-2xl md:rounded-3xl bg-paper-100/10 backdrop-blur-md border border-paper-100/10 hover:border-teal-400/50 transition-all duration-500 animate-fadeUp"
      style={{
        animationDelay: `${(index % 8) * 80}ms`,
        perspective: isMobile ? 'none' : '800px',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          transform: isMobile ? 'none' : `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
          transition: "transform 0.2s ease-out",
        }}
      >
        {/* Image — lebih kecil di mobile */}
        <div className="overflow-hidden">
          <img
            src={imageUrl}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x250?text=Portfolio";
            }}
            className="w-full h-[140px] md:h-[220px] object-cover transition-all duration-700 group-hover:scale-110"
            alt={website.name}
          />
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-r from-gold-500 via-coral-500 to-teal-500 blur-2xl transition-opacity duration-500 pointer-events-none"></div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Badge */}
        <div className="absolute top-2 left-2 md:top-3 md:left-3 text-[8px] md:text-xs bg-ink-950/60 px-2 md:px-3 py-0.5 md:py-1 rounded-full backdrop-blur-sm border border-paper-100/10">
          Portfolio
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 flex items-center justify-between translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <h2 className="text-xs md:text-lg font-semibold text-paper-100 drop-shadow-lg truncate max-w-[100px] md:max-w-[150px]">
              {website.name}
            </h2>
          </div>
          <a
            href={website.website}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-paper-100/20 backdrop-blur-sm hover:bg-teal-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-teal-500/20"
          >
            <ExternalLink size={isMobile ? 12 : 18} className="text-paper-100" />
          </a>
        </div>

        {/* Border glow on hover */}
        <div className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 border-2 border-teal-400/30 transition-opacity duration-500 pointer-events-none"></div>
      </div>
    </div>
  );
}

// Website List Item — lebih compact di mobile
function WebsiteListItem({ website, index, isMobile }) {
  // 🔥 Gunakan path absolut untuk gambar
  const imageUrl = website.photo
    ? `/uploads/websites/${website.photo}`
    : "https://via.placeholder.com/80x80?text=Portfolio";

  return (
    <div
      className="group bg-paper-100/10 backdrop-blur-md p-2.5 md:p-4 rounded-xl md:rounded-2xl border border-paper-100/10 hover:border-teal-400/30 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-500 hover:-translate-y-1 flex items-center gap-2 md:gap-4 animate-fadeUp"
      style={{ animationDelay: `${(index % 8) * 80}ms` }}
    >
      {/* Thumbnail — lebih kecil di mobile */}
      <img
        src={imageUrl}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/60x60?text=Portfolio";
        }}
        className="w-10 h-10 md:w-16 md:h-16 rounded-lg md:rounded-xl object-cover border border-paper-100/10 group-hover:border-teal-400/30 transition-all duration-300 flex-shrink-0"
        alt={website.name}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-xs md:text-base font-semibold group-hover:text-teal-300 transition-colors duration-300 truncate">
          {website.name}
        </h3>
        <p className="text-[8px] md:text-sm text-paper-100/40 truncate">Portfolio Mahasiswa</p>
      </div>

      {/* Action — lebih kecil di mobile */}
      <a
        href={website.website}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 bg-teal-500/20 text-teal-300 rounded-full hover:bg-teal-500/30 transition-all duration-300 hover:scale-105 text-[8px] md:text-sm font-medium whitespace-nowrap"
      >
        <span className="hidden xs:inline">Kunjungi</span>
        <span className="xs:hidden">Buka</span>
        <ExternalLink size={isMobile ? 10 : 14} />
      </a>
    </div>
  );
}

export default StudentWebsites;