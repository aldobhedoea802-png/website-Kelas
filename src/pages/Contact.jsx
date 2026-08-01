import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Phone,
  Send,
  Github,
  Instagram,
  Twitter,
  Youtube,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  ArrowUp,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [characterCount, setCharacterCount] = useState(0);
  const [copied, setCopied] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const maxChars = 500;

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "message") setCharacterCount(value.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const subject = `Pesan dari ${formData.name}`;
    const body = `Nama: ${formData.name}\nEmail: ${formData.email}\n\nPesan:\n${formData.message}`;
    window.location.href = `mailto:aldofrsyh21@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
      setTimeout(() => setSubmitted(false), 4000);
      setFormData({ name: "", email: "", message: "" });
      setCharacterCount(0);
    }, 1500);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  // Particles (dikurangi di mobile)
  const particleCount = isMobile ? 25 : 60;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 8,
    opacity: Math.random() * 0.3 + 0.05,
    type: ["dot", "sparkle", "square"][Math.floor(Math.random() * 3)],
  }));

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "aldofrsyh21@gmail.com",
      href: "mailto:aldofrsyh21@gmail.com",
      color: "from-yellow-300 to-orange-400",
      delay: 200,
      copyText: "aldofrsyh21@gmail.com",
    },
    {
      icon: MapPin,
      label: "Lokasi",
      value: "Kampus Universitas Pamulang",
      href: "https://maps.google.com/?q=Universitas+Pamulang",
      color: "from-pink-400 to-rose-400",
      delay: 300,
      copyText: "Universitas Pamulang",
    },
    {
      icon: Phone,
      label: "Telepon",
      value: "+62 858-9223-3052",
      href: "tel:+6285892233052",
      color: "from-purple-400 to-indigo-400",
      delay: 400,
      copyText: "+62 858-9223-3052",
    },
  ];

  const socialLinks = [
    { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/nakmm009/" },
  ];

  // Floating shapes (nonaktif di mobile)
  const floatingShapes = !isMobile ? [
    { size: 60, top: 10, left: 5, color: "bg-purple-500/10", duration: 15 },
    { size: 80, top: 70, left: 80, color: "bg-pink-500/10", duration: 20 },
    { size: 50, top: 40, left: 50, color: "bg-yellow-500/10", duration: 18 },
    { size: 40, top: 85, left: 20, color: "bg-blue-500/10", duration: 12 },
  ] : [];

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-600 dark:from-gray-900 dark:via-gray-800 dark:to-black text-white p-4 md:p-10 overflow-hidden relative"
    >
      {/* Background pattern grid */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      {/* Mouse follower glow (nonaktif di mobile) */}
      {!isMobile && (
        <div
          className="fixed w-96 h-96 rounded-full pointer-events-none transition-transform duration-300 ease-out blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(251,191,36,0.4), transparent 70%)',
            transform: `translate(${mousePosition.x * 30 - 200}px, ${mousePosition.y * 30 - 200}px)`,
          }}
        />
      )}

      {/* Floating shapes */}
      {floatingShapes.map((shape, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${shape.color} blur-2xl animate-float`}
          style={{
            width: shape.size,
            height: shape.size,
            top: shape.top + "%",
            left: shape.left + "%",
            animationDuration: shape.duration + "s",
            animationDelay: i * 2 + "s",
          }}
        />
      ))}

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => {
          let className = "absolute rounded-full ";
          if (p.type === "sparkle") {
            className += "bg-yellow-300/40 animate-twinkle";
          } else if (p.type === "square") {
            className += "bg-white/20 animate-float rounded-none rotate-45";
          } else {
            className += "bg-white/30 animate-float";
          }
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
                ...(p.type === "sparkle" && {
                  boxShadow: "0 0 12px rgba(251,191,36,0.3)",
                }),
              }}
            />
          );
        })}
      </div>

      {/* Background blur with parallax (nonaktif di mobile) */}
      {!isMobile && (
        <>
          <div
            className="fixed -top-40 -left-40 w-[700px] h-[700px] bg-purple-500/15 rounded-full blur-3xl pointer-events-none transition-transform duration-300 ease-out"
            style={{
              transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px)`,
            }}
          />
          <div
            className="fixed top-60 -right-40 w-[700px] h-[700px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none transition-transform duration-300 ease-out"
            style={{
              transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * -30}px)`,
            }}
          />
          <div
            className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-yellow-300/10 rounded-full blur-3xl pointer-events-none transition-transform duration-300 ease-out"
            style={{
              transform: `translate(${mousePosition.x * -40}px, ${mousePosition.y * 40}px)`,
            }}
          />
        </>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Button */}
        <Link
          to="/"
          className="group inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-white/20 backdrop-blur-xl rounded-xl hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg border border-white/10 mb-8 md:mb-12 text-sm md:text-base"
        >
          <ArrowLeft size={16} className="md:w-[18px] md:h-[18px] group-hover:-translate-x-1 transition-transform" />
          <span>Kembali</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-10 md:mb-14 animate-fadeUp">
          <div className="inline-block relative">
            <span className="absolute -top-8 -right-8 text-4xl md:text-6xl opacity-20 animate-pulse">✦</span>
            <span className="absolute -bottom-8 -left-8 text-4xl md:text-6xl opacity-20 animate-pulse delay-1000">✦</span>
            <span className="absolute top-1/2 -left-8 md:-left-12 text-3xl md:text-4xl opacity-10 animate-pulse delay-500">✦</span>
            <h1 className="text-3xl md:text-6xl font-extrabold bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent drop-shadow-[0_4px_40px_rgba(251,191,36,0.3)]">
              {isMobile ? "Hubungi Kami" : "Hubungi Kami"}
            </h1>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/3 md:w-1/2 h-1 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full"></div>
          </div>
          <p className="text-white/50 mt-4 md:mt-6 max-w-xl mx-auto text-xs md:text-sm flex items-center justify-center gap-2">
            <Sparkles size={14} className="md:w-[16px] md:h-[16px] text-yellow-400/60 animate-pulse" />
            Ada pertanyaan atau ingin berkolaborasi? Hubungi kami!
          </p>
        </div>

        {/* Main Grid — di mobile: 1 kolom */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">
          {/* Contact Info Sidebar */}
          <div className="md:col-span-2 space-y-4 md:space-y-5 order-2 md:order-1">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              const isCopied = copied === item.label;
              return (
                <div
                  key={index}
                  className={`group relative bg-white/10 backdrop-blur-xl p-5 md:p-6 rounded-2xl md:rounded-3xl border border-white/10 hover:border-yellow-300/30 transition-all duration-500 hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/10 animate-fadeUp`}
                  style={{ animationDelay: `${item.delay}ms` }}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`p-2 md:p-3 rounded-full bg-gradient-to-br ${item.color} bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={isMobile ? 16 : 20} className="text-white/80" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/40 text-[10px] md:text-xs font-medium uppercase tracking-wider">{item.label}</p>
                      <p className="text-white/80 group-hover:text-white transition-colors text-xs md:text-sm font-medium flex items-center gap-1 md:gap-2 flex-wrap">
                        <span className="truncate">{item.value}</span>
                        {item.copyText && (
                          <button
                            onClick={() => copyToClipboard(item.copyText, item.label)}
                            className="p-0.5 md:p-1 rounded-full hover:bg-white/10 transition-all duration-200 hover:scale-110 flex-shrink-0"
                            aria-label="Copy"
                          >
                            {isCopied ? (
                              <Check size={isMobile ? 10 : 14} className="text-green-400 animate-fadeUp" />
                            ) : (
                              <Copy size={isMobile ? 10 : 14} className="text-white/40 hover:text-white" />
                            )}
                          </button>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className={`mt-2 md:mt-3 h-0.5 w-0 group-hover:w-full transition-all duration-700 bg-gradient-to-r ${item.color} rounded-full`}></div>
                </div>
              );
            })}

            {/* Social Media */}
            <div className="bg-white/10 backdrop-blur-xl p-5 md:p-6 rounded-2xl md:rounded-3xl border border-white/10 hover:border-yellow-300/20 transition-all duration-500 animate-fadeUp delay-500 hover:shadow-2xl hover:shadow-yellow-500/10">
              <h3 className="text-xs md:text-sm font-semibold text-white/60 mb-3 md:mb-4 flex items-center gap-2">
                <Sparkles size={isMobile ? 12 : 16} className="text-yellow-400/60" />
                Ikuti Kami
              </h3>
              <div className="flex gap-2 md:gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-2 md:p-2.5 rounded-full bg-white/10 hover:bg-yellow-300 hover:text-black transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-md hover:shadow-yellow-500/20"
                      aria-label={social.label}
                    >
                      <Icon size={isMobile ? 14 : 18} className="text-white/60 group-hover:text-black transition-colors" />
                      <span className="absolute -top-7 md:-top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[8px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {social.label}
                      </span>
                    </a>
                  );
                })}
              </div>
             
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-3 order-1 md:order-2">
            <div className="bg-white/10 backdrop-blur-xl p-5 md:p-10 rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl hover:border-yellow-300/20 transition-all duration-500 animate-fadeUp delay-200 relative overflow-hidden">
              {/* Background gradient animasi — lebih kecil di mobile */}
              <div className="absolute -top-20 -right-20 w-40 md:w-60 h-40 md:h-60 bg-yellow-300/10 rounded-full blur-2xl animate-pulse-slow"></div>
              <div className="absolute -bottom-20 -left-20 w-40 md:w-60 h-40 md:h-60 bg-pink-400/10 rounded-full blur-2xl animate-pulse-slow delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 md:w-80 h-60 md:h-80 bg-purple-400/5 rounded-full blur-3xl animate-pulse-slow delay-500"></div>

              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 relative z-10">
                <div className="p-1.5 md:p-2 rounded-full bg-yellow-400/20 group-hover:scale-110 transition-transform duration-300">
                  <Send size={isMobile ? 18 : 22} className="text-yellow-400/70" />
                </div>
                <h2 className="text-lg md:text-2xl font-bold">Kirim Pesan</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 relative z-10">
                <div className="relative group">
                  <label className="text-white/60 text-xs md:text-sm block mb-1 font-medium">Nama Lengkap</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2.5 md:py-3.5 text-sm md:text-base rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all placeholder-white/50 group-hover:border-white/20"
                      placeholder="Nama Anda"
                    />
                    {formData.name && (
                      <CheckCircle size={isMobile ? 12 : 16} className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-green-400 animate-fadeUp" />
                    )}
                  </div>
                </div>

                <div className="relative group">
                  <label className="text-white/60 text-xs md:text-sm block mb-1 font-medium">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                     className="w-full px-3 md:px-4 py-2.5 md:py-3.5 text-sm md:text-base rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all placeholder-white/50 group-hover:border-white/20"
                      placeholder="email@example.com"
                    />
                    {formData.email && formData.email.includes("@") && (
                      <CheckCircle size={isMobile ? 12 : 16} className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-green-400 animate-fadeUp" />
                    )}
                  </div>
                </div>

                <div className="relative group">
                  <label className="text-white/60 text-xs md:text-sm block mb-1 font-medium">Pesan</label>
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      maxLength={maxChars}
                      rows={isMobile ? 4 : 5}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3.5 text-sm md:text-base rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all placeholder-white/30 group-hover:border-white/20 resize-none"
                      placeholder="Tulis pesan Anda..."
                    />
                    <div className="absolute bottom-2 md:bottom-3 right-2 md:right-3 text-white/30 text-[8px] md:text-[10px] font-mono">
                      {characterCount}/{maxChars}
                    </div>
                  </div>
                  {characterCount > 0 && (
                    <div className="mt-1.5 md:mt-2 w-full h-1 md:h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          characterCount > maxChars * 0.8
                            ? "bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse"
                            : "bg-gradient-to-r from-yellow-300 to-orange-400"
                        }`}
                        style={{ width: `${(characterCount / maxChars) * 100}%` }}
                      />
                    </div>
                  )}
                  {characterCount > maxChars - 50 && (
                    <div className="flex items-center gap-1 mt-1 text-yellow-400/60 text-[8px] md:text-[10px] animate-pulse">
                      <AlertCircle size={isMobile ? 10 : 12} />
                      <span>Pesan mendekati batas maksimal</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full py-2.5 md:py-3.5 bg-gradient-to-r from-yellow-300 to-orange-400 text-black font-bold rounded-xl hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-400/40 flex items-center justify-center gap-2 overflow-hidden group text-sm md:text-base"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <span className="w-4 md:w-5 h-4 md:h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                        <span className="text-sm md:text-base">Mengirim...</span>
                      </>
                    ) : (
                      <>
                        <Send size={isMobile ? 16 : 18} className="group-hover:translate-x-1 transition-transform" />
                        <span className="text-sm md:text-base">Kirim Pesan</span>
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-orange-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full blur-xl"></span>
                </button>

                {submitted && (
                  <div className="flex items-center justify-center gap-2 text-green-400 text-xs md:text-sm animate-fadeUp bg-green-400/10 py-2 md:py-3 rounded-xl border border-green-400/20">
                    <CheckCircle size={isMobile ? 14 : 18} />
                    <span>Pesan berhasil dikirim ke email Anda!</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 md:mt-16 text-center text-white/20 text-[10px] md:text-xs font-mono flex flex-col items-center gap-1.5 md:gap-2">
          <p className="text-xs md:text-sm text-white/30 font-semibold tracking-wider">SISVOR 009</p>
          <p className="text-[8px] md:text-[10px]">SISVOR 009 © {new Date().getFullYear()} — Built with ❤️</p>
          <div className="flex items-center gap-3 md:gap-4 text-[8px] md:text-[10px] text-white/10">
            <span className="hover:text-white/30 transition-colors">React</span>
            <span className="w-px h-2 bg-white/10"></span>
            <span className="hover:text-white/30 transition-colors">Node.js</span>
            <span className="w-px h-2 bg-white/10"></span>
            <span className="hover:text-white/30 transition-colors">MongoDB</span>
            <span className="w-px h-2 bg-white/10"></span>
            <span className="hover:text-white/30 transition-colors">Tailwind</span>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button — lebih kecil di mobile */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-4 md:bottom-6 right-4 md:right-6 z-50 p-2.5 md:p-3 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 text-black shadow-lg shadow-yellow-500/20 hover:scale-110 transition-all duration-300 ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={isMobile ? 16 : 20} />
      </button>
    </div>
  );
}

export default Contact;