# 📄 AI Gen CV Converter & Company Template Customizer

Aplikasi web modern berbasis **Next.js 16 (Turbopack)** dan **Google Gemini AI** untuk menganalisis, mengonversi, serta memformat ulang CV kandidat menjadi dokumen CV standar resmi perusahaan dalam bentuk **PDF** dan **Microsoft Word (.docx)**.

---

## 🌟 Fitur Utama

- 🧠 **AI-Powered CV Parsing (Gemini AI)**: Mengidentifikasi & mengekstrak data kandidat secara otomatis (Nama, Ringkasan Profil, Skills Terkategori, Pengalaman Kerja, Proyek Detail, Sertifikasi, & Pendidikan) menggunakan model `gemini-3-flash-preview` dengan proteksi fallback otomatis jika terjadi kuota terlampaui (*rate limit*).
- 🏢 **Multi-Template Perusahaan & Custom Branding**: Mendukung berbagai template resmi perusahaan dengan warna tema kustom, logo perusahaan (SVG Vector native parsing & URL raster image), serta format tata letak yang profesional.
- 🗄️ **Database Template (PostgreSQL 16)**: Penyimpanan template kustom perusahaan yang persistent menggunakan database PostgreSQL 16.
- ✏️ **Modal Konfirmasi & Full Inline Editor Interaktif**:
  - Pengguna dapat meninjau dan mengedit **seluruh field CV** (Nama, Role, Executive Summary, Skills, Tanggal & Poin Responsibilitas Pekerjaan, Detail Proyek, Sertifikasi, Pendidikan) sebelum dicetak.
  - **Opsi Toggle Portfolio / LinkedIn**: Disediakan checkbox interaktif untuk memilih apakah link karya/LinkedIn kandidat ditampilkan atau disembunyikan pada hasil konversi CV.
- 🖋️ **Format Typography Standar Perusahaan**:
  - Penulisan **Role / Jabatan** dan **Nama Perusahaan** secara konsisten diformat **Bold & Italic** di seluruh template PDF, DOCX, dan UI preview.
- 📥 **Ekspor Ganda (PDF & DOCX)**:
  - Ekspor dokumen ke format **PDF** menggunakan native vector renderer (`@react-pdf/renderer` & `pdf-lib`).
  - Ekspor dokumen ke format **Microsoft Word (.docx)** menggunakan engine `docx`.

---

## 🛠️ Teknologi & Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (Turbopack, App Router)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) dengan Glassmorphism & Micro-animations
- **AI Engine**: Google Gemini AI API (`@google/genai`)
- **Database**: PostgreSQL 16 (`pg`)
- **Rendering Engines**:
  - PDF: `@react-pdf/renderer` & `pdf-lib`
  - DOCX: `docx`
- **Icon Set**: [Lucide React](https://lucide.dev/)

---

## 🚀 Cara Menggunakan & Jalankan Lokal

### 1. Prasyarat
- Node.js versi 18+ atau yang terbaru
- PostgreSQL 16 aktif pada port `5432`

### 2. Konfigurasi Environment Variable (`.env.local`)
Buat atau sesuaikan file `.env.local` di root direktori project:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aigencv
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3005
```

### 3. Instalasi Dependency & Dev Server
Jalankan perintah berikut pada terminal:

```bash
# Install dependency project
npm install

# Jalankan server pengembangan (Port 3005)
npm run dev
```

Buka browser dan akses `http://localhost:3005`.

---

## 📂 Struktur Direktori

```text
aigenCvConverter/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── cv/convert/route.ts   # Main API pipeline untuk analisis & rendering CV
│   │   │   └── templates/route.ts    # API pengelola template perusahaan (PostgreSQL)
│   │   ├── page.tsx                  # Halaman utama aplikasi (Steps Upload -> Export)
│   │   └── layout.tsx
│   ├── components/
│   │   ├── review/
│   │   │   └── ReviewModal.tsx       # Modal konfirmasi & editor CV interaktif
│   │   ├── preview/
│   │   └── ...
│   ├── lib/
│   │   ├── extractor/
│   │   │   └── geminiExtractor.ts    # Ekstraksi AI & penyelarasan data kandidat
│   │   ├── rendering/
│   │   │   ├── pdfRenderer.tsx       # Renderer React-PDF (SVG vector logo support)
│   │   │   ├── pdfTemplateOverlay.ts # Overlay renderer pdf-lib
│   │   │   └── docxRenderer.ts       # Renderer Microsoft Word (.docx)
│   │   ├── templates/
│   │   │   ├── companies.ts          # Konfigurasi bawaan template perusahaan
│   │   │   └── templateManager.ts    # Pengelola persistence PostgreSQL
│   │   └── validation/
│   │       └── auditEngine.ts        # Validasi batas kehilangan data & kelayakan CV
│   └── types/
│       └── cv.ts                     # Definisi tipe data CanonicalCV & Template
├── public/                           # Assets publik & SVG logo
└── README.md
```

---

## 📦 Lisensi

Dibuat untuk kebutuhan konversi & standardisasi CV perusahaan. Hak Cipta © 2026.
