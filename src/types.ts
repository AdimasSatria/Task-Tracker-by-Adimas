export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type Language = 'id' | 'en';

export type TaskCategory = string;

export interface CategoryItem {
  id: string;
  label: string;
  iconName: string;
  color: string;
  example?: string;
  isCustom?: boolean;
}

export interface Task {
  id: number;
  uuid: string;
  title: string;
  courseName?: string; // Mata Kuliah (misal: "Struktur Data", "Kalkulus", "Manajemen")
  description?: string;
  notes?: string; // Reminder kecil lokasi pengumpulan / tempat pelaksanaan (misal: "Google Classroom", "Lab Komputer 3", "Email Dosen")
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  estimatedMinutes: number;
  actualMinutes?: number;
  dueDate?: string; // Deadline tanggal & jam pengumpulan
  completedAt?: string;
  createdAt: string;
}

export interface CategoryMeta {
  id: TaskCategory;
  label: string;
  iconName: string;
  badgeClass: string;
  description: string;
}

export interface ActivityEvent {
  id: string;
  action: 'CREATED' | 'STATUS_CHANGED' | 'SYNCED' | 'METRIC' | 'DELETED';
  text: string;
  timestamp: string;
  service: 'realtime-go' | 'core-api-php' | 'core-api-java' | 'analytics-python';
}

export interface AnalyticsReport {
  velocityScore: number;
  completionRate: number;
  burnoutIndex: number;
  burnoutLevel: 'OPTIMAL' | 'MODERATE' | 'HIGH RISK';
  peakWindow: string;
  categoryDistribution: Record<string, number>;
}

