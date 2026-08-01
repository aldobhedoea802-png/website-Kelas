import { useEffect, useState, useRef } from "react";
import api from "../services/api.js";
import { Link } from "react-router-dom";
import { Search, X, Users, User, ArrowLeft, Sparkles, UserPlus, Grid, List } from "lucide-react";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const headerRef = useRef(null);
  const [sortBy, setSortBy] = useState("name");
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
      if (!headerRef.current) return;
      const rect = headerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePosition({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  // Fetch students
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students");
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
        setStudents(data);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.log(err);
      setStudents([]);
    }
    setLoading(false);
  };

  const filteredStudents = students
    .filter((s) => {
      const name = (s?.name || "").toLowerCase();
      return name.includes(search.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        const nameA = (a?.name || "").toLowerCase();
        const nameB = (b?.name || "").toLowerCase();
        return nameA.localeCompare(nameB);
      }
      return 0;
    });

  // Partikel (dikurangi di mobile)
  const particleCount = isMobile ? 15 : 30;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.3 + 0.05,
  }));

  // 🔥 Ambil base URL dari environment variable
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const serverBase = apiBase.replace("/api", ""); // untuk gambar di /uploads

  // Skeleton loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-600 dark:from-gray-900 dark:via-gray-800 dark:to-black p-4 md:p-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-16 gap-4 md:gap-6">
            <div className="w-20 md:w-24 h-8 md:h-10 bg-white/10 rounded-xl animate-pulse"></div>
            <div className="w-48 md:w-64 h-10 md:h-12 bg-white/10 rounded-2xl animate-pulse"></div>
            <div className="w-56 md:w-72 h-10 md:h-12 bg-white/10 rounded-xl animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-3xl animate-pulse">
                <div className="w-6 md:w-8 h-6 md:h-8 bg-white/10 rounded-full mx-auto mb-2 md:mb-3"></div>
                <div className="h-8 md:h-10 bg-white/10 rounded w-16 md:w-20 mx-auto mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-20 md:w-24 mx-auto"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white/10 backdrop-blur-xl p-4 md:p-6 rounded-2xl md:rounded-3xl animate-pulse">
                <div className="w-20 md:w-28 h-20 md:h-28 rounded-full bg-white/10 mx-auto mb-3 md:mb-4"></div>
                <div className="h-4 md:h-5 bg-white/10 rounded w-24 md:w-32 mx-auto mb-2"></div>
                <div className="h-3 bg-white/10 rounded w-16 md:w-20 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-600 dark:from-gray-900 dark:via-gray-800 dark:to-black text-white p-4 md:p-10 overflow-hidden relative">
      {/* Partikel latar */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white/20 animate-float"
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

      {/* Dekorasi blur (lebih kecil di mobile) */}
      <div className="fixed -top-32 md:-top-40 -left-32 md:-left-40 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed top-40 md:top-60 -right-32 md:-right-40 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[400px] md:w-[600px] h-[150px] md:h-[200px] bg-yellow-300/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HEADER */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-16 gap-4 md:gap-6 transition-transform duration-300 ease-out"
          style={{
            transform: isMobile ? 'none' : `translate(${mousePosition.x * -3}px, ${mousePosition.y * -3}px)`,
          }}
        >
          <Link
            to="/"
            className="group flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-white/20 backdrop-blur-xl rounded-xl hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg border border-white/10 text-sm md:text-base"
          >
            <ArrowLeft size={16} className="md:w-[18px] md:h-[18px] group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Home</span>
          </Link>

          <div className="relative text-center">
            <h1 className="text-2xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(251,191,36,0.3)]">
              Mahasiswa SISVOR 009
            </h1>
            <div className="absolute -bottom-1 md:-bottom-2 left-1/2 -translate-x-1/2 w-1/3 md:w-1/2 h-0.5 md:h-1 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full"></div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-end">
            <div className="relative flex-1 md:flex-none w-full md:w-56 lg:w-72">
              <Search size={16} className="md:w-[18px] md:h-[18px] absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Cari..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 md:pl-11 pr-9 md:pr-11 py-2 md:py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all duration-300 placeholder-white/40 shadow-lg text-sm md:text-base"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                >
                  <X size={14} className="md:w-[16px] md:h-[16px]" />
                </button>
              )}
            </div>

            {/* View toggle (lebih kecil di mobile) */}
            <div className="flex bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 p-0.5 md:p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 md:p-2 rounded-lg transition-all duration-300 ${viewMode === "grid" ? "bg-yellow-400/20 text-yellow-300" : "text-white/40 hover:text-white"}`}
              >
                <Grid size={16} className="md:w-[18px] md:h-[18px]" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 md:p-2 rounded-lg transition-all duration-300 ${viewMode === "list" ? "bg-yellow-400/20 text-yellow-300" : "text-white/40 hover:text-white"}`}
              >
                <List size={16} className="md:w-[18px] md:h-[18px]" />
              </button>
            </div>
          </div>
        </div>

        {/* STATISTIK */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-16">
          <StatCard
            icon={Users}
            value={students.length}
            label="Total Mahasiswa"
            color="yellow"
            isMobile={isMobile}
          />
          <StatCard
            icon={Sparkles}
            value="SISVOR"
            label="Program Studi"
            color="purple"
            isMobile={isMobile}
          />
          <StatCard
            icon={UserPlus}
            value="009"
            label="Kelas"
            color="blue"
            isMobile={isMobile}
          />
        </div>

        {/* GRID / LIST MAHASISWA */}
        {filteredStudents.length === 0 ? (
          <div className="text-center text-white/60 mt-16 md:mt-24">
            <div className="text-5xl md:text-7xl mb-4 md:mb-6 animate-bounce">🔎</div>
            <p className="text-lg md:text-xl font-medium">Mahasiswa tidak ditemukan</p>
            <p className="text-white/40 text-xs md:text-sm mt-1 md:mt-2">Coba dengan kata kunci lain</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredStudents.map((s, index) => (
              <StudentCard key={s._id} student={s} index={index} isMobile={isMobile} serverBase={serverBase} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3 md:gap-4">
            {filteredStudents.map((s, index) => (
              <StudentListItem key={s._id} student={s} index={index} isMobile={isMobile} serverBase={serverBase} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 md:mt-16 text-center text-white/20 text-[10px] md:text-xs font-mono tracking-widest flex items-center justify-center gap-3 md:gap-4">
          <span>{filteredStudents.length} dari {students.length} mahasiswa</span>
          <span className="w-px h-2 md:h-3 bg-white/10"></span>
          <span className="text-white/10">✦ SISVOR 009</span>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component (responsive)
function StatCard({ icon: Icon, value, label, color, isMobile }) {
  const borderColor = {
    yellow: "hover:border-yellow-300/30 hover:shadow-yellow-500/10",
    purple: "hover:border-purple-300/30 hover:shadow-purple-500/10",
    blue: "hover:border-blue-300/30 hover:shadow-blue-500/10",
  };

  const iconColor = {
    yellow: "text-yellow-400/70 group-hover:text-yellow-300",
    purple: "text-purple-400/70 group-hover:text-purple-300",
    blue: "text-blue-400/70 group-hover:text-blue-300",
  };

  const textColor = {
    yellow: "text-yellow-400 group-hover:text-yellow-300",
    purple: "text-purple-300 group-hover:text-purple-200",
    blue: "text-blue-300 group-hover:text-blue-200",
  };

  const glowColor = {
    yellow: "bg-yellow-300/10 group-hover:bg-yellow-300/20",
    purple: "bg-purple-300/10 group-hover:bg-purple-300/20",
    blue: "bg-blue-300/10 group-hover:bg-blue-300/20",
  };

  const iconSize = isMobile ? 22 : 28;

  return (
    <div className={`group bg-white/10 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-xl text-center border border-white/10 ${borderColor[color]} transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden`}>
      <div className={`absolute -top-10 -right-10 w-24 md:w-32 h-24 md:h-32 rounded-full blur-2xl ${glowColor[color]} transition-all duration-500`}></div>
      <div className="relative z-10">
        <Icon size={iconSize} className={`${iconColor[color]} mx-auto mb-2 md:mb-3 transition-colors duration-500`} />
        <h2 className={`text-3xl md:text-5xl font-bold ${textColor[color]} transition-colors duration-500`}>
          {value}
        </h2>
        <p className="text-white/60 mt-1 md:mt-2 text-xs md:text-sm">{label}</p>
      </div>
    </div>
  );
}

// Student Card Component (Grid View)
function StudentCard({ student, index, isMobile, serverBase }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: y * -6,
      rotateY: x * 6,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => setIsHovered(true);

  const avatarSize = isMobile ? "w-20 h-20 md:w-32 md:h-32" : "w-28 h-28 md:w-32 md:h-32";
  const textSize = isMobile ? "text-sm md:text-lg" : "text-base md:text-lg";
  const padding = isMobile ? "p-4 md:p-8" : "p-6 md:p-8";
  const iconSize = isMobile ? 32 : 48;

  // 🔥 Perbaiki URL gambar
  const photoUrl = student.photo
    ? `${serverBase}/${student.photo}`.replace(/\/\//g, '/')
    : null;

  return (
    <Link
      to={`/portfolio/${student._id}`}
      className="group block"
      style={{ animationDelay: `${(index % 8) * 80}ms` }}
    >
      <div
        ref={cardRef}
        className={`relative bg-white/10 backdrop-blur-xl ${padding} rounded-2xl md:rounded-3xl border border-white/10 hover:border-yellow-300/30 shadow-lg hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500 hover:-translate-y-2 md:hover:-translate-y-3 flex flex-col items-center text-center overflow-hidden`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: isMobile ? 'none' : '800px',
          transform: isMobile ? 'none' : `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transition: "transform 0.2s ease-out",
        }}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 transition-all duration-700 blur-2xl"></div>
        <div className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 border border-yellow-300/30 transition-all duration-500 pointer-events-none"></div>

        {photoUrl ? (
          <img
            src={photoUrl}
            alt={student.name}
            className={`${avatarSize} rounded-full object-cover mb-3 md:mb-4 border-4 border-white/30 group-hover:border-yellow-300/50 shadow-xl group-hover:scale-110 group-hover:shadow-yellow-500/20 transition-all duration-500`}
            onError={(e) => {
              e.target.src = ''; // fallback ke avatar default
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex'; // tampilkan avatar default
            }}
          />
        ) : null}

        {/* Avatar default (siluet User) — tampil jika foto kosong atau error */}
        <div
          className={`${avatarSize} rounded-full bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 flex items-center justify-center text-white mb-3 md:mb-4 shadow-xl group-hover:scale-110 transition-all duration-500 ${photoUrl ? 'hidden' : ''}`}
        >
          <User size={iconSize} className="text-white/80" />
        </div>

        <h2 className={`${textSize} font-semibold group-hover:text-yellow-300 transition-colors duration-300`}>
          {student?.name || "Nama tidak tersedia"}
        </h2>

        <div className="mt-1 px-2 md:px-3 py-0.5 md:py-1 bg-white/10 rounded-full text-[10px] md:text-xs text-white/50 group-hover:bg-yellow-300/20 group-hover:text-yellow-300 transition-all duration-300">
          Portfolio
        </div>

        <div className="mt-3 md:mt-4">
          <span className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2 bg-gradient-to-r from-yellow-300 to-orange-400 text-black text-[10px] md:text-sm font-semibold rounded-full shadow-lg shadow-yellow-500/20 group-hover:scale-105 group-hover:shadow-yellow-400/40 transition-all duration-300">
            Lihat
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

// Student List Item Component
function StudentListItem({ student, index, isMobile, serverBase }) {
  const avatarSize = isMobile ? "w-12 h-12 md:w-16 md:h-16" : "w-14 h-14 md:w-16 md:h-16";
  const padding = isMobile ? "p-3 md:p-6" : "p-4 md:p-6";
  const gap = isMobile ? "gap-3 md:gap-6" : "gap-4 md:gap-6";
  const iconSize = isMobile ? 20 : 28;

  // 🔥 Perbaiki URL gambar
  const photoUrl = student.photo
    ? `${serverBase}/${student.photo}`.replace(/\/\//g, '/')
    : null;

  return (
    <Link
      to={`/portfolio/${student._id}`}
      className={`group bg-white/10 backdrop-blur-xl ${padding} rounded-2xl border border-white/10 hover:border-yellow-300/30 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-500 hover:-translate-y-1 flex items-center ${gap} animate-fadeUp`}
      style={{ animationDelay: `${(index % 8) * 80}ms` }}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={student.name}
          className={`${avatarSize} rounded-full object-cover border-2 border-white/30 group-hover:border-yellow-300/50 transition-all duration-300`}
          onError={(e) => {
            e.target.src = '';
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}

      <div
        className={`${avatarSize} rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 flex items-center justify-center text-white ${photoUrl ? 'hidden' : ''}`}
      >
        <User size={iconSize} className="text-white/80" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm md:text-base font-semibold group-hover:text-yellow-300 transition-colors duration-300 truncate">
          {student?.name || "Nama tidak tersedia"}
        </h3>
        <p className="text-white/40 text-[10px] md:text-sm truncate">Portfolio Mahasiswa</p>
      </div>

      <span className="px-3 md:px-4 py-1.5 md:py-2 bg-yellow-400/20 text-yellow-300 text-[10px] md:text-sm rounded-full group-hover:bg-yellow-400/30 transition-all duration-300 whitespace-nowrap">
        Lihat →
      </span>
    </Link>
  );
}

export default Students;