import { useState, useEffect, useRef } from "react";
import { Users, FolderOpen, Star, RefreshCw } from "lucide-react";
import api from "../services/api.js";

function Stats() {
  const [stats, setStats] = useState([
    { num: 0, label: "Mahasiswa", icon: Users, suffix: "+" },
    { num: 0, label: "Portfolio", icon: FolderOpen, suffix: "+" },
    { num: 100, label: "Solid Team", icon: Star, suffix: "%" },
  ]);
  const [counts, setCounts] = useState([0, 0, 100]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState("loading");
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 🔥 Ekstrak array dari response dengan log
  const extractData = (response) => {
    console.log("🔍 extractData input:", response);
    if (Array.isArray(response)) {
      console.log("✅ Response langsung array");
      return response;
    }
    if (response && typeof response === "object") {
      // Cek response.data
      if (response.data) {
        console.log("🔍 Memeriksa response.data");
        if (Array.isArray(response.data)) {
          console.log("✅ response.data adalah array");
          return response.data;
        }
        if (response.data.data && Array.isArray(response.data.data)) {
          console.log("✅ response.data.data adalah array");
          return response.data.data;
        }
        for (const key of Object.keys(response.data)) {
          if (Array.isArray(response.data[key])) {
            console.log(`✅ Found array in response.data.${key}`);
            return response.data[key];
          }
        }
      }
      // Cari properti lain
      for (const key of Object.keys(response)) {
        if (Array.isArray(response[key])) {
          console.log(`✅ Found array in response.${key}`);
          return response[key];
        }
      }
    }
    console.warn("⚠️ Tidak menemukan array, return []");
    return [];
  };

  // 🔥 Fetch data
  const fetchStats = async () => {
    setLoading(true);
    try {
      console.log("📊 Fetching stats...");
      const [studentsRes, websitesRes] = await Promise.all([
        api.get("/students"),
        api.get("/student-websites"),
      ]);

      console.log("📥 Students raw:", studentsRes.data);
      console.log("📥 Websites raw:", websitesRes.data);

      const studentsData = extractData(studentsRes.data);
      const websitesData = extractData(websitesRes.data);

      console.log("✅ Students array:", studentsData);
      console.log("✅ Websites array:", websitesData);

      let studentCount = studentsData.length;
      let portfolioCount = websitesData.length;

      console.log(`📊 Student count: ${studentCount}, Portfolio count: ${portfolioCount}`);

      // 🔥 FALLBACK: jika 0, gunakan 26 dan 1
      if (studentCount === 0) {
        console.log("⚠️ Student count 0, fallback ke 26");
        studentCount = 26;
      }
      if (portfolioCount === 0) {
        console.log("⚠️ Portfolio count 0, fallback ke 1");
        portfolioCount = 1;
      }

      setDataSource(studentCount === 26 && portfolioCount === 1 ? "fallback" : "api");

      const newStats = [
        { num: studentCount, label: "Mahasiswa", icon: Users, suffix: "+" },
        { num: portfolioCount, label: "Portfolio", icon: FolderOpen, suffix: "+" },
        { num: 100, label: "Solid Team", icon: Star, suffix: "%" },
      ];

      setStats(newStats);
      // 🔥 Reset counts agar animasi ulang
      setCounts([0, 0, 100]);

      setLoading(false);
    } catch (err) {
      console.error("❌ Error:", err);
      // Fallback total
      setStats([
        { num: 26, label: "Mahasiswa", icon: Users, suffix: "+" },
        { num: 1, label: "Portfolio", icon: FolderOpen, suffix: "+" },
        { num: 100, label: "Solid Team", icon: Star, suffix: "%" },
      ]);
      setCounts([0, 0, 100]);
      setDataSource("fallback");
      setLoading(false);
    }
  };

  // 🔥 Ambil data saat mount
  useEffect(() => {
    fetchStats();
  }, []);

  // 🔥 Intersection Observer - threshold 0.1 agar lebih sensitif
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log("👀 Section visible, isVisible => true");
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      console.log("👀 Observer attached to section");
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // 🔥 Fallback: jika setelah 1 detik loading selesai dan isVisible masih false, set true
  useEffect(() => {
    if (!loading && !isVisible) {
      const timer = setTimeout(() => {
        console.log("⏰ Fallback: set isVisible true setelah 1 detik");
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, isVisible]);

  // 🔥 Animasi counter
  useEffect(() => {
    console.log("🔥 useEffect animasi: isVisible=", isVisible, "loading=", loading, "stats=", stats);
    if (!isVisible || loading) {
      console.log("⏸️ Animasi ditunda");
      return;
    }
    if (stats[0].num === 0 && stats[1].num === 0) {
      console.log("⏸️ Stats masih 0, skip animasi");
      return;
    }

    console.log("🔥 Memulai animasi counter untuk stats:", stats);

    // Reset counts ke 0 dulu
    setCounts([0, 0, 100]);

    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;

    const intervals = stats.map((stat, index) => {
      let current = 0;
      const increment = stat.num / steps;
      return setInterval(() => {
        current += increment;
        if (current >= stat.num) {
          current = stat.num;
          clearInterval(intervals[index]);
        }
        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[index] = Math.floor(current);
          return newCounts;
        });
      }, stepTime);
    });

    return () => intervals.forEach((interval) => clearInterval(interval));
  }, [isVisible, loading, stats]);

  // Loading state
  if (loading) {
    return (
      <section className="max-w-5xl mx-auto mt-20 md:mt-36 px-4 md:px-10 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-paper-100/5 backdrop-blur-xl p-6 md:p-10 rounded-3xl border border-paper-100/10 animate-pulse"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-paper-100/10 rounded-full mx-auto mb-3 md:mb-4"></div>
              <div className="h-8 md:h-10 bg-paper-100/10 rounded w-20 md:w-24 mx-auto mb-2 md:mb-3"></div>
              <div className="h-4 bg-paper-100/10 rounded w-16 md:w-20 mx-auto"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative max-w-5xl mx-auto mt-20 md:mt-36 px-4 md:px-10 text-center overflow-hidden"
    >
      {/* Dekorasi */}
      <div className="absolute -top-20 -left-20 w-48 md:w-64 h-48 md:h-64 bg-gold-400/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-48 md:w-64 h-48 md:h-64 bg-coral-400/10 rounded-full blur-3xl"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 relative z-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`group bg-paper-100/5 backdrop-blur-xl p-6 md:p-10 rounded-3xl 
                        border border-paper-100/10 hover:border-gold-400/30 
                        shadow-xl hover:shadow-2xl hover:shadow-gold-600/10 
                        transition-all duration-500 
                        hover:scale-105 hover:-translate-y-2 
                        relative overflow-hidden
                        animate-fadeUp`}
            style={{ animationDelay: `${(index + 1) * 150}ms` }}
          >
            <div className="absolute -top-10 -right-10 w-24 md:w-32 h-24 md:h-32 bg-gold-400/5 rounded-full blur-2xl group-hover:bg-gold-400/10 transition-all duration-500"></div>
            <div className="absolute -bottom-10 -left-10 w-24 md:w-32 h-24 md:h-32 bg-coral-400/5 rounded-full blur-2xl group-hover:bg-coral-400/10 transition-all duration-500"></div>

            <div className="flex justify-center mb-3 md:mb-4">
              <div className="p-2.5 md:p-3 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 
                              group-hover:from-gold-400/30 group-hover:to-gold-600/30 
                              transition-all duration-500">
                <stat.icon
                  size={isMobile ? 22 : 28}
                  className="text-gold-500/70 group-hover:text-gold-400 transition-colors duration-500"
                />
              </div>
            </div>

            <h2 className="roll-badge text-4xl md:text-6xl font-bold 
                           text-gold-400
                           transition-all duration-500">
              {counts[index]}
              <span className="text-gold-400/50">{stat.suffix}</span>
            </h2>

            <p className="text-paper-100/60 mt-2 md:mt-3 text-xs md:text-sm font-medium tracking-wide">
              {stat.label}
            </p>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 
                            bg-gradient-to-r from-gold-400 via-coral-400 to-teal-400 
                            group-hover:w-2/3 transition-all duration-700 rounded-full"></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;