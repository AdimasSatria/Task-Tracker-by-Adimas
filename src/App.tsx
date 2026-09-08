/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Trash2, 
  Search, 
  Plus, 
  Calendar,
  GraduationCap,
  Sparkles,
  BookOpen,
  Check,
  RotateCcw,
  Languages,
  LayoutList,
  BarChart3,
  Layers,
  Flame,
  CheckCheck,
  FolderPlus,
  MapPin
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus, TaskCategory, ActivityEvent, Language, CategoryItem } from './types';
import { DEFAULT_CATEGORIES, getCategoryDisplayInfo } from './categories';
import { TaskModal } from './components/TaskModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { translations } from './translations';

const STORAGE_KEY = 'ptt_personal_student_tasks';
const CUSTOM_CATEGORIES_KEY = 'ptt_custom_categories_v1';
const LANG_KEY = 'ptt_language';

const SAMPLE_COLLEGE_TASKS_ID: Task[] = [
  {
    id: 1,
    uuid: 'task-sample-1',
    title: 'Laporan Praktikum Modul 4: Basis Data',
    courseName: 'Basis Data',
    description: 'Menyusun normalisasi 3NF, query join multi-tabel, dan screenshot hasil eksekusi.',
    notes: 'Kumpul di e-Learning Kampus (Folder Praktikum Modul 4 format .PDF)',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    category: 'PRAKTIKUM',
    estimatedMinutes: 90,
    dueDate: '2026-09-10T23:59',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 2,
    uuid: 'task-sample-2',
    title: 'Makalah Kelompok & Slide Presentasi Etika TI',
    courseName: 'Etika Profesi IT',
    description: 'Analisis studi kasus perlindungan data pribadi dan siapkan 10 slide presentasi.',
    notes: 'Presentasi tatap muka di Gedung F Lantai 2 (Ruang Seminar 204)',
    status: 'TODO',
    priority: 'HIGH',
    category: 'KELOMPOK',
    estimatedMinutes: 120,
    dueDate: '2026-09-12T15:00',
    createdAt: new Date(Date.now() - 14400000).toISOString()
  },
  {
    id: 3,
    uuid: 'task-sample-3',
    title: 'Latihan Soal & Review Materi UTS Kalkulus II',
    courseName: 'Kalkulus II',
    description: 'Mengerjakan bank soal bab integral parsial dan substitusi trigonometri.',
    notes: 'Pelaksanaan ujian di Gedung Kuliah Bersama R.304',
    status: 'TODO',
    priority: 'MEDIUM',
    category: 'UJIAN',
    estimatedMinutes: 60,
    dueDate: '2026-09-15T09:00',
    createdAt: new Date(Date.now() - 28800000).toISOString()
  },
  {
    id: 4,
    uuid: 'task-sample-4',
    title: 'Beli Buku Catatan & Pembayaran Tagihan Kos',
    description: 'Daftar kebutuhan bulanan dan simpan struk transfer pembayaran.',
    notes: 'Transfer via M-Banking / Loket Pembayaran Kampus',
    status: 'COMPLETED',
    priority: 'LOW',
    category: 'GENERAL',
    estimatedMinutes: 30,
    createdAt: new Date(Date.now() - 43200000).toISOString()
  }
];

const SAMPLE_COLLEGE_TASKS_EN: Task[] = [
  {
    id: 1,
    uuid: 'task-sample-1',
    title: 'Database Lab Report (Module 4)',
    courseName: 'Databases',
    description: 'Construct 3NF schemas, multi-table join queries, and attach execution console output.',
    notes: 'Submit on Campus LMS (Module 4 Assignment Dropbox in PDF)',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    category: 'PRAKTIKUM',
    estimatedMinutes: 90,
    dueDate: '2026-09-10T23:59',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 2,
    uuid: 'task-sample-2',
    title: 'Group Paper & Presentation Deck: IT Ethics',
    courseName: 'IT Ethics',
    description: 'Analyze data privacy regulations and prepare 10 slides for team presentation.',
    notes: 'Live presentation at Building F Room 204',
    status: 'TODO',
    priority: 'HIGH',
    category: 'KELOMPOK',
    estimatedMinutes: 120,
    dueDate: '2026-09-12T15:00',
    createdAt: new Date(Date.now() - 14400000).toISOString()
  },
  {
    id: 3,
    uuid: 'task-sample-3',
    title: 'Calculus II Midterm Review & Problem Set',
    courseName: 'Calculus II',
    description: 'Practice integral by parts and trigonometric substitutions questions.',
    notes: 'Exam venue: Central Lecture Hall Room 304',
    status: 'TODO',
    priority: 'MEDIUM',
    category: 'UJIAN',
    estimatedMinutes: 60,
    dueDate: '2026-09-15T09:00',
    createdAt: new Date(Date.now() - 28800000).toISOString()
  },
  {
    id: 4,
    uuid: 'task-sample-4',
    title: 'Restock Notebooks & Monthly Rent Payment',
    description: 'Prepare monthly supplies list and file wire transfer confirmation.',
    notes: 'Online Banking Transfer / Campus Cashier',
    status: 'COMPLETED',
    priority: 'LOW',
    category: 'GENERAL',
    estimatedMinutes: 30,
    createdAt: new Date(Date.now() - 43200000).toISOString()
  }
];

export default function App() {
  // Ensure dark mode is strictly enforced
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // 1. Language State
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem(LANG_KEY);
    return (savedLang === 'en' || savedLang === 'id') ? savedLang : 'id';
  });

  const t = translations[language];

  // 2. Personal tasks storage
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // 3. Custom Categories Storage
  const [customCategories, setCustomCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Combined all categories (default + custom)
  const allCategories = useMemo(() => {
    return [...DEFAULT_CATEGORIES, ...customCategories];
  }, [customCategories]);

  // Filters & State
  const [activeCategory, setActiveCategory] = useState<'ALL' | TaskCategory>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | TaskStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Active view for mobile navigation highlight
  const [mobileTab, setMobileTab] = useState<'tasks' | 'stats' | 'categories'>('tasks');

  // Real-time Save Feedback Indicator
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SAVED'>('SAVED');
  const [lastSavedTime, setLastSavedTime] = useState<string>(language === 'id' ? 'Tersimpan' : 'Saved');

  const [activities, setActivities] = useState<ActivityEvent[]>([
    {
      id: 'init-1',
      action: 'SYNCED',
      text: language === 'id' ? 'Sistem penyimpanan aktif & siap digunakan' : 'Storage system active & ready',
      timestamp: language === 'id' ? 'Baru saja' : 'Just now',
      service: 'core-api-php'
    }
  ]);

  // Persist Language
  useEffect(() => {
    localStorage.setItem(LANG_KEY, language);
  }, [language]);

  // Real-time Save Tasks to localStorage
  useEffect(() => {
    setSaveStatus('SAVING');
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(language === 'id' ? `Tersimpan ${timeStr}` : `Saved at ${timeStr}`);
      const timeout = setTimeout(() => setSaveStatus('SAVED'), 160);
      return () => clearTimeout(timeout);
    } catch (e) {
      console.error('Save error', e);
    }
  }, [tasks, language]);

  // Persist Custom Categories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(customCategories));
    } catch (e) {
      console.error('Custom categories save error', e);
    }
  }, [customCategories]);

  // Productivity Metrics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'COMPLETED').length;
    const remaining = total - completed;
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const urgentPending = tasks.filter(t => t.priority === 'URGENT' && t.status !== 'COMPLETED').length;

    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const collegeTasks = tasks.filter(t => t.category !== 'GENERAL').length;
    const generalTasks = tasks.filter(t => t.category === 'GENERAL').length;

    const burnoutIndex = total === 0 ? 0 : Math.min(Math.round((urgentPending / Math.max(total, 1)) * 60 + (inProgress / Math.max(total, 1)) * 40), 100);

    const burnoutLevel = burnoutIndex > 50 
      ? t.burnoutHeavy 
      : (burnoutIndex > 25 ? t.burnoutModerate : t.burnoutOptimal);

    return {
      total,
      completed,
      remaining,
      rate,
      collegeTasks,
      generalTasks,
      burnoutIndex,
      burnoutLevel
    };
  }, [tasks, t]);

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Category filter
      if (activeCategory !== 'ALL' && task.category !== activeCategory) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'ALL' && task.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const catInfo = getCategoryDisplayInfo(task.category, customCategories, t.categories);
        return (
          task.title.toLowerCase().includes(q) ||
          (task.courseName && task.courseName.toLowerCase().includes(q)) ||
          (catInfo.label.toLowerCase().includes(q)) ||
          task.priority.toLowerCase().includes(q) ||
          (task.notes && task.notes.toLowerCase().includes(q)) ||
          (task.description && task.description.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [tasks, activeCategory, statusFilter, searchQuery, customCategories, t]);

  // Task Actions
  const handleToggleTask = (id: number) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const nextStatus: TaskStatus = task.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
        const newActivity: ActivityEvent = {
          id: String(Date.now()),
          action: 'STATUS_CHANGED',
          text: language === 'id'
            ? `"${task.title.slice(0, 26)}..." ditandai ${nextStatus === 'COMPLETED' ? 'SELESAI' : 'DIKERJAKAN'}`
            : `"${task.title.slice(0, 26)}..." marked as ${nextStatus === 'COMPLETED' ? 'COMPLETED' : 'IN PROGRESS'}`,
          timestamp: language === 'id' ? 'Baru saja' : 'Just now',
          service: 'core-api-php'
        };
        setActivities(acts => [newActivity, ...acts.slice(0, 4)]);
        return { ...task, status: nextStatus };
      }
      return task;
    }));
  };

  const handleDeleteTask = (id: number) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (!taskToDelete) return;

    setTasks(prev => prev.filter(t => t.id !== id));
    setActivities(acts => [
      {
        id: String(Date.now()),
        action: 'DELETED',
        text: language === 'id' 
          ? `Tugas "${taskToDelete.title.slice(0, 26)}..." dihapus`
          : `Task "${taskToDelete.title.slice(0, 26)}..." removed`,
        timestamp: language === 'id' ? 'Baru saja' : 'Just now',
        service: 'core-api-php'
      },
      ...acts.slice(0, 4)
    ]);
  };

  const handleCreateTask = (newTaskData: Omit<Task, 'id' | 'uuid' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: Date.now(),
      uuid: 'task-' + Math.random().toString(36).substring(2, 10),
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [newTask, ...prev]);
    setActivities(acts => [
      {
        id: String(Date.now()),
        action: 'CREATED',
        text: language === 'id'
          ? `Tugas baru ditambahkan: "${newTask.title.slice(0, 26)}..."`
          : `New task added: "${newTask.title.slice(0, 26)}..."`,
        timestamp: language === 'id' ? 'Baru saja' : 'Just now',
        service: 'core-api-php'
      },
      ...acts.slice(0, 4)
    ]);
  };

  // Custom Category Actions
  const handleAddCategory = (newCat: CategoryItem) => {
    setCustomCategories(prev => [...prev, newCat]);
    setActivities(acts => [
      {
        id: String(Date.now()),
        action: 'CREATED',
        text: language === 'id' 
          ? `Kategori kustom "${newCat.label}" dibuat` 
          : `Custom category "${newCat.label}" created`,
        timestamp: language === 'id' ? 'Baru saja' : 'Just now',
        service: 'core-api-php'
      },
      ...acts.slice(0, 4)
    ]);
  };

  const handleUpdateCategory = (updatedCat: CategoryItem) => {
    setCustomCategories(prev => prev.map(c => c.id === updatedCat.id ? updatedCat : c));
    setActivities(acts => [
      {
        id: String(Date.now()),
        action: 'STATUS_CHANGED',
        text: language === 'id' 
          ? `Kategori "${updatedCat.label}" diperbarui` 
          : `Category "${updatedCat.label}" updated`,
        timestamp: language === 'id' ? 'Baru saja' : 'Just now',
        service: 'core-api-php'
      },
      ...acts.slice(0, 4)
    ]);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const catToDelete = customCategories.find(c => c.id === categoryId);
    // Reassign tasks using this category to GENERAL
    setTasks(prev => prev.map(t => {
      if (t.category === categoryId) {
        return { ...t, category: 'GENERAL' };
      }
      return t;
    }));

    setCustomCategories(prev => prev.filter(c => c.id !== categoryId));
    if (activeCategory === categoryId) {
      setActiveCategory('ALL');
    }

    setActivities(acts => [
      {
        id: String(Date.now()),
        action: 'DELETED',
        text: language === 'id' 
          ? `Kategori "${catToDelete?.label || categoryId}" dihapus` 
          : `Category "${catToDelete?.label || categoryId}" deleted`,
        timestamp: language === 'id' ? 'Baru saja' : 'Just now',
        service: 'core-api-php'
      },
      ...acts.slice(0, 4)
    ]);
  };

  const handleLoadSamples = () => {
    const samples = language === 'id' ? SAMPLE_COLLEGE_TASKS_ID : SAMPLE_COLLEGE_TASKS_EN;
    setTasks(samples);
    setActivities(acts => [
      {
        id: String(Date.now()),
        action: 'SYNCED',
        text: language === 'id' 
          ? 'Contoh tugas kuliah dimuat'
          : 'Sample course tasks loaded',
        timestamp: language === 'id' ? 'Baru saja' : 'Just now',
        service: 'core-api-php'
      },
      ...acts.slice(0, 4)
    ]);
  };

  const handleClearAll = () => {
    if (window.confirm(t.clearConfirm)) {
      setTasks([]);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'id' ? 'en' : 'id'));
  };

  const scrollToSection = (id: string, tab: 'tasks' | 'stats' | 'categories') => {
    setMobileTab(tab);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // SVG Gauge calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.rate / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#14100d] text-[#fbf7f4] relative pb-28 sm:pb-12 transition-colors duration-300 selection:bg-orange-500 selection:text-white">
      {/* Warm Sunset & Amber Atmospheric Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute -top-24 left-1/4 w-[620px] h-[620px] rounded-full blur-[130px] opacity-20"
          style={{ background: 'radial-gradient(circle, #ea580c 0%, rgba(234, 88, 12, 0) 70%)' }}
        />
        <div 
          className="absolute bottom-10 right-1/4 w-[540px] h-[540px] rounded-full blur-[140px] opacity-15"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, rgba(245, 158, 11, 0) 70%)' }}
        />
        <div 
          className="absolute top-1/2 -left-20 w-[420px] h-[420px] rounded-full blur-[130px] opacity-10"
          style={{ background: 'radial-gradient(circle, #e11d48 0%, rgba(225, 29, 72, 0) 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-3 sm:py-7">
        {/* ======================================================== */}
        {/* Top Frosted Warm Navigation Bar */}
        {/* ======================================================== */}
        <header 
          className="surface-nav flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-2xl sm:rounded-full mb-5 sm:mb-7 transition-all"
        >
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-rose-500 text-white flex items-center justify-center font-bold text-base shadow-sm shadow-orange-500/35 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm sm:text-base tracking-tight leading-none text-white truncate">{t.brandTitle}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-orange-500/15 text-orange-400 border border-orange-500/30 whitespace-nowrap shadow-2xs">
                  {t.brandBadge}
                </span>
              </div>
              <p className="text-[11px] font-medium text-stone-400 mt-0.5 hidden md:block">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Real-time Save Status Indicator Pill */}
            <div 
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold border transition-all ${
                saveStatus === 'SAVING'
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/25'
                  : 'bg-orange-500/15 text-orange-400 border-orange-500/25'
              }`}
              title={lastSavedTime}
            >
              <span className={`w-2 h-2 rounded-full ${saveStatus === 'SAVING' ? 'bg-amber-400 animate-spin' : 'bg-orange-400 animate-pulse'}`}></span>
              <span className="hidden sm:inline">
                {saveStatus === 'SAVING' ? t.savingStatus : t.savedStatus}
              </span>
            </div>

            {/* Language Switcher (Indonesian <-> English) */}
            <button
              onClick={toggleLanguage}
              className="min-w-[42px] h-9 px-2.5 sm:px-3 rounded-full flex items-center justify-center gap-1 text-xs font-bold transition-all border bg-stone-900/90 hover:bg-stone-800 border-orange-500/20 text-stone-200"
              aria-label="Toggle Language"
              title={t.langToggle}
            >
              <Languages className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[11px] tracking-wider uppercase font-extrabold">{language}</span>
            </button>

            {/* Quick Manage Categories Button in Header */}
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 h-9 rounded-full text-xs font-bold transition-all border bg-stone-900/90 hover:bg-stone-800 border-orange-500/20 text-orange-300 hover:text-white"
              title={t.manageCategories}
            >
              <Layers className="w-3.5 h-3.5 text-orange-400" />
              <span>{t.manageCategories}</span>
            </button>

            {/* Desktop / Tablet CTA Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 min-h-[38px] rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addTask}</span>
            </button>
          </div>
        </header>

        {/* ======================================================== */}
        {/* Bento Grid Layout */}
        {/* ======================================================== */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* ======================================================== */}
          {/* Bento Card 1: Study Focus & Velocity Gauge (Col 8) */}
          {/* ======================================================== */}
          <section 
            id="stats-section"
            className="surface-card lg:col-span-8 p-5 sm:p-7 rounded-3xl transition-all scroll-mt-20 relative overflow-hidden"
          >
            {/* Warm Sunset Accent Top Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400"></div>

            <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  {t.studyProgressTitle}
                </h2>
                <p className="text-xs font-semibold text-stone-400 mt-0.5">
                  {stats.total === 0 
                    ? t.emptyProgressDesc 
                    : `${stats.collegeTasks} ${t.academicTasks} • ${stats.generalTasks} ${t.generalActivities}`}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-extrabold tracking-wider ${
                stats.total === 0
                  ? 'bg-stone-800 text-stone-300 border border-stone-700'
                  : stats.burnoutIndex > 50 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {stats.burnoutLevel}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6 mt-3">
              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                    {stats.rate}%
                  </span>
                  <span className="text-xs font-bold text-stone-400">
                    {t.targetCompleted}
                  </span>
                  {stats.completed > 0 && (
                    <span className="flex items-center gap-1 text-xs font-bold text-orange-300 bg-orange-500/20 px-2.5 py-0.5 rounded-full border border-orange-500/40">
                      <CheckCheck className="w-3.5 h-3.5" />
                      {stats.completed} {t.tasksDone}
                    </span>
                  )}
                </div>

                <p className="text-xs font-medium text-stone-300 mt-2.5 leading-relaxed">
                  {stats.total === 0 
                    ? t.emptyStorageDesc 
                    : t.remainingDesc(stats.remaining)}
                </p>

                {/* Practical Student Tags with Warm Harmonized Hues */}
                <div className="flex flex-wrap gap-2 mt-4 sm:mt-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    <BookOpen className="w-3 h-3 text-amber-400" /> {t.tagAcademic}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-orange-500/15 text-orange-300 border border-orange-500/30">
                    <Check className="w-3 h-3 text-orange-400" /> {t.tagAutoSave}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                    <Flame className="w-3 h-3 text-rose-400" /> {t.tagFocus}
                  </span>
                </div>
              </div>

              {/* Warm Sunset Radial Progress Ring */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center self-center sm:self-auto shrink-0 my-1 sm:my-0">
                <svg className="w-24 h-24 sm:w-28 sm:h-28 transform -rotate-90" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="warmSunsetGauge" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ea580c" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#e11d48" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="stroke-stone-800 fill-none"
                    strokeWidth="8.5"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="url(#warmSunsetGauge)"
                    className="fill-none transition-all duration-700 ease-out"
                    strokeWidth="8.5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-white">{stats.rate}%</span>
                  <span className="text-[10px] uppercase font-black text-stone-400 tracking-wider">
                    {stats.completed}/{stats.total}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* Bento Card 2: Quick Status & Activity Feed (Col 4) */}
          {/* ======================================================== */}
          <section className="surface-card lg:col-span-4 p-5 sm:p-7 rounded-3xl transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3.5">
                <div>
                  <h3 className="text-sm sm:text-base font-bold tracking-tight text-white">{t.activityLogTitle}</h3>
                  <p className="text-[11px] font-semibold text-stone-400">{t.activityLogSubtitle}</p>
                </div>
                <span className="text-[10px] font-bold text-orange-400 bg-orange-500/15 px-2 py-0.5 rounded-full border border-orange-500/30">
                  Live
                </span>
              </div>

              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {activities.map((act) => (
                  <div 
                    key={act.id} 
                    className="p-2.5 rounded-2xl border text-xs transition-all bg-[#1b1512] border-orange-500/15 text-stone-300"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-stone-200 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        {act.action === 'CREATED' ? (language === 'id' ? 'Tugas Baru' : 'New Task') : (act.action === 'STATUS_CHANGED' ? (language === 'id' ? 'Status Berubah' : 'Status Update') : (act.action === 'DELETED' ? (language === 'id' ? 'Dihapus' : 'Deleted') : (language === 'id' ? 'Tersimpan' : 'Saved')))}
                      </span>
                      <span className="text-[10px] font-bold text-stone-400">{act.timestamp}</span>
                    </div>
                    <p className="text-stone-300 text-[11px] font-medium leading-snug">{act.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-3.5 border-t border-white/10 flex items-center gap-2">
              {tasks.length === 0 ? (
                <button
                  onClick={handleLoadSamples}
                  className="w-full min-h-[42px] py-2 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all bg-stone-900/80 hover:bg-stone-800 text-stone-200 border-orange-500/20"
                >
                  <BookOpen className="w-3.5 h-3.5 text-orange-400" />
                  <span>{t.loadSamples}</span>
                </button>
              ) : (
                <button
                  onClick={handleClearAll}
                  className="w-full min-h-[42px] py-2 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all bg-stone-900/80 hover:bg-rose-950/40 hover:text-rose-400 text-stone-400 border-orange-500/20"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.clearAll}</span>
                </button>
              )}
            </div>
          </section>

          {/* ======================================================== */}
          {/* Bento Card 3: Active Task Stream & Categories (Col 8) */}
          {/* ======================================================== */}
          <section 
            id="tasks-section"
            className="surface-card lg:col-span-8 p-4 sm:p-7 rounded-3xl transition-all scroll-mt-20"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-4 sm:mb-5">
              <div>
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  {t.taskStreamTitle}
                </h2>
                <p className="text-xs font-semibold text-stone-400 mt-0.5">
                  {t.taskStreamSubtitle}
                </p>
              </div>
              <div className="text-xs font-bold text-stone-300">
                {stats.remaining} {t.remaining} • {stats.completed} {t.done}
              </div>
            </div>

            {/* Category Filter Pills (Smooth touch swipe, includes Custom Categories + Add Button) */}
            <div className="mb-4 sm:mb-5 overflow-x-auto pb-2 -mx-3 px-3 sm:-mx-2 sm:px-2 flex items-center gap-2 no-scrollbar touch-pan-x">
              <button
                onClick={() => setActiveCategory('ALL')}
                className={`min-h-[38px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  activeCategory === 'ALL'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-500 shadow-sm shadow-orange-500/25'
                    : 'bg-stone-900/80 border-orange-500/20 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <span>{t.allCategories} ({tasks.length})</span>
              </button>

              {allCategories.map(cat => {
                const info = getCategoryDisplayInfo(cat.id, customCategories, t.categories);
                const Icon = info.icon || Sparkles;
                const isSelected = activeCategory === cat.id;
                const count = tasks.filter(t => t.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`min-h-[38px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-500 shadow-sm shadow-orange-500/25'
                        : 'bg-stone-900/80 border-orange-500/20 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-orange-400'}`} />
                    <span>{info.label}</span>
                    {info.isCustom && (
                      <span className="text-[9px] px-1 py-0.2 rounded-sm font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                        {t.customBadge}
                      </span>
                    )}
                    {count > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        isSelected ? 'bg-white/25 text-white' : 'bg-stone-800 text-orange-300 border border-stone-700'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Add / Manage Custom Categories Pill Button */}
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="min-h-[38px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0 bg-stone-900/60 border-dashed border-orange-500/40 text-orange-400 hover:text-orange-300 hover:border-orange-500 hover:bg-stone-850"
                title={t.manageCategories}
              >
                <FolderPlus className="w-3.5 h-3.5 text-orange-400" />
                <span>+ {t.manageCategories}</span>
              </button>
            </div>

            {/* Filter Pills & Search Input */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4 sm:mb-5">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full min-h-[42px] pl-10 pr-4 py-2 rounded-full text-base sm:text-xs font-medium outline-none transition-all bg-stone-900 border border-orange-500/20 text-white placeholder-stone-500 focus:border-orange-500"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar w-full sm:w-auto">
                {[
                  { id: 'ALL', label: t.statusAll },
                  { id: 'TODO', label: t.statusTodo },
                  { id: 'IN_PROGRESS', label: t.statusInProgress },
                  { id: 'COMPLETED', label: t.statusCompleted },
                ].map((pill) => {
                  const active = statusFilter === pill.id;
                  return (
                    <button
                      key={pill.id}
                      onClick={() => setStatusFilter(pill.id as any)}
                      className={`min-h-[36px] px-3.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                        active
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                          : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 border border-white/5'
                      }`}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Task Item List with Warm Tone Borders & Surfaces */}
            <div className="space-y-2.5 sm:space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="py-12 sm:py-16 text-center rounded-3xl border border-dashed transition-all p-4 border-stone-800 bg-stone-900/30">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-3xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                    <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-stone-200">
                    {tasks.length === 0 ? t.emptyTitleClean : t.emptyTitleNoMatch}
                  </h3>
                  <p className="text-xs font-medium text-stone-400 mt-1 max-w-sm mx-auto leading-relaxed">
                    {tasks.length === 0 ? t.emptyDescClean : t.emptyDescNoMatch}
                  </p>
                  {tasks.length === 0 && (
                    <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 mt-4">
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="min-h-[42px] px-5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/30 transition-transform active:scale-98"
                      >
                        {t.addFirstTask}
                      </button>
                      <button
                        onClick={handleLoadSamples}
                        className="min-h-[42px] px-4 py-2 rounded-full text-xs font-bold border bg-stone-800 text-stone-300 border-white/10 hover:bg-stone-700"
                      >
                        {t.loadSampleBtn}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const isCompleted = task.status === 'COMPLETED';
                  const catInfo = getCategoryDisplayInfo(task.category, customCategories, t.categories);
                  const CategoryIcon = catInfo.icon || Sparkles;

                  let priorityBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-extrabold';
                  let priorityLabel = t.medium;
                  if (task.priority === 'URGENT') {
                    priorityBadge = 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-extrabold';
                    priorityLabel = t.urgent;
                  } else if (task.priority === 'HIGH') {
                    priorityBadge = 'bg-orange-500/20 text-orange-300 border-orange-500/40 font-extrabold';
                    priorityLabel = t.high;
                  } else if (task.priority === 'LOW') {
                    priorityBadge = 'bg-stone-800 text-stone-300 border-stone-700 font-extrabold';
                    priorityLabel = t.low;
                  }

                  // Localized Date
                  const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString(
                    language === 'id' ? 'id-ID' : 'en-US',
                    { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }
                  ) : null;

                  return (
                    <div
                      key={task.id}
                      className={`flex items-start justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border transition-all bg-[#1b1512]/90 hover:bg-[#231b17] border-orange-500/15 hover:border-orange-500/25 ${
                        isCompleted ? 'opacity-60 bg-stone-900/40' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5 sm:gap-3.5 flex-1 min-w-0">
                        {/* Minimum 44px tap target for completion */}
                        <button
                          onClick={() => handleToggleTask(task.id)}
                          className="min-w-[42px] min-h-[42px] -ml-1.5 flex items-center justify-center text-stone-400 hover:text-orange-400 transition-colors shrink-0"
                          aria-label="Toggle task completion"
                          title={isCompleted ? 'Reopen' : 'Mark as done'}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-orange-400" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
                            {/* Course name badge */}
                            {task.courseName && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold bg-orange-950/70 text-orange-300 border border-orange-900/60 shadow-2xs">
                                <GraduationCap className="w-3.5 h-3.5 text-orange-400" />
                                <span className="truncate max-w-[160px]">{task.courseName}</span>
                              </span>
                            )}
                            
                            {/* Category Badge with custom icon and custom color */}
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold border shadow-2xs ${catInfo.badgeBg} ${catInfo.badgeText} ${catInfo.badgeBorder}`}>
                              <CategoryIcon className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{catInfo.label}</span>
                              {catInfo.isCustom && (
                                <span className="text-[9px] px-1 py-0.2 rounded-sm font-bold bg-white/10 text-white border border-white/20">
                                  {t.customBadge}
                                </span>
                              )}
                            </span>
                          </div>

                          <h4 className={`text-sm sm:text-base font-bold tracking-tight leading-snug break-words ${
                            isCompleted ? 'line-through text-stone-500 font-normal' : 'text-white'
                          }`}>
                            {task.title}
                          </h4>

                          {task.description && (
                            <p className="text-xs font-medium text-stone-300 mt-1 leading-relaxed break-words">
                              {task.description}
                            </p>
                          )}

                          {/* Notes: Reminder Lokasi Pengumpulan / Tempat Pelaksanaan */}
                          {task.notes && (
                            <div className="mt-2 flex items-start gap-1.5 px-2.5 py-1.5 rounded-xl text-xs bg-amber-500/10 border border-amber-500/25 text-amber-200">
                              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <div className="min-w-0 flex-1 leading-snug">
                                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider mr-1.5">
                                  {t.submissionReminder}:
                                </span>
                                <span className="font-medium text-stone-200 break-words">{task.notes}</span>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-[10px] sm:text-[11px] text-stone-400 font-semibold">
                            <span className={`px-2 py-0.5 rounded-full font-bold border shadow-2xs ${priorityBadge}`}>
                              {priorityLabel}
                            </span>

                            {formattedDate && (
                              <span className="flex items-center gap-1 font-bold text-orange-300">
                                <Calendar className="w-3 h-3" /> 
                                {t.deadline}: {formattedDate}
                              </span>
                            )}

                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-stone-500" /> {task.estimatedMinutes} {t.minutes}
                            </span>

                            <span className="text-stone-400 font-medium">
                              • {task.status === 'COMPLETED' ? t.statusCompleted : (task.status === 'IN_PROGRESS' ? t.statusInProgress : t.statusTodo)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Trash action button */}
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="min-w-[42px] min-h-[42px] flex items-center justify-center rounded-xl text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0 -mr-1"
                        title="Delete Task"
                        aria-label="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* ======================================================== */}
          {/* Bento Card 4: Kategori Ringkasan & Panduan (Col 4) */}
          {/* ======================================================== */}
          <section 
            id="categories-section"
            className="surface-card lg:col-span-4 p-5 sm:p-7 rounded-3xl transition-all flex flex-col justify-between scroll-mt-20"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div>
                  <h3 className="text-base font-bold tracking-tight text-white">{t.categoryDistTitle}</h3>
                  <p className="text-xs font-semibold text-stone-400">{t.categoryDistSubtitle}</p>
                </div>
                {/* Button to open Category Manager */}
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-bold border border-orange-500/30 text-orange-400 hover:text-white hover:bg-orange-500/20 transition-all flex items-center gap-1"
                  title={t.manageCategories}
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>{t.manageCategories}</span>
                </button>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {allCategories.map(cat => {
                  const info = getCategoryDisplayInfo(cat.id, customCategories, t.categories);
                  const Icon = info.icon || Sparkles;
                  const count = tasks.filter(t => t.category === cat.id).length;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => setActiveCategory(activeCategory === cat.id ? 'ALL' : cat.id)}
                      className={`flex items-center justify-between p-2.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                        activeCategory === cat.id
                          ? 'border-orange-500 bg-orange-500/15 text-white ring-1 ring-orange-400/40 shadow-xs'
                          : 'bg-stone-900/60 border-orange-500/10 hover:bg-stone-850'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`p-1.5 rounded-xl shrink-0 ${info.badgeBg}`}>
                          <Icon className={`w-3.5 h-3.5 ${info.badgeText}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-stone-200 truncate flex items-center gap-1.5">
                            <span>{info.label}</span>
                            {info.isCustom && (
                              <span className="text-[9px] px-1 py-0.2 rounded-sm font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                                {t.customBadge}
                              </span>
                            )}
                          </div>
                          {info.example && (
                            <div className="text-[11px] font-medium text-stone-400 truncate max-w-[170px] sm:max-w-[200px]">
                              {info.example}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full font-extrabold text-xs shrink-0 ml-2 ${
                        count > 0 
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-2xs' 
                          : 'bg-stone-800 text-stone-400 border border-stone-700'
                      }`}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-2xl text-xs font-bold bg-stone-900/90 hover:bg-stone-800 border border-orange-500/25 text-orange-300 hover:text-white flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addCustomCategory}</span>
              </button>

              <div className="p-3 rounded-2xl bg-stone-900/90 border border-orange-500/20 text-[11px] font-semibold text-stone-300 leading-relaxed shadow-xs">
                💡 {t.studentTips}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* ======================================================== */}
      {/* Mobile Bottom Action Dock */}
      {/* ======================================================== */}
      <nav 
        className="sm:hidden fixed bottom-3 left-3 right-3 z-40 rounded-full px-4 py-2 flex items-center justify-around shadow-xl surface-nav transition-all"
      >
        <button
          onClick={() => scrollToSection('tasks-section', 'tasks')}
          className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 px-3 rounded-2xl transition-colors ${
            mobileTab === 'tasks' ? 'text-orange-400 font-extrabold' : 'text-stone-400 hover:text-stone-200 font-bold'
          }`}
        >
          <LayoutList className="w-4 h-4" />
          <span className="text-[10px]">{t.mobileNavTasks}</span>
        </button>

        {/* Prominent Center Warm Floating Action Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="min-w-[50px] min-h-[50px] -mt-5 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/40 transform active:scale-95 transition-transform"
          aria-label={t.addTask}
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={() => scrollToSection('stats-section', 'stats')}
          className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 px-3 rounded-2xl transition-colors ${
            mobileTab === 'stats' ? 'text-orange-400 font-extrabold' : 'text-stone-400 hover:text-stone-200 font-bold'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-[10px]">{t.mobileNavStats}</span>
        </button>

        <button
          onClick={() => setIsCategoryModalOpen(true)}
          className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 px-3 rounded-2xl transition-colors ${
            mobileTab === 'categories' ? 'text-orange-400 font-extrabold' : 'text-stone-400 hover:text-stone-200 font-bold'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px]">{t.mobileNavCategories}</span>
        </button>
      </nav>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
        categories={allCategories}
        onOpenCategoryManager={() => setIsCategoryModalOpen(true)}
        language={language}
      />

      {/* Custom Category Manager Modal */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        customCategories={customCategories}
        tasks={tasks}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
        language={language}
      />
    </div>
  );
}
