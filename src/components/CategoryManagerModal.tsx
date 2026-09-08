import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Sparkles, 
  Layers, 
  Search,
  AlertCircle
} from 'lucide-react';
import { CategoryItem, Task } from '../types';
import { 
  CATEGORY_COLORS, 
  AVAILABLE_ICONS, 
  DEFAULT_CATEGORIES, 
  getCategoryDisplayInfo 
} from '../categories';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customCategories: CategoryItem[];
  tasks: Task[];
  onAddCategory: (category: CategoryItem) => void;
  onUpdateCategory: (category: CategoryItem) => void;
  onDeleteCategory: (categoryId: string) => void;
  language: 'id' | 'en';
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  customCategories,
  tasks,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  language
}) => {
  const isId = language === 'id';

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [label, setLabel] = useState('');
  const [example, setExample] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>('orange');
  const [selectedIcon, setSelectedIcon] = useState<string>('Sparkles');
  const [iconSearch, setIconSearch] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleStartEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setLabel(cat.label);
    setExample(cat.example || '');
    setSelectedColor(cat.color || 'orange');
    setSelectedIcon(cat.iconName || 'Sparkles');
    setErrorMsg('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setLabel('');
    setExample('');
    setSelectedColor('orange');
    setSelectedIcon('Sparkles');
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLabel = label.trim();
    if (!cleanLabel) {
      setErrorMsg(isId ? 'Nama kategori tidak boleh kosong' : 'Category name cannot be empty');
      return;
    }

    // Check duplicate name
    const existingDefault = DEFAULT_CATEGORIES.some(
      (c) => c.label.toLowerCase() === cleanLabel.toLowerCase()
    );
    const existingCustom = customCategories.some(
      (c) => c.id !== editingId && c.label.toLowerCase() === cleanLabel.toLowerCase()
    );

    if (existingDefault || existingCustom) {
      setErrorMsg(isId ? 'Kategori dengan nama ini sudah ada' : 'A category with this name already exists');
      return;
    }

    if (editingId) {
      // Update existing
      onUpdateCategory({
        id: editingId,
        label: cleanLabel,
        iconName: selectedIcon,
        color: selectedColor,
        example: example.trim(),
        isCustom: true
      });
      handleCancelEdit();
    } else {
      // Create new
      const newId = 'custom_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      onAddCategory({
        id: newId,
        label: cleanLabel,
        iconName: selectedIcon,
        color: selectedColor,
        example: example.trim(),
        isCustom: true
      });
      handleCancelEdit();
    }
  };

  const handleDelete = (id: string, catLabel: string) => {
    const tasksCount = tasks.filter((t) => t.category === id).length;
    let confirmMsg = isId 
      ? `Hapus kategori "${catLabel}"?`
      : `Delete category "${catLabel}"?`;

    if (tasksCount > 0) {
      confirmMsg += isId
        ? `\n\nAda ${tasksCount} tugas yang memakai kategori ini. Tugas-tugas tersebut akan dialihkan ke kategori "Pribadi & Lainnya".`
        : `\n\nThere are ${tasksCount} tasks in this category. They will be reassigned to "Personal & Errands".`;
    }

    if (window.confirm(confirmMsg)) {
      onDeleteCategory(id);
      if (editingId === id) {
        handleCancelEdit();
      }
    }
  };

  // Filtered icons for search
  const filteredIconEntries = Object.entries(AVAILABLE_ICONS).filter(([name, info]) => {
    if (!iconSearch.trim()) return true;
    const q = iconSearch.toLowerCase();
    return name.toLowerCase().includes(q) || info.label.toLowerCase().includes(q);
  });

  const previewColorTheme = CATEGORY_COLORS[selectedColor] || CATEGORY_COLORS.orange;
  const PreviewIconComp = AVAILABLE_ICONS[selectedIcon]?.icon || Sparkles;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#1c1612] border border-orange-500/25 rounded-3xl shadow-2xl text-stone-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-orange-500/15 bg-gradient-to-r from-orange-500/10 to-transparent shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                {isId ? 'Kelola Kategori Tugas' : 'Manage Task Categories'}
              </h2>
              <p className="text-xs text-stone-400">
                {isId 
                  ? 'Kustomisasi ikon, warna, dan kategori sesuai kebutuhan belajarmu' 
                  : 'Customize icons, colors, and categories tailored to your workflow'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-900/80 hover:bg-stone-800 border border-orange-500/20 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - 2 Columns on desktop */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6 sm:space-y-0 sm:grid sm:grid-cols-12 sm:gap-7 flex-1">
          {/* Column 1: Add / Edit Form (col-span-7) */}
          <div className="sm:col-span-7 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-orange-300 flex items-center gap-1.5">
                {editingId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingId 
                  ? (isId ? 'Edit Kategori Kustom' : 'Edit Custom Category')
                  : (isId ? 'Buat Kategori Kustom Baru' : 'Create New Custom Category')}
              </h3>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs text-stone-400 hover:text-stone-200 underline"
                >
                  {isId ? 'Batal Edit' : 'Cancel Edit'}
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Name Input */}
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  {isId ? 'Nama Kategori' : 'Category Name'} <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => {
                    setLabel(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder={isId ? 'Contoh: Skripsi, Hackathon, Freelance, Gym' : 'e.g. Thesis, Coding Projects, Fitness'}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-900/90 border border-orange-500/20 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-orange-500 transition-colors"
                  maxLength={40}
                  autoFocus
                />
                {errorMsg && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errorMsg}
                  </p>
                )}
              </div>

              {/* Description / Example */}
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  {isId ? 'Catatan / Contoh Singkat (Opsional)' : 'Example / Short Note (Optional)'}
                </label>
                <input
                  type="text"
                  value={example}
                  onChange={(e) => setExample(e.target.value)}
                  placeholder={isId ? 'Contoh: Bimbingan dosen, revisi bab 2-3' : 'e.g. Advisor meeting, paper draft revision'}
                  className="w-full px-3.5 py-2 rounded-2xl bg-stone-900/90 border border-orange-500/20 text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-orange-500 transition-colors"
                  maxLength={70}
                />
              </div>

              {/* Color Theme Swatches */}
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-2">
                  {isId ? 'Pilih Warna Aksen' : 'Select Accent Color'}
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {Object.values(CATEGORY_COLORS).map((c) => {
                    const isSelected = selectedColor === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedColor(c.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
                          isSelected 
                            ? 'bg-stone-800 border-orange-500 ring-2 ring-orange-500/40 text-white shadow-sm' 
                            : 'bg-stone-900/70 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-850'
                        }`}
                        title={c.name}
                      >
                        <span 
                          className="w-3 h-3 rounded-full shrink-0 shadow-xs" 
                          style={{ backgroundColor: c.accentHex }}
                        />
                        <span className="truncate">{c.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Icon Picker */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-stone-300">
                    {isId ? 'Pilih Ikon Simbol' : 'Select Category Icon'}
                  </label>
                  <div className="relative w-36">
                    <Search className="w-3 h-3 absolute left-2 top-2 text-stone-500" />
                    <input
                      type="text"
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                      placeholder={isId ? 'Cari ikon...' : 'Search icon...'}
                      className="w-full pl-6 pr-2 py-1 rounded-xl bg-stone-900 border border-stone-800 text-[11px] text-stone-300 placeholder:text-stone-600 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-6 sm:grid-cols-7 gap-1.5 max-h-40 overflow-y-auto p-2 bg-stone-900/60 rounded-2xl border border-orange-500/10">
                  {filteredIconEntries.map(([iconKey, iconInfo]) => {
                    const IconComponent = iconInfo.icon;
                    const isSelected = selectedIcon === iconKey;
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setSelectedIcon(iconKey)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                          isSelected
                            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 ring-2 ring-orange-400'
                            : 'bg-stone-900/90 text-stone-400 hover:text-stone-200 hover:bg-stone-800 border border-stone-800/80'
                        }`}
                        title={iconInfo.label}
                      >
                        <IconComponent className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-orange-500/15">
                <div className="text-[11px] font-bold text-stone-400 mb-2">
                  {isId ? 'Pratinjau Tampilan Badge:' : 'Live Badge Preview:'}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${previewColorTheme.badgeBg} ${previewColorTheme.badgeText} ${previewColorTheme.badgeBorder}`}>
                    <PreviewIconComp className="w-3.5 h-3.5" />
                    <span>{label.trim() || (isId ? 'Nama Kategori' : 'Category Name')}</span>
                  </span>
                  <span className="text-[11px] text-stone-500 truncate max-w-[200px]">
                    {example.trim() || (isId ? 'Contoh deskripsi tugas' : 'Example task note')}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-2xl font-bold text-xs sm:text-sm bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>
                  {editingId 
                    ? (isId ? 'Perbarui Kategori' : 'Update Category')
                    : (isId ? 'Simpan Kategori Baru' : 'Save New Category')}
                </span>
              </button>
            </form>
          </div>

          {/* Column 2: Existing Categories List (col-span-5) */}
          <div className="sm:col-span-5 space-y-4 pt-4 sm:pt-0 sm:border-l sm:border-orange-500/15 sm:pl-7">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-200 flex items-center gap-1.5">
                <span>{isId ? 'Daftar Kategori Anda' : 'Your Categories'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-stone-800 text-stone-300 border border-stone-700">
                  {DEFAULT_CATEGORIES.length + customCategories.length}
                </span>
              </h3>
            </div>

            {/* Custom categories group */}
            <div className="space-y-2">
              <div className="text-[11px] font-extrabold tracking-wider uppercase text-orange-400">
                {isId ? 'Kategori Kustom' : 'Custom Categories'} ({customCategories.length})
              </div>

              {customCategories.length === 0 ? (
                <div className="p-4 rounded-2xl border border-dashed border-stone-800 bg-stone-900/40 text-center">
                  <Sparkles className="w-5 h-5 text-orange-400/80 mx-auto mb-1.5" />
                  <p className="text-xs text-stone-400 leading-relaxed">
                    {isId 
                      ? 'Belum ada kategori kustom. Buat kategori khusus seperti Skripsi, Lomba, atau Proyek Pribadi melalui form di samping.' 
                      : 'No custom categories yet. Create one via the form on the left.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {customCategories.map((cat) => {
                    const info = getCategoryDisplayInfo(cat.id, customCategories);
                    const IconComp = info.icon;
                    const count = tasks.filter((t) => t.category === cat.id).length;

                    return (
                      <div
                        key={cat.id}
                        className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                          editingId === cat.id
                            ? 'bg-orange-500/15 border-orange-500/50'
                            : 'bg-stone-900/70 border-stone-800 hover:border-orange-500/30'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`p-1.5 rounded-xl border ${info.badgeBg} ${info.badgeText} ${info.badgeBorder}`}>
                            <IconComp className="w-3.5 h-3.5" />
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate max-w-[130px]">
                              {cat.label}
                            </div>
                            <div className="text-[10px] text-stone-400">
                              {count} {isId ? 'tugas aktif' : 'tasks'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(cat)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                            title={isId ? 'Edit Kategori' : 'Edit Category'}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(cat.id, cat.label)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition-colors"
                            title={isId ? 'Hapus Kategori' : 'Delete Category'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Default categories group */}
            <div className="space-y-2 pt-2 border-t border-stone-800/80">
              <div className="text-[11px] font-extrabold tracking-wider uppercase text-stone-500">
                {isId ? 'Kategori Bawaan' : 'Default Categories'} ({DEFAULT_CATEGORIES.length})
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {DEFAULT_CATEGORIES.map((cat) => {
                  const info = getCategoryDisplayInfo(cat.id);
                  const IconComp = info.icon;
                  const count = tasks.filter((t) => t.category === cat.id).length;

                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-stone-900/40 border border-stone-850 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`p-1 rounded-lg border ${info.badgeBg} ${info.badgeText} ${info.badgeBorder}`}>
                          <IconComp className="w-3 h-3" />
                        </span>
                        <span className="font-semibold text-stone-300 truncate max-w-[140px]">
                          {cat.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-500 font-bold">
                        {count} {isId ? 'tugas' : 'tasks'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-7 py-3 border-t border-orange-500/15 bg-stone-900/60 flex items-center justify-between text-[11px] text-stone-400 shrink-0">
          <span>💡 {isId ? 'Kategori kustom tersimpan otomatis di perangkat Anda' : 'Custom categories are saved automatically to your device'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold transition-colors"
          >
            {isId ? 'Tutup' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
