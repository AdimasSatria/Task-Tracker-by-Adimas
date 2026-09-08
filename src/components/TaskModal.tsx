import React, { useState } from 'react';
import { X, Clock, Calendar, GraduationCap, PlusCircle, Plus, Sparkles, MapPin } from 'lucide-react';
import { Task, TaskPriority, TaskCategory, Language, CategoryItem } from '../types';
import { getCategoryDisplayInfo } from '../categories';
import { translations } from '../translations';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'uuid' | 'createdAt'>) => void;
  categories: CategoryItem[];
  onOpenCategoryManager?: () => void;
  language: Language;
}

export const TaskModal: React.FC<TaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  categories,
  onOpenCategoryManager,
  language 
}) => {
  const t = translations[language];
  const [title, setTitle] = useState('');
  const [courseName, setCourseName] = useState('');
  const [notes, setNotes] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>(categories[0]?.id || 'TUGAS_KULIAH');
  const [priority, setPriority] = useState<TaskPriority>('HIGH');
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);
  const [dueDate, setDueDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      courseName: courseName.trim() || undefined,
      notes: notes.trim() || undefined,
      description: description.trim() || undefined,
      category,
      priority,
      status: 'TODO',
      estimatedMinutes: Number(estimatedMinutes) || 45,
      dueDate: dueDate || undefined
    });

    setTitle('');
    setCourseName('');
    setNotes('');
    setDescription('');
    setCategory(categories[0]?.id || 'TUGAS_KULIAH');
    setPriority('HIGH');
    setEstimatedMinutes(60);
    setDueDate('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs transition-all">
      <div 
        className="w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 transition-all shadow-2xl relative max-h-[92vh] sm:max-h-[90vh] overflow-y-auto bg-[#1a1411] text-stone-100 border-t sm:border border-orange-500/25"
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="sm:hidden flex justify-center pb-2">
          <div className="w-12 h-1.5 rounded-full bg-stone-700"></div>
        </div>

        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold shrink-0 shadow-2xs">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                {t.taskModalTitle}
              </h2>
              <p className="text-xs font-medium text-stone-400">{t.addTaskDesc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Judul Tugas */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
              {t.taskTitleLabel} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.taskTitlePlaceholder}
              className="w-full px-4 py-3 rounded-2xl text-base sm:text-sm font-medium outline-none transition-all bg-stone-900 border border-orange-500/25 text-white placeholder:text-stone-500 focus:border-orange-500 shadow-xs"
            />
          </div>

          {/* Mata Kuliah / Bidang & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                {t.courseLabel}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder={t.coursePlaceholder}
                  className="w-full pl-9 pr-3 py-2.5 min-h-[44px] sm:min-h-0 rounded-xl text-base sm:text-sm font-medium outline-none transition-all bg-stone-900 border border-orange-500/25 text-white placeholder:text-stone-500 focus:border-orange-500 shadow-xs"
                />
                <GraduationCap className="w-4 h-4 absolute left-3 top-3.5 sm:top-3 text-orange-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                {t.dueDateLabel}
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 min-h-[44px] sm:min-h-0 rounded-xl text-base sm:text-sm font-medium outline-none transition-all bg-stone-900 border border-orange-500/25 text-white focus:border-orange-500 shadow-xs"
                />
                <Calendar className="w-4 h-4 absolute left-3 top-3.5 sm:top-3 text-orange-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Pilihan Kategori Kegiatan dengan Icon & Tombol Tambah Kategori */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300">
                {t.categoryLabel}
              </label>
              {onOpenCategoryManager && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCategoryManager();
                  }}
                  className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'id' ? '+ Kelola Kategori' : '+ Manage Categories'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const info = getCategoryDisplayInfo(cat.id, categories, t.categories);
                const Icon = info.icon || Sparkles;
                const isSelected = category === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all text-left border ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-500 shadow-sm shadow-orange-500/25'
                        : 'bg-stone-900/90 border-stone-800 text-stone-300 hover:bg-stone-800 hover:border-orange-500/30'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-orange-400'}`} />
                    <span className="truncate">{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prioritas & Estimasi Waktu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                {t.priorityLabel}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2.5 min-h-[44px] sm:min-h-0 rounded-xl text-base sm:text-sm font-semibold outline-none bg-stone-900 border border-orange-500/25 text-white focus:border-orange-500 shadow-xs"
              >
                <option value="URGENT">{t.priorityUrgent}</option>
                <option value="HIGH">{t.priorityHigh}</option>
                <option value="MEDIUM">{t.priorityMedium}</option>
                <option value="LOW">{t.priorityLow}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                {t.estimateLabel}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={5}
                  step={5}
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  className="w-full pl-9 pr-14 py-2.5 min-h-[44px] sm:min-h-0 rounded-xl text-base sm:text-sm font-semibold outline-none bg-stone-900 border border-orange-500/25 text-white focus:border-orange-500 shadow-xs"
                />
                <Clock className="w-4 h-4 absolute left-3 top-3.5 sm:top-3 text-orange-400 pointer-events-none" />
                <span className="absolute right-3 top-3.5 sm:top-3 text-xs font-bold text-stone-400">{t.minutes}</span>
              </div>
            </div>
          </div>

          {/* Kolom Notes: Reminder Lokasi Pengumpulan / Tempat Pelaksanaan */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5 flex items-center justify-between">
              <span>{t.submissionNotesLabel}</span>
              <span className="text-[10px] text-amber-400 font-bold lowercase tracking-wider bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">reminder</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.submissionNotesPlaceholder}
                className="w-full pl-9 pr-3 py-2.5 min-h-[44px] sm:min-h-0 rounded-xl text-base sm:text-sm font-medium outline-none transition-all bg-stone-900 border border-orange-500/25 text-white placeholder:text-stone-500 focus:border-orange-500 shadow-xs"
              />
              <MapPin className="w-4 h-4 absolute left-3 top-3.5 sm:top-3 text-orange-400 pointer-events-none" />
            </div>
          </div>

          {/* Catatan / Deskripsi Tambahan */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
              {t.descLabel}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.descPlaceholder}
              className="w-full px-4 py-2.5 rounded-xl text-base sm:text-sm font-medium outline-none transition-all resize-none bg-stone-900 border border-orange-500/25 text-white placeholder:text-stone-500 focus:border-orange-500 shadow-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 sm:pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial min-h-[44px] px-5 py-2.5 rounded-full text-sm font-bold transition-all bg-stone-800 text-stone-300 hover:bg-stone-700"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-initial min-h-[44px] px-6 py-2.5 rounded-full text-sm font-bold bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/30 transition-all transform active:scale-98"
            >
              {t.saveTask}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
