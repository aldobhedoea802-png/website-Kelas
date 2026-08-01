import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import HeroSlideshow from "../components/HeroSlideshow.jsx";
import PhotoSlider from "../components/PhotoSlider.jsx";
import Stats from "../components/Stats.jsx";
import Footer from "../components/Footer.jsx";

function Home() {
  const [scrolled, setScrolled] = useState(false);

  // 🟢 Gunakan BASE_URL untuk path yang benar di GitHub Pages
  const base = import.meta.env.BASE_URL; // => '/website-Kelas/'

  const photos = [
    base + "foto1.jpeg",
    base + "foto2.jpeg",
    base + "foto3.jpeg",
    base + "foto4.jpeg",
    // tambahkan foto lain dengan cara yang sama
  ];

  // Efek scroll untuk mengubah tampilan navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      {/* Navbar tetap di atas dengan transisi */}
      <Navbar scrolled={scrolled} />

      {/* Hero Slideshow — full viewport dengan efek parallax */}
      <HeroSlideshow photos={photos} />

      {/* Photo Slider — galeri kenangan dengan scroll otomatis */}
      <PhotoSlider photos={photos} />

      {/* Stats — menampilkan data real dari API (jumlah mahasiswa & portfolio) */}
      <Stats />

      {/* Footer — informasi kontak dan tautan */}
      <Footer />
    </div>
  );
}

export default Home;