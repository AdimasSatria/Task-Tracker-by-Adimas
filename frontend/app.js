/**
 * ==========================================================
 * Premium Task Tracker — Vanilla JavaScript Frontend Engine
 * Apple & Samsung One UI interaction, College & General Tasks
 * Real-Time Auto Save & Light / Dark Theme Support
 * ==========================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'ptt_personal_student_tasks';
  const THEME_KEY = 'ptt_theme';

  const CATEGORIES = {
    TUGAS_KULIAH: { id: 'TUGAS_KULIAH', label: 'Tugas Kuliah', icon: '📚', badge: 'priority-medium' },
    PRAKTIKUM: { id: 'PRAKTIKUM', label: 'Praktikum & Lab', icon: '🔬', badge: 'priority-urgent' },
    UJIAN: { id: 'UJIAN', label: 'Ujian & Kuis', icon: '🎓', badge: 'priority-high' },
    KELOMPOK: { id: 'KELOMPOK', label: 'Tugas Kelompok', icon: '👥', badge: 'priority-high' },
    BELAJAR: { id: 'BELAJAR', label: 'Belajar Mandiri', icon: '📖', badge: 'priority-medium' },
    ORGANISASI: { id: 'ORGANISASI', label: 'Organisasi & BEM', icon: '🏛️', badge: 'priority-low' },
    MAGANG: { id: 'MAGANG', label: 'Magang & Karier', icon: '💼', badge: 'priority-medium' },
    GENERAL: { id: 'GENERAL', label: 'General / Pribadi', icon: '🌟', badge: 'priority-low' }
  };

  // State Management: Empty by default for personal use as requested
  const state = {
    tasks: (function () {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
      return [];
    })(),
    filter: 'ALL',
    categoryFilter: 'ALL',
    searchQuery: '',
    // Default to Light mode as requested ("jangan gelap dong atau buat opsi light dan dark")
    theme: localStorage.getItem(THEME_KEY) || 'light',
    activityLog: [
      { id: 1, action: 'SYNCED', text: 'Penyimpanan real-time tersambung & aktif', time: 'Baru saja' }
    ]
  };

  // DOM Elements
  const tasksListContainer = document.getElementById('tasksListContainer');
  const taskSearchInput = document.getElementById('taskSearchInput');
  const filterPills = document.querySelectorAll('.filter-pill');
  const taskCounterText = document.getElementById('taskCounterText');
  const velocityScoreEl = document.getElementById('velocityScore');
  const gaugeCircle = document.getElementById('gaugeCircle');
  const gaugePercentageEl = document.getElementById('gaugePercentage');
  const burnoutRiskBadge = document.getElementById('burnoutRiskBadge');
  const activityFeedEl = document.getElementById('activityFeed');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const openCreateModalBtn = document.getElementById('openCreateModalBtn');
  const closeCreateModalBtn = document.getElementById('closeCreateModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const createTaskModal = document.getElementById('createTaskModal');
  const createTaskForm = document.getElementById('createTaskForm');
  const wsStatusText = document.getElementById('wsStatusText');

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
      if (wsStatusText) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        wsStatusText.textContent = `Tersimpan Real-Time (${timeStr})`;
      }
    } catch (e) {
      console.error(e);
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    state.theme = theme;
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  function updateMetrics() {
    const total = state.tasks.length;
    const completed = state.tasks.filter(t => t.status === 'COMPLETED').length;
    const pendingUrgent = state.tasks.filter(t => t.priority === 'URGENT' && t.status !== 'COMPLETED').length;

    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    if (velocityScoreEl) {
      velocityScoreEl.textContent = `${total === 0 ? 0 : Math.min(rate + 15, 100)}%`;
    }
    if (gaugePercentageEl) gaugePercentageEl.textContent = `${rate}%`;

    if (gaugeCircle) {
      const circumference = 282.74;
      const offset = circumference - (rate / 100) * circumference;
      gaugeCircle.style.strokeDashoffset = offset;
    }

    if (burnoutRiskBadge) {
      if (total === 0) {
        burnoutRiskBadge.textContent = 'Siap Digunakan';
        burnoutRiskBadge.className = 'badge-tag priority-low';
      } else if (pendingUrgent > 1) {
        burnoutRiskBadge.textContent = 'Beban Mendesak Tinggi';
        burnoutRiskBadge.className = 'badge-tag priority-urgent';
      } else {
        burnoutRiskBadge.textContent = 'Ritme Belajar Optimal';
        burnoutRiskBadge.className = 'badge-tag priority-low';
      }
    }

    if (taskCounterText) {
      taskCounterText.textContent = `${total - completed} Belum Selesai (${completed} Tuntas)`;
    }
  }

  function renderTasks() {
    if (!tasksListContainer) return;

    const filtered = state.tasks.filter(task => {
      if (state.filter !== 'ALL' && task.status !== state.filter) return false;
      if (state.categoryFilter !== 'ALL' && task.category !== state.categoryFilter) return false;
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(q) ||
          (task.courseName && task.courseName.toLowerCase().includes(q)) ||
          (task.category && task.category.toLowerCase().includes(q))
        );
      }
      return true;
    });

    if (filtered.length === 0) {
      tasksListContainer.innerHTML = `
        <div style="text-align: center; padding: 48px 24px; border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg);">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">✨</div>
          <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 4px;">
            ${state.tasks.length === 0 ? 'Ruang Tugas Anda Masih Bersih' : 'Tidak Ada Tugas yang Cocok'}
          </h3>
          <p style="font-size: 0.82rem; color: var(--text-muted); max-width: 360px; margin: 0 auto 16px;">
            ${state.tasks.length === 0 
              ? 'Aplikasi ini siap digunakan untuk tugas kuliah & aktivitas pribadi Anda. Klik tombol "+ Buat Tugas" di atas untuk menambahkan tugas pertama.'
              : 'Silakan sesuaikan kata kunci pencarian atau filter status.'}
          </p>
          ${state.tasks.length === 0 ? `
            <button class="btn-pill btn-secondary" onclick="window.pttApp.loadSamples()" style="font-size: 0.8rem;">
              📚 Muat Contoh Tugas Kuliah
            </button>
          ` : ''}
        </div>
      `;
      return;
    }

    tasksListContainer.innerHTML = filtered.map(task => {
      const isDone = task.status === 'COMPLETED';
      const cat = CATEGORIES[task.category] || CATEGORIES.GENERAL;

      let pClass = 'priority-low';
      let pLabel = 'Sedang';
      if (task.priority === 'URGENT') { pClass = 'priority-urgent'; pLabel = 'Mendesak'; }
      else if (task.priority === 'HIGH') { pClass = 'priority-high'; pLabel = 'Tinggi'; }
      else if (task.priority === 'LOW') { pClass = 'priority-low'; pLabel = 'Rendah'; }

      return `
        <article class="task-item ${isDone ? 'completed' : ''}">
          <div class="task-main">
            <button class="task-checkbox ${isDone ? 'checked' : ''}" onclick="window.pttApp.toggleTask(${task.id})" title="Tandai selesai">
              ${isDone ? '✓' : ''}
            </button>
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px; flex-wrap: wrap;">
                ${task.courseName ? `
                  <span style="font-size: 0.72rem; font-weight: 700; background: rgba(0, 113, 227, 0.1); color: var(--accent-blue); padding: 2px 8px; border-radius: 6px; border: 1px solid rgba(0, 113, 227, 0.2);">
                    🎓 ${escapeHtml(task.courseName)}
                  </span>
                ` : ''}
                <span class="badge-tag" style="background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-subtle);">
                  ${cat.icon} ${cat.label}
                </span>
              </div>
              <h3 class="task-title">${escapeHtml(task.title)}</h3>
              <div class="task-meta">
                <span class="badge-tag ${pClass}">${pLabel}</span>
                ${task.dueDate ? `<span>⏰ Deadline: ${escapeHtml(task.dueDate)}</span>` : ''}
                <span>⏱️ ${task.estimatedMinutes} menit</span>
              </div>
            </div>
          </div>
          <button class="btn-action-icon" onclick="window.pttApp.deleteTask(${task.id})" title="Hapus tugas">🗑️</button>
        </article>
      `;
    }).join('');
  }

  function renderActivityFeed() {
    if (!activityFeedEl) return;
    activityFeedEl.innerHTML = state.activityLog.map(item => `
      <div class="activity-item">
        <span>⚡</span>
        <div>
          <div style="font-weight: 500;">${escapeHtml(item.text)}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${item.time}</div>
        </div>
      </div>
    `).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  window.pttApp = {
    toggleTask: (id) => {
      const t = state.tasks.find(x => x.id === id);
      if (!t) return;
      t.status = t.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
      state.activityLog.unshift({
        id: Date.now(),
        action: 'STATUS',
        text: `Tugas "${t.title.slice(0, 20)}..." ditandai ${t.status === 'COMPLETED' ? 'SELESAI' : 'DALAM PROSES'}`,
        time: 'Baru saja'
      });
      saveToStorage();
      updateMetrics();
      renderTasks();
      renderActivityFeed();
    },
    deleteTask: (id) => {
      const t = state.tasks.find(x => x.id === id);
      state.tasks = state.tasks.filter(x => x.id !== id);
      if (t) {
        state.activityLog.unshift({
          id: Date.now(),
          action: 'DELETE',
          text: `Tugas "${t.title.slice(0, 20)}..." telah dihapus`,
          time: 'Baru saja'
        });
      }
      saveToStorage();
      updateMetrics();
      renderTasks();
      renderActivityFeed();
    },
    loadSamples: () => {
      state.tasks = [
        {
          id: 1,
          title: 'Laporan Akhir Praktikum Modul 4 (Basis Data)',
          courseName: 'Basis Data',
          category: 'PRAKTIKUM',
          priority: 'URGENT',
          status: 'IN_PROGRESS',
          estimatedMinutes: 90,
          dueDate: 'Besok, 23:59'
        },
        {
          id: 2,
          title: 'Resume Jurnal & Makalah Kelompok Etika TI',
          courseName: 'Etika TI',
          category: 'KELOMPOK',
          priority: 'HIGH',
          status: 'TODO',
          estimatedMinutes: 120,
          dueDate: '12 Sep, 15:00'
        },
        {
          id: 3,
          title: 'Review Kisi-kisi UTS Kalkulus II',
          courseName: 'Kalkulus II',
          category: 'UJIAN',
          priority: 'MEDIUM',
          status: 'TODO',
          estimatedMinutes: 60,
          dueDate: '15 Sep, 09:00'
        },
        {
          id: 4,
          title: 'Belanja Kebutuhan Kos & Bayar Wifi',
          category: 'GENERAL',
          priority: 'LOW',
          status: 'COMPLETED',
          estimatedMinutes: 30
        }
      ];
      saveToStorage();
      updateMetrics();
      renderTasks();
    }
  };

  if (taskSearchInput) {
    taskSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      renderTasks();
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.filter = pill.getAttribute('data-filter');
      renderTasks();
    });
  });

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      applyTheme(state.theme === 'dark' ? 'light' : 'dark');
    });
  }

  if (openCreateModalBtn) openCreateModalBtn.addEventListener('click', () => createTaskModal.classList.add('open'));
  if (closeCreateModalBtn) closeCreateModalBtn.addEventListener('click', () => createTaskModal.classList.remove('open'));
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', () => createTaskModal.classList.remove('open'));

  if (createTaskForm) {
    createTaskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('taskTitleInput').value.trim();
      const courseName = document.getElementById('taskCourseInput') ? document.getElementById('taskCourseInput').value.trim() : '';
      const category = document.getElementById('taskCategorySelect') ? document.getElementById('taskCategorySelect').value : 'TUGAS_KULIAH';
      const priority = document.getElementById('taskPrioritySelect').value;
      const dueDate = document.getElementById('taskDueDateInput') ? document.getElementById('taskDueDateInput').value : '';

      state.tasks.unshift({
        id: Date.now(),
        title,
        courseName: courseName || undefined,
        category,
        status: 'TODO',
        priority,
        dueDate: dueDate || undefined,
        estimatedMinutes: 45
      });

      state.activityLog.unshift({
        id: Date.now(),
        action: 'CREATED',
        text: `Tugas baru disimpan: "${title.slice(0, 20)}..."`,
        time: 'Baru saja'
      });

      createTaskModal.classList.remove('open');
      createTaskForm.reset();
      saveToStorage();
      updateMetrics();
      renderTasks();
      renderActivityFeed();
    });
  }

  applyTheme(state.theme);
  updateMetrics();
  renderTasks();
  renderActivityFeed();
})();
