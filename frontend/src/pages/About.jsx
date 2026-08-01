import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  FolderOpen,
  Star,
  Sparkles,
  Rocket,
  Heart,
  User,
  Mail,
  Github,
  Instagram,
  Twitter,
  Award,
  Target,
  Zap,
  CheckCircle,
  Code,
  ArrowUp,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import api from "../services/api.js";

function About() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);
  const [hoveredMember, setHoveredMember] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
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

  // 🔥 State untuk data statistik real
  const [studentCount, setStudentCount] = useState(26);
  const [portfolioCount, setPortfolioCount] = useState(1);
  const [loadingStats, setLoadingStats] = useState(true);

  // 🔥 Ambil data real dari API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, websitesRes] = await Promise.all([
          api.get("/students"),
          api.get("/student-websites"),
        ]);

        const extractData = (response) => {
          if (Array.isArray(response)) return response;
          if (response?.data) {
            if (Array.isArray(response.data)) return response.data;
            if (response.data.data && Array.isArray(response.data.data)) {
              return response.data.data;
            }
            for (const key of Object.keys(response.data)) {
              if (Array.isArray(response.data[key])) {
                return response.data[key];
              }
            }
          }
          for (const key of Object.keys(response)) {
            if (Array.isArray(response[key])) {
              return response[key];
            }
          }
          return [];
        };

        const studentsData = extractData(studentsRes.data);
        const websitesData = extractData(websitesRes.data);

        const sCount = studentsData.length || 26;
        const pCount = websitesData.length || 1;

        setStudentCount(sCount);
        setPortfolioCount(pCount);
        setLoadingStats(false);
      } catch (err) {
        console.error("Gagal fetch stats di About:", err);
        setStudentCount(26);
        setPortfolioCount(1);
        setLoadingStats(false);
      }
    };

    fetchStats();
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

  // Intersection Observer untuk statistik
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Partikel dikurangi di mobile
  const particleCount = isMobile ? 20 : 80;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    size: Math.random() * 5 + 1,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 25 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.4 + 0.05,
    type: Math.random() > 0.6 ? "sparkle" : "dot",
    color: ["yellow-300", "pink-400", "purple-400", "blue-400", "white", "teal-400"][
      Math.floor(Math.random() * 6)
    ],
  }));

  // 🔥 Tim pengembang
  const teamMembers = [
    {
      name: "Muhammad Saipul Ikhrom",
      role: "UI/UX · DevOps · Design Lead",
      avatar: "🎨",
      color: "from-yellow-400 to-orange-400",
      bio: "UI/UX Designer, DevOps Engineer, Design Lead",
      skills: ["Figma", "CI/CD", "Design System"],
    },
    {
      name: "Aldo Feriansyah",
      role: "Frontend · Backend · Fullstack",
      avatar: "👨‍💻",
      color: "from-blue-400 to-cyan-400",
      bio: "Frontend, Backend, Fullstack Developer",
      skills: ["React", "Node.js", "MongoDB"],
    },
  ];

  // Blur dekorasi hanya di desktop
  const blurDecorations = !isMobile ? (
    <>
      <div
        className="fixed -top-40 -left-40 w-[700px] h-[700px] bg-purple-500/15 rounded-full blur-3xl pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePosition.x * -35}px, ${mousePosition.y * -35}px)`,
        }}
      />
      <div
        className="fixed top-60 -right-40 w-[700px] h-[700px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 35}px, ${mousePosition.y * -35}px)`,
        }}
      />
      <div
        className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-yellow-300/10 rounded-full blur-3xl pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePosition.x * -45}px, ${mousePosition.y * 45}px)`,
        }}
      />
    </>
  ) : null;

  // Mouse follower glow (nonaktif di mobile)
  const mouseGlow = !isMobile ? (
    <div
      className="fixed w-96 h-96 rounded-full pointer-events-none transition-transform duration-300 ease-out blur-3xl opacity-20"
      style={{
        background: 'radial-gradient(circle, rgba(251,191,36,0.4), transparent 70%)',
        transform: `translate(${mousePosition.x * 30 - 200}px, ${mousePosition.y * 30 - 200}px)`,
      }}
    />
  ) : null;

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-600 dark:from-gray-900 dark:via-gray-800 dark:to-black text-white p-3 sm:p-4 md:p-10 overflow-hidden relative"
    >
      {/* Background pattern grid */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      {/* Mouse follower glow */}
      {mouseGlow}

      {/* Background animasi gradien */}
      <div className="fixed inset-0 bg-[length:400%_400%] animate-gradient-slow bg-gradient-to-br from-indigo-700/20 via-purple-700/20 to-blue-600/20 dark:from-gray-900/20 dark:via-gray-800/20 dark:to-black/20 pointer-events-none"></div>

      {/* Partikel */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className={`absolute rounded-full ${
              p.type === "sparkle"
                ? `bg-${p.color}/40 animate-twinkle`
                : `bg-white/20 animate-float`
            }`}
            style={{
              width: p.size,
              height: p.size,
              top: p.top + "%",
              left: p.left + "%",
              animationDuration: p.duration + "s",
              animationDelay: p.delay + "s",
              opacity: p.opacity,
              ...(p.type === "sparkle" && {
                boxShadow: `0 0 20px rgba(251,191,36,0.2)`,
              }),
            }}
          />
        ))}
      </div>

      {/* Dekorasi blur */}
      {blurDecorations}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Button */}
        <Link
          to="/"
          className="group inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 bg-white/20 backdrop-blur-xl rounded-xl hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg border border-white/10 mb-4 sm:mb-6 md:mb-12 text-xs sm:text-sm md:text-base"
        >
          <ArrowLeft size={14} className="sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px] group-hover:-translate-x-1 transition-transform" />
          <span>Kembali</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-10 md:mb-16 animate-fadeUp">
          <div className="inline-block relative">
            <span className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 md:-top-10 md:-right-10 text-3xl sm:text-4xl md:text-6xl opacity-20 animate-pulse">✦</span>
            <span className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 md:-bottom-10 md:-left-10 text-3xl sm:text-4xl md:text-6xl opacity-20 animate-pulse delay-1000">✦</span>
            <h1 className="text-xl sm:text-2xl md:text-7xl font-extrabold bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent drop-shadow-[0_4px_40px_rgba(251,191,36,0.3)]">
              Tentang SISVOR 009
            </h1>
            <div className="absolute -bottom-1.5 sm:-bottom-2 left-1/2 -translate-x-1/2 w-1/4 sm:w-1/3 md:w-1/2 h-0.5 sm:h-0.5 md:h-1 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full"></div>
          </div>
          <p className="text-white/50 mt-2 sm:mt-3 md:mt-6 max-w-xl mx-auto text-[10px] sm:text-xs md:text-sm flex items-center justify-center gap-1.5 sm:gap-2">
            <Sparkles size={10} className="sm:w-[12px] sm:h-[12px] md:w-[16px] md:h-[16px] text-yellow-400/60 animate-pulse" />
            Mengenal lebih dekat komunitas SISVOR 009
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 sm:space-y-8 md:space-y-14">
          {/* Deskripsi */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 rounded-2xl sm:rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
            <div className="relative bg-white/10 backdrop-blur-xl p-4 sm:p-5 md:p-12 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl hover:border-yellow-300/20 transition-all duration-500 hover:scale-[1.01] animate-fadeUp delay-200">
              <h2 className="text-sm sm:text-base md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 flex items-center gap-1.5 sm:gap-2">
                <Sparkles size={16} className="sm:w-[18px] sm:h-[18px] md:w-[24px] md:h-[24px] text-yellow-400/70" />
                Tentang Kami
              </h2>
              <p className="text-white/70 leading-relaxed text-xs sm:text-sm md:text-base">
                <span className="font-semibold text-yellow-300">SISVOR 009</span> "Kelas yang tak hanya mengajarkan arti kebersamaan, tetapi juga mengajarkan bahwa waktu bisa mengambil siapa saja tanpa sempat memberi kita kesempatan untuk benar-benar siap."
              </p>
            </div>
          </div>

          {/* Visi & Misi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div className="group relative animate-fadeUp delay-300">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-300/30 to-orange-400/30 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-xl p-4 sm:p-5 md:p-8 rounded-2xl sm:rounded-3xl border border-white/10 hover:border-yellow-300/30 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/10">
                <div className="text-3xl sm:text-4xl md:text-5xl mb-1.5 sm:mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">🚀</div>
                <h3 className="text-sm sm:text-base md:text-xl font-bold mb-1.5 sm:mb-2 md:mb-3 text-yellow-300">Visi</h3>
                <p className="text-white/60 text-[10px] sm:text-xs md:text-sm leading-relaxed">
                  "menjadikan bangku kuliah sebagai tempat bertumbuh, bukan sekedar tempat singgah menuju gelar."
                </p>
                <div className="mt-2 sm:mt-3 md:mt-4 flex items-center gap-1.5 sm:gap-2 text-yellow-400/30">
                  <Target size={10} className="sm:w-[12px] sm:h-[12px] md:w-[14px] md:h-[14px]" />
                  <span className="text-[7px] sm:text-[8px] md:text-[10px]">Target 2025</span>
                </div>
              </div>
            </div>
            <div className="group relative animate-fadeUp delay-400">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-xl p-4 sm:p-5 md:p-8 rounded-2xl sm:rounded-3xl border border-white/10 hover:border-pink-300/30 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/10">
                <div className="text-3xl sm:text-4xl md:text-5xl mb-1.5 sm:mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">🎯</div>
                <h3 className="text-sm sm:text-base md:text-xl font-bold mb-1.5 sm:mb-2 md:mb-3 text-pink-300">Misi</h3>
                <p className="text-white/60 text-[10px] sm:text-xs md:text-sm leading-relaxed">
                  "datang membawa mimpi, pulang membawa versi terbaik dari diri sendiri."
                </p>
              </div>
            </div>
          </div>

          {/* Statistik */}
          <div
            ref={statsRef}
            className="bg-gradient-to-r from-yellow-300/5 via-pink-400/5 to-purple-400/5 backdrop-blur-xl p-4 sm:p-5 md:p-8 rounded-2xl sm:rounded-3xl border border-white/10 hover:border-yellow-300/20 transition-all duration-500 animate-fadeUp delay-500"
          >
            <h2 className="text-sm sm:text-base md:text-2xl font-bold mb-3 sm:mb-5 md:mb-8 text-center flex items-center justify-center gap-1.5 sm:gap-2">
              <Rocket size={16} className="sm:w-[18px] sm:h-[18px] md:w-[24px] md:h-[24px] text-yellow-400/70" />
              Komunitas Kami
            </h2>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-6 text-center">
              <StatItem
                icon={<Users size={22} className="sm:w-[26px] sm:h-[26px] md:w-[32px] md:h-[32px] text-yellow-400/70" />}
                value={studentCount + "+"}
                label="Mahasiswa"
                isVisible={isVisible}
                color="text-yellow-400"
                delay={0}
              />
              <StatItem
                icon={<FolderOpen size={22} className="sm:w-[26px] sm:h-[26px] md:w-[32px] md:h-[32px] text-pink-400/70" />}
                value={portfolioCount + "+"}
                label="Portfolio"
                isVisible={isVisible}
                color="text-pink-400"
                delay={300}
              />
              <StatItem
                icon={<Star size={22} className="sm:w-[26px] sm:h-[26px] md:w-[32px] md:h-[32px] text-purple-400/70" />}
                value="100%"
                label="Solid Team"
                isVisible={isVisible}
                color="text-purple-400"
                delay={600}
              />
            </div>
          </div>

          {/* Team Section */}
          <div className="animate-fadeUp delay-600">
            <h2 className="text-sm sm:text-base md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 text-center flex items-center justify-center gap-1.5 sm:gap-2">
              <User size={16} className="sm:w-[18px] sm:h-[18px] md:w-[24px] md:h-[24px] text-yellow-400/70" />
              Tim Pengembang
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-3xl mx-auto">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="group relative bg-white/10 backdrop-blur-xl p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-white/10 hover:border-yellow-300/30 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 md:hover:-translate-y-3 hover:shadow-2xl hover:shadow-yellow-500/10 text-center cursor-pointer"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  onMouseEnter={() => setHoveredMember(index)}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-20 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 transition-opacity duration-700"></div>
                  <div className="relative z-10">
                    <div className="text-3xl sm:text-4xl md:text-5xl mb-1.5 sm:mb-2 md:mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">{member.avatar}</div>
                    <p className="text-xs sm:text-sm md:text-base font-bold text-white/90 group-hover:text-yellow-300 transition-colors">{member.name}</p>
                    <p className="text-[8px] sm:text-[10px] md:text-xs text-white/50 leading-relaxed">{member.role}</p>
                    <div className={`mt-1.5 sm:mt-2 h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${member.color} rounded-full mx-auto`}></div>
                    {hoveredMember === index && (
                      <div className="mt-1.5 sm:mt-2 md:mt-3 space-y-0.5 sm:space-y-1 animate-fadeUp">
                        <p className="text-[7px] sm:text-[8px] md:text-[10px] text-white/60">{member.bio}</p>
                        <div className="flex justify-center gap-1 sm:gap-1.5 md:gap-2 text-[5px] sm:text-[6px] md:text-[8px] text-white/30">
                          {member.skills.map((skill, i) => (
                            <span key={i} className="px-1 sm:px-1.5 md:px-2 py-0.5 bg-white/10 rounded-full border border-white/10">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimoni */}
          <div className="relative animate-fadeUp delay-650">
            <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 md:-top-8 md:-left-8 text-4xl sm:text-5xl md:text-7xl text-yellow-400/20 font-serif">"</div>
            <div className="bg-white/10 backdrop-blur-xl p-4 sm:p-5 md:p-10 rounded-2xl sm:rounded-3xl border border-white/10 hover:border-yellow-300/20 transition-all duration-500 text-center hover:scale-[1.01] hover:shadow-2xl">
              <p className="text-white/70 text-xs sm:text-sm md:text-lg italic max-w-2xl mx-auto leading-relaxed">
                "Bersama SISVOR 009, kami belajar bahwa kolaborasi adalah kunci untuk menciptakan 
                hal-hal luar biasa. Setiap karya adalah langkah menuju masa depan yang lebih cerah."
              </p>
              <div className="mt-3 sm:mt-4 md:mt-6 flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3">
                <div className="w-6 sm:w-8 md:w-12 h-0.5 bg-gradient-to-r from-transparent to-yellow-400/50"></div>
                <span className="text-white/40 text-[10px] sm:text-xs md:text-sm font-medium">— Tim SISVOR 009</span>
                <div className="w-6 sm:w-8 md:w-12 h-0.5 bg-gradient-to-l from-transparent to-yellow-400/50"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-12 md:mt-20 text-center text-white/20 text-[8px] sm:text-xs font-mono flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3">
          <p className="text-[10px] sm:text-xs md:text-sm text-white/30 font-semibold tracking-wider">SISVOR 009</p>
          <p className="text-[7px] sm:text-[8px] md:text-[10px]">© {new Date().getFullYear()} — Built with ❤️</p>
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 text-[7px] sm:text-[8px] md:text-[10px] text-white/10">
            <span className="hover:text-white/30 transition-colors">React</span>
            <span className="w-px h-1.5 sm:h-2 bg-white/10"></span>
            <span className="hover:text-white/30 transition-colors">Node.js</span>
            <span className="w-px h-1.5 sm:h-2 bg-white/10"></span>
            <span className="hover:text-white/30 transition-colors">MongoDB</span>
            <span className="w-px h-1.5 sm:h-2 bg-white/10"></span>
            <span className="hover:text-white/30 transition-colors">Tailwind</span>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 p-2 sm:p-2.5 md:p-3 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 text-black shadow-lg shadow-yellow-500/20 hover:scale-110 transition-all duration-300 ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={14} className="sm:w-[16px] sm:h-[16px] md:w-[20px] md:h-[20px]" />
      </button>
    </div>
  );
}

// Komponen Stat Item dengan animasi counter
function StatItem({ icon, value, label, isVisible, color, delay = 0 }) {
  const [count, setCount] = useState(0);
  const target = parseInt(value) || 0;
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [isVisible, delay]);

  useEffect(() => {
    if (!started) return;
    const duration = 1500;
    const steps = 40;
    const stepTime = duration / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setCount(Math.floor(current));
    }, stepTime);
    return () => clearInterval(interval);
  }, [started, target]);

  return (
    <div className="group hover:scale-110 transition-transform duration-300">
      <div className="flex justify-center mb-1 sm:mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className={`text-xl sm:text-2xl md:text-5xl font-extrabold ${color} drop-shadow-[0_2px_20px_rgba(251,191,36,0.2)]`}>
        {value.includes('%') ? count + '%' : count + '+'}
      </div>
      <div className="text-white/40 text-[8px] sm:text-[10px] md:text-sm mt-0.5 sm:mt-1">{label}</div>
    </div>
  );
}

export default About;