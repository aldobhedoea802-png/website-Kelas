import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../services/api.js";
import {
  ArrowLeft,
  Upload,
  Search,
  X,
  File,
  Image,
  FileText,
  Code,
  FileArchive,
  User,
  Trash2,
  Eye,
  Download,
  Sparkles,
  Grid,
  List,
} from "lucide-react";

function Portfolio() {
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [student, setStudent] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [search, setSearch] = useState("");
  const [drag, setDrag] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const headerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // 🔥 Ambil environment variable untuk URL server
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const serverBase = apiBase.replace("/api", ""); // -> http://localhost:5000

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

  useEffect(() => {
    const loadData = async () => {
      await fetchStudent();
      await fetchFiles();
      setPageLoading(false);
    };
    loadData();
  }, [id]);

  const fetchFiles = async () => {
    try {
      const res = await api.get(`/files/student/${id}`);
      setFiles(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStudent = async () => {
    try {
      const res = await api.get(`/students/${id}`);
      setStudent(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFile = (f) => {
    setFile(f);
    if (f?.type?.startsWith("image")) {
      setPreview(URL.createObjectURL(f));
    }
  };

  const upload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Pilih file dulu");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentId", id);
    setLoading(true);
    try {
      const res = await api.post("/files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (p) => {
          setProgress(Math.round((p.loaded * 100) / p.total));
        },
      });
      setFiles((prev) => [...prev, res.data]);
      setFile(null);
      setPreview(null);
      setProgress(0);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const deleteFile = async (fileId) => {
    if (!window.confirm("Hapus project ini?")) return;
    try {
      await api.delete(`/files/${fileId}`);
      setFiles(files.filter((f) => f._id !== fileId));
    } catch (err) {
      console.log(err);
    }
  };

  const getFileIcon = (name) => {
    if (name.endsWith(".pdf")) return <FileText size={isMobile ? 18 : 24} className="text-red-400" />;
    if (name.match(/\.(png|jpg|jpeg)$/)) return <Image size={isMobile ? 18 : 24} className="text-green-400" />;
    if (name.endsWith(".zip")) return <FileArchive size={isMobile ? 18 : 24} className="text-yellow-400" />;
    if (name.endsWith(".js")) return <Code size={isMobile ? 18 : 24} className="text-blue-400" />;
    if (name.endsWith(".py")) return <Code size={isMobile ? 18 : 24} className="text-purple-400" />;
    return <File size={isMobile ? 18 : 24} className="text-gray-400" />;
  };

  const getFileType = (name) => {
    if (name.endsWith(".pdf")) return "PDF";
    if (name.match(/\.(png|jpg|jpeg)$/)) return "Image";
    if (name.endsWith(".zip")) return "Archive";
    if (name.endsWith(".js")) return "JavaScript";
    if (name.endsWith(".py")) return "Python";
    return "File";
  };

  const filteredFiles = files.filter((f) =>
    f.originalname.toLowerCase().includes(search.toLowerCase())
  );

  const fileStats = {
    total: files.length,
    images: files.filter((f) => f.originalname.match(/\.(png|jpg|jpeg)$/)).length,
    pdfs: files.filter((f) => f.originalname.endsWith(".pdf")).length,
    others: files.filter((f) => !f.originalname.match(/\.(png|jpg|jpeg)$/) && !f.originalname.endsWith(".pdf")).length,
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-600 dark:from-gray-900 dark:via-gray-800 dark:to-black flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
            <Sparkles size={20} className="md:w-[24px] md:h-[24px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-white/80 text-sm md:text-lg animate-pulse">Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  // 🔥 URL foto mahasiswa
  const studentPhotoUrl = student?.photo
    ? `${serverBase}/${student.photo}`.replace(/\/\//g, '/')
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-600 dark:from-gray-900 dark:via-gray-800 dark:to-black text-white p-4 md:p-10 overflow-hidden">
      {/* Dekorasi blur */}
      <div className="fixed -top-40 -left-40 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed top-60 -right-40 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HEADER */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-6 mb-8 md:mb-12 transition-transform duration-300 ease-out"
          style={{
            transform: isMobile ? 'none' : `translate(${mousePosition.x * -3}px, ${mousePosition.y * -3}px)`,
          }}
        >
          <Link
            to="/students"
            className="group flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-white/20 backdrop-blur-xl rounded-xl hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg border border-white/10 text-sm md:text-base"
          >
            <ArrowLeft size={16} className="md:w-[18px] md:h-[18px] group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </Link>

          <div className="relative">
            <h1 className="text-2xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(251,191,36,0.3)]">
              {isMobile ? "Portfolio" : "Student Portfolio"}
            </h1>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-0.5 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full"></div>
          </div>

          <div className="w-16 md:w-28"></div> {/* Spacer */}
        </div>

        {/* PROFILE CARD */}
        <div className="group bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-5 md:p-10 mb-8 md:mb-12 shadow-2xl border border-white/10 hover:border-yellow-300/30 hover:shadow-yellow-500/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 md:w-64 h-40 md:h-64 bg-yellow-300/10 rounded-full blur-3xl group-hover:bg-yellow-300/20 transition-all duration-500"></div>
          <div className="absolute -bottom-20 -left-20 w-40 md:w-64 h-40 md:h-64 bg-pink-400/10 rounded-full blur-3xl group-hover:bg-pink-400/20 transition-all duration-500"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
              {studentPhotoUrl ? (
                <img
                  src={studentPhotoUrl}
                  alt={student.name}
                  className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover border-4 border-yellow-300/50 shadow-xl group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className={`w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 flex items-center justify-center text-2xl md:text-4xl font-bold shadow-xl group-hover:scale-105 transition-transform duration-500 ${studentPhotoUrl ? 'hidden' : ''}`}
              >
                {student?.name?.charAt(0) || "?"}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl md:text-3xl font-bold group-hover:text-yellow-300 transition-colors duration-300">
                  {student?.name || "Mahasiswa"}
                </h2>
                <p className="text-white/60 text-xs md:text-sm flex items-center justify-center sm:justify-start gap-1.5 md:gap-2">
                  <User size={14} className="md:w-[16px] md:h-[16px] text-yellow-400/60" />
                  Portfolio Mahasiswa
                </p>
              </div>
            </div>
            <div className="text-center bg-white/5 backdrop-blur-sm px-4 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl border border-white/10">
              <p className="text-white/50 text-[10px] md:text-xs uppercase tracking-wider">Total Project</p>
              <p className="text-2xl md:text-5xl font-bold text-yellow-400">{files.length}</p>
            </div>
          </div>
        </div>

        {/* SEARCH & VIEW TOGGLE */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="relative w-full md:w-96">
            <Search size={16} className="md:w-[18px] md:h-[18px] absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Cari project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 md:pl-11 pr-10 md:pr-11 py-2.5 md:py-3 text-sm md:text-base rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all placeholder-white/40 shadow-lg"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
              >
                <X size={14} className="md:w-[16px] md:h-[16px]" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 md:p-2 rounded-lg transition-all duration-300 ${viewMode === "grid" ? "bg-yellow-400/20 text-yellow-300" : "text-white/40 hover:text-white"}`}
              >
                <Grid size={isMobile ? 16 : 18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 md:p-2 rounded-lg transition-all duration-300 ${viewMode === "list" ? "bg-yellow-400/20 text-yellow-300" : "text-white/40 hover:text-white"}`}
              >
                <List size={isMobile ? 16 : 18} />
              </button>
            </div>

            {files.length > 0 && !isMobile && (
              <div className="flex items-center gap-2 text-white/30 text-xs">
                <span className="flex items-center gap-1">
                  <Image size={12} /> {fileStats.images}
                </span>
                <span className="w-px h-3 bg-white/10"></span>
                <span className="flex items-center gap-1">
                  <FileText size={12} /> {fileStats.pdfs}
                </span>
                <span className="w-px h-3 bg-white/10"></span>
                <span className="flex items-center gap-1">
                  <File size={12} /> {fileStats.others}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* UPLOAD SECTION */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-10 mb-8 md:mb-12 shadow-2xl border border-white/10 hover:border-yellow-300/20 transition-all duration-500">
          <h2 className="text-base md:text-2xl font-semibold mb-3 md:mb-6 flex items-center gap-2">
            <Upload size={isMobile ? 18 : 24} className="text-yellow-400/70" />
            Upload Project
          </h2>
          <form onSubmit={upload}>
            <div
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files[0]);
                setDrag(false);
              }}
              className={`border-2 border-dashed p-6 md:p-14 rounded-xl md:rounded-2xl text-center transition-all duration-300 relative
                ${drag ? "border-yellow-400 bg-white/10 scale-[1.02]" : "border-white/20 hover:border-yellow-300/30"}
              `}
            >
              <div className="text-3xl md:text-5xl mb-2 md:mb-4">📂</div>
              <p className="text-white/70 text-xs md:text-base">Drag & Drop file atau klik untuk upload</p>
              <input
                type="file"
                onChange={(e) => handleFile(e.target.files[0])}
                className="mt-3 md:mt-4 text-xs md:text-sm text-white/60 file:mr-4 file:py-1.5 md:file:py-2 file:px-3 md:file:px-4 file:rounded-full file:border-0 file:text-xs md:file:text-sm file:font-semibold file:bg-yellow-400 file:text-black hover:file:bg-yellow-300 transition cursor-pointer"
              />
              {file && (
                <div className="mt-3 md:mt-4 flex items-center justify-center gap-2 text-yellow-300 text-xs md:text-sm">
                  <File size={isMobile ? 14 : 16} />
                  <span className="truncate max-w-[150px] md:max-w-none">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="text-white/30 hover:text-white transition"
                  >
                    <X size={12} className="md:w-[14px] md:h-[14px]" />
                  </button>
                </div>
              )}
              {preview && (
                <img
                  src={preview}
                  className="mt-3 md:mt-4 mx-auto max-h-32 md:max-h-48 rounded-xl shadow-lg border border-white/10"
                  alt="Preview"
                />
              )}
            </div>

            {loading && (
              <div className="mt-4 md:mt-6">
                <div className="flex justify-between text-xs text-white/50 mb-1">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 md:h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className={`mt-4 md:mt-6 px-5 md:px-8 py-2 md:py-3 bg-gradient-to-r from-yellow-300 to-orange-400 text-black font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-400/40 hover:scale-105 flex items-center gap-2 text-sm md:text-base ${(!file || loading) ? "opacity-50 cursor-not-allowed hover:scale-100" : ""}`}
            >
              <Upload size={isMobile ? 16 : 18} />
              Upload File
            </button>
          </form>
        </div>

        {/* PROJECT GRID / LIST */}
        {filteredFiles.length === 0 ? (
          <div className="text-center text-white/60 mt-10 md:mt-16">
            <div className="text-5xl md:text-7xl mb-4 md:mb-6 animate-bounce">📂</div>
            <p className="text-lg md:text-xl font-medium">Tidak ada project</p>
            <p className="text-white/40 text-xs md:text-sm mt-1 md:mt-2">Upload project pertama Anda</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {filteredFiles.map((f, index) => (
              <FileCard
                key={f._id}
                file={f}
                index={index}
                getFileIcon={getFileIcon}
                getFileType={getFileType}
                onDelete={deleteFile}
                onPreview={setModal}
                isMobile={isMobile}
                serverBase={serverBase}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3 md:gap-4">
            {filteredFiles.map((f, index) => (
              <FileListItem
                key={f._id}
                file={f}
                index={index}
                getFileIcon={getFileIcon}
                getFileType={getFileType}
                onDelete={deleteFile}
                onPreview={setModal}
                isMobile={isMobile}
                serverBase={serverBase}
              />
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-12 md:mt-16 text-center text-white/20 text-[10px] md:text-xs font-mono tracking-widest flex items-center justify-center gap-3 md:gap-4">
          <span>{filteredFiles.length} dari {files.length} project</span>
          <span className="w-px h-2 md:h-3 bg-white/10"></span>
          <span className="text-white/10">✦ SISVOR 009</span>
        </div>
      </div>

      {/* MODAL PREVIEW */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeUp p-3 md:p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-gray-900/90 backdrop-blur-xl p-4 md:p-8 rounded-2xl md:rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto border border-white/10 shadow-2xl relative animate-scale"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModal(null)}
              className="absolute top-3 right-3 md:top-4 md:right-4 p-1.5 md:p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white/60 hover:text-white"
            >
              <X size={isMobile ? 16 : 20} />
            </button>

            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6 pr-8">
              {getFileIcon(modal.originalname)}
              <h2 className="text-sm md:text-xl font-semibold truncate flex-1">{modal.originalname}</h2>
              <span className="px-2 py-0.5 bg-white/10 rounded-full text-[8px] md:text-xs text-white/40">
                {getFileType(modal.originalname)}
              </span>
            </div>

            {modal.originalname.match(/\.(png|jpg|jpeg)$/) ? (
              <img
                src={`${serverBase}/uploads/files/${modal.filename}`}
                className="max-h-[50vh] md:max-h-[60vh] mx-auto rounded-xl shadow-lg"
                alt={modal.originalname}
                onError={(e) => {
                  e.target.alt = 'Gagal memuat gambar';
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : modal.originalname.endsWith(".pdf") ? (
              <iframe
                src={`${serverBase}/uploads/files/${modal.filename}`}
                className="w-full h-[40vh] md:h-[60vh] rounded-xl"
                title={modal.originalname}
              />
            ) : (
              <div className="text-center py-8 md:py-12">
                <div className="text-4xl md:text-6xl mb-3 md:mb-4">📄</div>
                <p className="text-white/60 text-sm md:text-base mb-3 md:mb-4">File tidak bisa dipreview</p>
                <a
                  href={`${serverBase}/uploads/files/${modal.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:scale-105 transition text-sm md:text-base"
                >
                  <Download size={isMobile ? 16 : 18} />
                  Download File
                </a>
              </div>
            )}

            <div className="mt-3 md:mt-4 flex flex-wrap justify-between text-white/30 text-[10px] md:text-xs gap-2">
              <span>Size: {(modal.size / 1024).toFixed(2)} KB</span>
              <span>ID: {modal._id.slice(-6)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// File Card Component (Grid View)
function FileCard({ file, index, getFileIcon, getFileType, onDelete, onPreview, isMobile, serverBase }) {
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

  const isImage = file.originalname.match(/\.(png|jpg|jpeg)$/);
  const imageUrl = isImage ? `${serverBase}/uploads/files/${file.filename}` : null;

  return (
    <div
      ref={cardRef}
      className="group bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/10 hover:border-yellow-300/30 shadow-lg hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden animate-fadeUp"
      style={{
        animationDelay: `${(index % 12) * 60}ms`,
        perspective: isMobile ? 'none' : '800px',
        transform: isMobile ? 'none' : `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: "transform 0.2s ease-out",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isImage ? (
        <div className="overflow-hidden h-28 md:h-40">
          <img
            src={imageUrl}
            alt={file.originalname}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.src = '';
              e.target.className = 'w-full h-full bg-gray-800 flex items-center justify-center text-white/30 text-xs';
              e.target.alt = 'Gagal load';
            }}
          />
        </div>
      ) : (
        <div className="h-28 md:h-40 bg-gradient-to-br from-white/5 to-white/0 flex items-center justify-center">
          <div className="text-4xl md:text-6xl opacity-30">{getFileIcon(file.originalname)}</div>
        </div>
      )}

      <div className="p-3 md:p-5">
        <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
          {getFileIcon(file.originalname)}
          <h3 className="text-[10px] md:text-sm font-semibold truncate flex-1">{file.originalname}</h3>
        </div>

        <div className="flex items-center justify-between text-[8px] md:text-xs">
          <span className="text-white/30">{getFileType(file.originalname)}</span>
          <span className="text-white/20">{(file.size / 1024).toFixed(1)} KB</span>
        </div>

        <div className="mt-2 md:mt-3 flex gap-1.5 md:gap-2">
          <button
            onClick={() => onPreview(file)}
            className="flex-1 flex items-center justify-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 md:py-1.5 bg-yellow-400/20 text-yellow-300 rounded-lg hover:bg-yellow-400/30 transition text-[8px] md:text-xs"
          >
            <Eye size={isMobile ? 10 : 14} /> Preview
          </button>
          <button
            onClick={() => onDelete(file._id)}
            className="px-2 md:px-3 py-1 md:py-1.5 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition text-[8px] md:text-xs"
          >
            <Trash2 size={isMobile ? 10 : 14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// File List Item Component
function FileListItem({ file, index, getFileIcon, getFileType, onDelete, onPreview, isMobile, serverBase }) {
  return (
    <div
      className="group bg-white/10 backdrop-blur-xl p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/10 hover:border-yellow-300/30 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-500 hover:-translate-y-1 flex items-center gap-3 md:gap-4 animate-fadeUp"
      style={{ animationDelay: `${(index % 12) * 60}ms` }}
    >
      <div className="p-1.5 md:p-2 bg-white/5 rounded-lg">{getFileIcon(file.originalname)}</div>

      <div className="flex-1 min-w-0">
        <h3 className="text-xs md:text-sm font-semibold truncate">{file.originalname}</h3>
        <div className="flex items-center gap-2 md:gap-3 text-[8px] md:text-xs text-white/30">
          <span>{getFileType(file.originalname)}</span>
          <span className="w-px h-2 md:h-3 bg-white/10"></span>
          <span>{(file.size / 1024).toFixed(1)} KB</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-2">
        <button
          onClick={() => onPreview(file)}
          className="p-1.5 md:p-2 rounded-lg bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30 transition"
        >
          <Eye size={isMobile ? 14 : 16} />
        </button>
        <button
          onClick={() => onDelete(file._id)}
          className="p-1.5 md:p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
        >
          <Trash2 size={isMobile ? 14 : 16} />
        </button>
      </div>
    </div>
  );
}

export default Portfolio;