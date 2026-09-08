# Ruang Tugas (Task Tracker)

Aplikasi task tracker untuk mahasiswa dan penggunaan personal, dengan fokus pada manajemen tugas, deadline, prioritas, dan kategori kustom.

## Fitur Utama

- Tambah, ubah status, dan hapus tugas
- Filter berdasarkan kategori dan status
- Pencarian tugas secara cepat
- Dukungan Bahasa Indonesia & English
- Simpan otomatis ke `localStorage`
- Kelola kategori kustom

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS

## Menjalankan Proyek (Frontend Utama)

### 1) Install dependency

```bash
npm install
```

### 2) Jalankan mode development

```bash
npm run dev
```

App akan berjalan di `http://localhost:3000`.

### 3) Build production

```bash
npm run build
```

### 4) Validasi type-check

```bash
npm run lint
```

## Struktur Singkat

```text
.
├── src/                 # Frontend utama (React + TS)
├── public/              # Asset statis
├── frontend/            # Versi frontend statis lama (HTML/CSS/JS)
├── services/            # Eksperimen service terpisah (PHP/Java/Go/Python)
├── database/            # SQL schema
└── README.md
```

## Catatan

- File `.env.example` tersedia jika ingin integrasi environment variable.
- Repository ini berisi beberapa pendekatan (frontend modern + service eksperimen) dalam satu tempat.

## Author

- Adimas Satria
- GitHub: https://github.com/AdimasSatria
