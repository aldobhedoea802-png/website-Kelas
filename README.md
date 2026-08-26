# SISVOR 009 — Sistem Informasi Kelas

Website profil kelas SISVOR 009: menampilkan daftar mahasiswa, portofolio karya,
website pribadi mahasiswa, galeri foto, dan halaman tentang/kontak.

- **Frontend**: React 19 + Vite 7 + Tailwind CSS 3, react-router-dom, framer-motion
- **Backend**: Node.js + Express + MongoDB (Mongoose), upload file dengan Multer

## Struktur proyek

```
.
├── src/                # Kode frontend (React)
│   ├── components/     # Navbar, Footer, HeroSlideshow, PhotoSlider, Stats, dll.
│   └── pages/          # Home, Students, Portfolio, About, Contact, Gallery, StudentWebsites
├── public/              # Aset statis (foto, video, favicon) yang di-serve langsung
├── backend/             # API Express + koneksi MongoDB
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── uploads/         # File yang di-upload pengguna (foto mahasiswa, file proyek)
└── dist/                # Hasil build produksi (dibuat otomatis, tidak di-commit)
```

## Menjalankan secara lokal

### 1. Frontend

```bash
npm install
npm run dev
```

Buat file `.env.local` di root (isi URL backend lokal):

```
VITE_API_URL=http://localhost:5000/api
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# lalu isi MONGO_URI dan JWT_SECRET di file .env dengan nilai kamu sendiri
npm run dev
```

`backend/.env` **tidak** ikut ter-commit ke Git (sudah masuk `.gitignore`) — pakai
`backend/.env.example` sebagai contoh nilai yang perlu diisi.

## Build untuk produksi

```bash
npm run build     # menghasilkan folder dist/
npm run deploy    # build lalu publish ke GitHub Pages (gh-pages)
```

## Upload ke GitHub

Karena `node_modules` dan `.env` sudah masuk `.gitignore`, kamu tinggal:

```bash
git add .
git commit -m "Perbarui tampilan dan rapikan struktur proyek"
git push
```

Kalau ini pertama kali push dari komputer ini dan repo remote sudah ada
(`origin` sudah diatur ke repo GitHub kamu), langsung `git push` saja.
