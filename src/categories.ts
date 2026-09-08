import { 
  BookOpen, 
  FlaskConical, 
  GraduationCap, 
  Users, 
  BookMarked, 
  Award, 
  Briefcase, 
  Sparkles,
  Code,
  FileCode,
  Laptop,
  Palette,
  Dumbbell,
  Heart,
  Coffee,
  Music,
  Target,
  Rocket,
  Compass,
  Flame,
  Microscope,
  Calculator,
  Globe,
  DollarSign,
  PenTool,
  Calendar,
  Bookmark,
  CheckSquare,
  type LucideIcon
} from 'lucide-react';
import { CategoryItem } from './types';

export interface ColorTheme {
  id: string;
  name: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  accentHex: string;
}

export const CATEGORY_COLORS: Record<string, ColorTheme> = {
  orange: {
    id: 'orange',
    name: 'Sunset Orange',
    badgeBg: 'bg-orange-500/15',
    badgeText: 'text-orange-300',
    badgeBorder: 'border-orange-500/30',
    dotColor: 'bg-orange-500',
    accentHex: '#f97316'
  },
  amber: {
    id: 'amber',
    name: 'Warm Amber',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/30',
    dotColor: 'bg-amber-500',
    accentHex: '#f59e0b'
  },
  rose: {
    id: 'rose',
    name: 'Coral Rose',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/30',
    dotColor: 'bg-rose-500',
    accentHex: '#f43f5e'
  },
  red: {
    id: 'red',
    name: 'Crimson Red',
    badgeBg: 'bg-red-500/15',
    badgeText: 'text-red-300',
    badgeBorder: 'border-red-500/30',
    dotColor: 'bg-red-500',
    accentHex: '#ef4444'
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Jade',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/30',
    dotColor: 'bg-emerald-500',
    accentHex: '#10b981'
  },
  teal: {
    id: 'teal',
    name: 'Aqua Teal',
    badgeBg: 'bg-teal-500/15',
    badgeText: 'text-teal-300',
    badgeBorder: 'border-teal-500/30',
    dotColor: 'bg-teal-500',
    accentHex: '#14b8a6'
  },
  cyan: {
    id: 'cyan',
    name: 'Sky Cyan',
    badgeBg: 'bg-cyan-500/15',
    badgeText: 'text-cyan-300',
    badgeBorder: 'border-cyan-500/30',
    dotColor: 'bg-cyan-500',
    accentHex: '#06b6d4'
  },
  blue: {
    id: 'blue',
    name: 'Sapphire Blue',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-500/30',
    dotColor: 'bg-blue-500',
    accentHex: '#3b82f6'
  },
  indigo: {
    id: 'indigo',
    name: 'Deep Indigo',
    badgeBg: 'bg-indigo-500/15',
    badgeText: 'text-indigo-300',
    badgeBorder: 'border-indigo-500/30',
    dotColor: 'bg-indigo-500',
    accentHex: '#6366f1'
  },
  violet: {
    id: 'violet',
    name: 'Royal Violet',
    badgeBg: 'bg-violet-500/15',
    badgeText: 'text-violet-300',
    badgeBorder: 'border-violet-500/30',
    dotColor: 'bg-violet-500',
    accentHex: '#8b5cf6'
  },
  pink: {
    id: 'pink',
    name: 'Neon Pink',
    badgeBg: 'bg-pink-500/15',
    badgeText: 'text-pink-300',
    badgeBorder: 'border-pink-500/30',
    dotColor: 'bg-pink-500',
    accentHex: '#ec4899'
  },
  stone: {
    id: 'stone',
    name: 'Warm Slate',
    badgeBg: 'bg-stone-500/15',
    badgeText: 'text-stone-300',
    badgeBorder: 'border-stone-500/30',
    dotColor: 'bg-stone-400',
    accentHex: '#78716c'
  }
};

export const AVAILABLE_ICONS: Record<string, { label: string; icon: LucideIcon }> = {
  BookOpen: { label: 'Buku / Tugas', icon: BookOpen },
  FlaskConical: { label: 'Praktikum / Lab', icon: FlaskConical },
  GraduationCap: { label: 'Kuliah / Wisuda', icon: GraduationCap },
  Users: { label: 'Kelompok / Diskusi', icon: Users },
  BookMarked: { label: 'Belajar / Catatan', icon: BookMarked },
  Award: { label: 'Organisasi / Prestasi', icon: Award },
  Briefcase: { label: 'Magang / Karier', icon: Briefcase },
  Sparkles: { label: 'Umum / Pribadi', icon: Sparkles },
  Code: { label: 'Pemrograman / Koding', icon: Code },
  FileCode: { label: 'Proyek Skrip / File', icon: FileCode },
  Laptop: { label: 'Laptop / Online', icon: Laptop },
  Palette: { label: 'Desain & Seni', icon: Palette },
  Dumbbell: { label: 'Olahraga / Fitness', icon: Dumbbell },
  Heart: { label: 'Kesehatan / Wellness', icon: Heart },
  Coffee: { label: 'Istirahat / Santai', icon: Coffee },
  Music: { label: 'Musik / Kreatif', icon: Music },
  Target: { label: 'Target / Ambisi', icon: Target },
  Rocket: { label: 'Proyek / Peluncuran', icon: Rocket },
  Compass: { label: 'Riset & Eksplorasi', icon: Compass },
  Flame: { label: 'Fokus & Penting', icon: Flame },
  Microscope: { label: 'Penelitian / Sains', icon: Microscope },
  Calculator: { label: 'Hitungan / Matematika', icon: Calculator },
  Globe: { label: 'Bahasa / Internasional', icon: Globe },
  DollarSign: { label: 'Keuangan / Bisnis', icon: DollarSign },
  PenTool: { label: 'Menulis / Jurnal', icon: PenTool },
  Calendar: { label: 'Jadwal / Agenda', icon: Calendar },
  Bookmark: { label: 'Penanda / Referensi', icon: Bookmark },
  CheckSquare: { label: 'Target Selesai', icon: CheckSquare }
};

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 'TUGAS_KULIAH',
    label: 'Tugas Kuliah',
    iconName: 'BookOpen',
    color: 'amber',
    example: 'PR mingguan, resume jurnal, paper kuliah',
    isCustom: false
  },
  {
    id: 'PRAKTIKUM',
    label: 'Praktikum & Lab',
    iconName: 'FlaskConical',
    color: 'orange',
    example: 'Laporan praktikum, pre-test, responsi',
    isCustom: false
  },
  {
    id: 'UJIAN',
    label: 'Ujian & Kuis',
    iconName: 'GraduationCap',
    color: 'rose',
    example: 'Persiapan UTS, UAS, kuis mingguan',
    isCustom: false
  },
  {
    id: 'KELOMPOK',
    label: 'Tugas Kelompok',
    iconName: 'Users',
    color: 'amber',
    example: 'Makalah tim, slide presentasi kelompok',
    isCustom: false
  },
  {
    id: 'BELAJAR',
    label: 'Belajar Mandiri',
    iconName: 'BookMarked',
    color: 'orange',
    example: 'Membaca modul, latihan soal mandiri',
    isCustom: false
  },
  {
    id: 'ORGANISASI',
    label: 'Organisasi & Kampus',
    iconName: 'Award',
    color: 'red',
    example: 'Rapat BEM/HIMA, kepanitiaan acara',
    isCustom: false
  },
  {
    id: 'MAGANG',
    label: 'Magang & Karier',
    iconName: 'Briefcase',
    color: 'amber',
    example: 'Tugas magang, portofolio, asistensi',
    isCustom: false
  },
  {
    id: 'GENERAL',
    label: 'Pribadi & Lainnya',
    iconName: 'Sparkles',
    color: 'stone',
    example: 'Beli buku, bayar UKT/SPP, gym, belanja',
    isCustom: false
  }
];

export interface CategoryDisplayInfo {
  id: string;
  label: string;
  icon: LucideIcon;
  iconName: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  example: string;
  isCustom: boolean;
}

export function getCategoryDisplayInfo(
  catId: string,
  customCategories: CategoryItem[] = [],
  tCategories?: Record<string, { label: string; example: string }>
): CategoryDisplayInfo {
  // 1. Look in custom categories first
  const custom = customCategories.find((c) => c.id === catId);
  if (custom) {
    const colorTheme = CATEGORY_COLORS[custom.color] || CATEGORY_COLORS.orange;
    const iconObj = AVAILABLE_ICONS[custom.iconName] || AVAILABLE_ICONS.Sparkles;
    return {
      id: custom.id,
      label: custom.label,
      icon: iconObj.icon,
      iconName: custom.iconName,
      color: custom.color,
      badgeBg: colorTheme.badgeBg,
      badgeText: colorTheme.badgeText,
      badgeBorder: colorTheme.badgeBorder,
      dotColor: colorTheme.dotColor,
      example: custom.example || '',
      isCustom: true
    };
  }

  // 2. Look in default categories
  const def = DEFAULT_CATEGORIES.find((c) => c.id === catId);
  if (def) {
    const colorTheme = CATEGORY_COLORS[def.color] || CATEGORY_COLORS.orange;
    const iconObj = AVAILABLE_ICONS[def.iconName] || AVAILABLE_ICONS.Sparkles;
    const translated = tCategories && tCategories[def.id];

    return {
      id: def.id,
      label: translated ? translated.label : def.label,
      icon: iconObj.icon,
      iconName: def.iconName,
      color: def.color,
      badgeBg: colorTheme.badgeBg,
      badgeText: colorTheme.badgeText,
      badgeBorder: colorTheme.badgeBorder,
      dotColor: colorTheme.dotColor,
      example: translated ? translated.example : (def.example || ''),
      isCustom: false
    };
  }

  // Fallback for any unknown category string
  const fallbackColor = CATEGORY_COLORS.orange;
  return {
    id: catId,
    label: catId,
    icon: Sparkles,
    iconName: 'Sparkles',
    color: 'orange',
    badgeBg: fallbackColor.badgeBg,
    badgeText: fallbackColor.badgeText,
    badgeBorder: fallbackColor.badgeBorder,
    dotColor: fallbackColor.dotColor,
    example: '',
    isCustom: true
  };
}
