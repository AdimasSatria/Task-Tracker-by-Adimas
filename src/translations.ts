import { Language, TaskCategory } from './types';

export interface TranslationDict {
  brandTitle: string;
  brandBadge: string;
  subtitle: string;
  savingStatus: string;
  savedStatus: string;
  addTask: string;
  addTaskDesc: string;
  themeDark: string;
  themeLight: string;
  langToggle: string;
  studyProgressTitle: string;
  emptyProgressDesc: string;
  academicTasks: string;
  generalActivities: string;
  targetCompleted: string;
  tasksDone: string;
  emptyStorageDesc: string;
  remainingDesc: (rem: number) => string;
  tagAcademic: string;
  tagAutoSave: string;
  tagFocus: string;
  burnoutOptimal: string;
  burnoutModerate: string;
  burnoutHeavy: string;
  activityLogTitle: string;
  activityLogSubtitle: string;
  loadSamples: string;
  clearAll: string;
  clearConfirm: string;
  taskStreamTitle: string;
  taskStreamSubtitle: string;
  remaining: string;
  done: string;
  searchPlaceholder: string;
  allCategories: string;
  statusAll: string;
  statusTodo: string;
  statusInProgress: string;
  statusCompleted: string;
  emptyTitleClean: string;
  emptyTitleNoMatch: string;
  emptyDescClean: string;
  emptyDescNoMatch: string;
  addFirstTask: string;
  loadSampleBtn: string;
  urgent: string;
  high: string;
  medium: string;
  low: string;
  minutes: string;
  deadline: string;
  categoryDistTitle: string;
  categoryDistSubtitle: string;
  studentTips: string;
  taskModalTitle: string;
  taskTitleLabel: string;
  taskTitlePlaceholder: string;
  courseLabel: string;
  coursePlaceholder: string;
  dueDateLabel: string;
  categoryLabel: string;
  priorityLabel: string;
  priorityUrgent: string;
  priorityHigh: string;
  priorityMedium: string;
  priorityLow: string;
  estimateLabel: string;
  notesLabel: string;
  notesPlaceholder: string;
  submissionNotesLabel: string;
  submissionNotesPlaceholder: string;
  submissionReminder: string;
  descLabel: string;
  descPlaceholder: string;
  cancel: string;
  saveTask: string;
  mobileNavTasks: string;
  mobileNavStats: string;
  mobileNavAdd: string;
  mobileNavCategories: string;
  manageCategories: string;
  addCustomCategory: string;
  customBadge: string;
  categories: Record<string, { label: string; example: string }>;
}

export const translations: Record<Language, TranslationDict> = {
  id: {
    brandTitle: 'Ruang Tugas',
    brandBadge: 'Kuliah & Personal',
    subtitle: 'Catat tugas kuliah, praktikum, dan target harian secara rapi',
    savingStatus: 'Menyimpan...',
    savedStatus: 'Tersimpan Otomatis',
    addTask: 'Tambah Tugas',
    addTaskDesc: 'Data otomatis tersimpan langsung di perangkat Anda',
    themeDark: 'Ganti ke Mode Gelap',
    themeLight: 'Ganti ke Mode Terang',
    langToggle: 'Switch to English',
    studyProgressTitle: 'Ringkasan Progres Belajar',
    emptyProgressDesc: 'Mulai catat tugas kuliah atau aktivitas harian untuk melihat progres',
    academicTasks: 'Tugas Kuliah',
    generalActivities: 'Aktivitas Pribadi',
    targetCompleted: 'Tuntas Terpenuhi',
    tasksDone: 'Tugas Selesai',
    emptyStorageDesc: 'Semua perubahan tersimpan secara otomatis setiap kali Anda mengetik atau memperbarui status tugas.',
    remainingDesc: (rem: number) => `Tersisa ${rem} tugas yang belum selesai. Cicil tugas secara bertahap agar tidak menumpuk menjelang batas deadline.`,
    tagAcademic: 'Manajemen Kuliah',
    tagAutoSave: 'Simpan Otomatis',
    tagFocus: 'Fokus Produktivitas',
    burnoutOptimal: 'BEBAN RINGAN & TERKENDALI',
    burnoutModerate: 'BEBAN SEDANG',
    burnoutHeavy: 'BEBAN PADAT (PERLU PRIORITAS)',
    activityLogTitle: 'Aktivitas Terkini',
    activityLogSubtitle: 'Riwayat pembaruan tugas secara langsung',
    loadSamples: 'Muat Contoh Tugas Kuliah',
    clearAll: 'Kosongkan Semua Tugas',
    clearConfirm: 'Apakah Anda yakin ingin menghapus semua tugas? Tindakan ini akan mengosongkan daftar.',
    taskStreamTitle: 'Daftar Tugas & Deadline',
    taskStreamSubtitle: 'Kelola tugas berdasarkan mata kuliah, prioritas, dan status pengerjaan',
    remaining: 'Belum Selesai',
    done: 'Selesai',
    searchPlaceholder: 'Cari tugas, mata kuliah, atau catatan...',
    allCategories: 'Semua',
    statusAll: 'Semua Status',
    statusTodo: 'Belum Dikerjakan',
    statusInProgress: 'Sedang Dikerjakan',
    statusCompleted: 'Sudah Selesai',
    emptyTitleClean: 'Belum Ada Tugas yang Dicatat',
    emptyTitleNoMatch: 'Tugas Tidak Ditemukan',
    emptyDescClean: 'Ruang belajar Anda masih bersih. Klik tombol Tambah Tugas untuk mulai mencatat tugas kuliah, laporan praktikum, atau target belajarmu.',
    emptyDescNoMatch: 'Tidak ada tugas yang sesuai dengan pencarian atau filter yang dipilih.',
    addFirstTask: '+ Tambah Tugas Pertama',
    loadSampleBtn: 'Muat Contoh Tugas',
    urgent: 'Mendesak',
    high: 'Tinggi',
    medium: 'Sedang',
    low: 'Rendah',
    minutes: 'menit',
    deadline: 'Deadline',
    categoryDistTitle: 'Kategori Tugas & Aktivitas',
    categoryDistSubtitle: 'Distribusi beban kegiatan Anda',
    studentTips: 'Tips Belajar: Pisahkan tugas berbobot besar menjadi bagian-bagian kecil. Anda juga dapat membuat kategori kustom seperti Skripsi, Lomba, atau Proyek Mandiri.',
    taskModalTitle: 'Tambah Tugas Baru',
    taskTitleLabel: 'Judul Tugas / Aktivitas',
    taskTitlePlaceholder: 'Contoh: Laporan Modul 3 Basis Data, Resume Jurnal, atau Review Soal UTS',
    courseLabel: 'Mata Kuliah / Subjek (Opsional)',
    coursePlaceholder: 'Contoh: Basis Data, Kalkulus, Manajemen Proyek',
    dueDateLabel: 'Tenggat Waktu / Deadline',
    categoryLabel: 'Kategori Tugas',
    priorityLabel: 'Tingkat Prioritas',
    priorityUrgent: '🔴 Mendesak (Deadline Sangat Dekat)',
    priorityHigh: '🟠 Prioritas Tinggi (Penting)',
    priorityMedium: '🔵 Sedang (Tugas Reguler)',
    priorityLow: '⚪ Rendah (Bisa Ditunda)',
    estimateLabel: 'Estimasi Waktu Pengerjaan',
    notesLabel: 'Catatan & Petunjuk Dosen (Opsional)',
    notesPlaceholder: 'Instruksi tugas, format pengumpulan (.pdf), link materi referensi...',
    submissionNotesLabel: 'Lokasi Pengumpulan / Tempat Pelaksanaan (Notes Reminder)',
    submissionNotesPlaceholder: 'Contoh: Google Classroom, Lab Komputer 3 Lantai 2, Ruang Sidang 201, atau Email Dosen',
    submissionReminder: 'Lokasi / Pengumpulan',
    descLabel: 'Deskripsi / Petunjuk Pengerjaan (Opsional)',
    descPlaceholder: 'Instruksi tugas, format file (.pdf/.zip), link materi referensi...',
    cancel: 'Batal',
    saveTask: 'Simpan Tugas',
    mobileNavTasks: 'Tugas',
    mobileNavStats: 'Progres',
    mobileNavAdd: 'Tambah',
    mobileNavCategories: 'Kategori',
    manageCategories: 'Kelola Kategori',
    addCustomCategory: '+ Kategori Kustom Baru',
    customBadge: 'Kustom',
    categories: {
      TUGAS_KULIAH: { label: 'Tugas Kuliah', example: 'PR mingguan, esai, resume materi' },
      PRAKTIKUM: { label: 'Praktikum & Lab', example: 'Laporan modul, responsi, pre-test lab' },
      UJIAN: { label: 'Ujian & Kuis', example: 'Persiapan UTS, UAS, kuis mingguan' },
      KELOMPOK: { label: 'Tugas Kelompok', example: 'Makalah kelompok, slide presentasi' },
      BELAJAR: { label: 'Belajar Mandiri', example: 'Membaca modul, latihan soal mandiri' },
      ORGANISASI: { label: 'Organisasi & Kampus', example: 'Rapat organisasi, kepanitiaan acara' },
      MAGANG: { label: 'Magang & Karier', example: 'Tugas magang, portofolio, asistensi' },
      GENERAL: { label: 'Pribadi & Lainnya', example: 'Keperluan harian, bayar SPP/UKT, belanja' }
    }
  },
  en: {
    brandTitle: 'Task Tracker',
    brandBadge: 'College & Personal',
    subtitle: 'Organize coursework, lab reports, and daily goals with ease',
    savingStatus: 'Saving...',
    savedStatus: 'Auto-Saved',
    addTask: 'Add Task',
    addTaskDesc: 'Changes are automatically saved to your device',
    themeDark: 'Switch to Dark Mode',
    themeLight: 'Switch to Light Mode',
    langToggle: 'Ganti ke Bahasa Indonesia',
    studyProgressTitle: 'Study Progress Overview',
    emptyProgressDesc: 'Start recording coursework or daily routines to monitor your progress',
    academicTasks: 'Course Tasks',
    generalActivities: 'Personal Tasks',
    targetCompleted: 'Completion Target',
    tasksDone: 'Tasks Completed',
    emptyStorageDesc: 'All data saves automatically to your device as you create or update assignments.',
    remainingDesc: (rem: number) => `${rem} task${rem === 1 ? '' : 's'} remaining. Tackle your assignments steadily to stay ahead of upcoming deadlines.`,
    tagAcademic: 'Course Management',
    tagAutoSave: 'Auto-Saved',
    tagFocus: 'Productivity Focus',
    burnoutOptimal: 'LIGHT & BALANCED LOAD',
    burnoutModerate: 'MODERATE LOAD',
    burnoutHeavy: 'HEAVY LOAD (FOCUS NEEDED)',
    activityLogTitle: 'Recent Activity',
    activityLogSubtitle: 'Live timeline of assignment updates',
    loadSamples: 'Load Sample Tasks',
    clearAll: 'Clear All Tasks',
    clearConfirm: 'Are you sure you want to clear all tasks? This will empty your task list.',
    taskStreamTitle: 'Assignments & Deadlines',
    taskStreamSubtitle: 'Organize by course subject, priority, and progress status',
    remaining: 'Pending',
    done: 'Completed',
    searchPlaceholder: 'Search tasks, courses, or notes...',
    allCategories: 'All',
    statusAll: 'All Status',
    statusTodo: 'To Do',
    statusInProgress: 'In Progress',
    statusCompleted: 'Completed',
    emptyTitleClean: 'No Tasks Recorded Yet',
    emptyTitleNoMatch: 'No Matching Tasks',
    emptyDescClean: 'Your study workspace is clear. Tap the Add Task button to record your coursework, lab reports, or study sessions.',
    emptyDescNoMatch: 'No tasks match your selected filter or search keywords.',
    addFirstTask: '+ Add First Task',
    loadSampleBtn: 'Load Sample Tasks',
    urgent: 'Urgent',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    minutes: 'mins',
    deadline: 'Deadline',
    categoryDistTitle: 'Task Categories & Domains',
    categoryDistSubtitle: 'Distribution of your current workload',
    studentTips: 'Study Tip: Break larger assignments (like lab reports or group papers) into smaller sub-tasks. Use the Cmd+K or Ctrl+K shortcut to quickly create new tasks.',
    taskModalTitle: 'Add New Task',
    taskTitleLabel: 'Task Title / Assignment',
    taskTitlePlaceholder: 'e.g. Distributed DB Module 4 Lab, History Essay, or Midterm Problem Set',
    courseLabel: 'Course / Subject (Optional)',
    coursePlaceholder: 'e.g. Data Structures, Calculus II, Economics',
    dueDateLabel: 'Due Date & Time',
    categoryLabel: 'Category',
    priorityLabel: 'Priority Level',
    priorityUrgent: '🔴 Urgent (Imminent Deadline)',
    priorityHigh: '🟠 High (Major Assignment)',
    priorityMedium: '🔵 Medium (Regular Coursework)',
    priorityLow: '⚪ Low (Can be deferred)',
    estimateLabel: 'Estimated Study Time',
    notesLabel: 'Notes & Instructions (Optional)',
    notesPlaceholder: 'Submission format, reference links, professor instructions...',
    submissionNotesLabel: 'Submission Location / Venue Reminder (Notes)',
    submissionNotesPlaceholder: 'e.g. Google Classroom, Computer Lab 3 (2nd floor), Hall 201, or Lecturer Email',
    submissionReminder: 'Location / Submit',
    descLabel: 'Description / Task Instructions (Optional)',
    descPlaceholder: 'Task instructions, file format requirements (.pdf/.zip), references...',
    cancel: 'Cancel',
    saveTask: 'Save Task',
    mobileNavTasks: 'Tasks',
    mobileNavStats: 'Progress',
    mobileNavAdd: 'Add',
    mobileNavCategories: 'Categories',
    manageCategories: 'Manage Categories',
    addCustomCategory: '+ New Custom Category',
    customBadge: 'Custom',
    categories: {
      TUGAS_KULIAH: { label: 'Coursework', example: 'Weekly assignments, papers, article summaries' },
      PRAKTIKUM: { label: 'Lab & Practicum', example: 'Lab reports, pre-tests, experiment notes' },
      UJIAN: { label: 'Exams & Quizzes', example: 'Midterms, finals prep, weekly quizzes' },
      KELOMPOK: { label: 'Group Projects', example: 'Team presentations, joint slide decks' },
      BELAJAR: { label: 'Self-Study', example: 'Reading textbooks, practicing problem sets' },
      ORGANISASI: { label: 'Campus & Clubs', example: 'Student council meetings, event committees' },
      MAGANG: { label: 'Internship & Career', example: 'Intern deliverables, lab assistant tasks' },
      GENERAL: { label: 'Personal & Errands', example: 'Daily groceries, tuition payments, fitness' }
    }
  }
};
