

// === НАСТРОЙКИ ===
export const STORAGE_PREFIX = "slowar_";
const USE_SUPABASE = false;

// === ЛОКАЛЬНАЯ РЕАЛИЗАЦИЯ ===
const localStorageImpl = {
  // --- Очистить всё, что относится к этому приложению ---
  clearAllAnswers: () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  },

  // --- Введённые пользователем данные ---
  saveUserInputs: (taskId, inputs) => {
    localStorage.setItem(
      `${STORAGE_PREFIX}task_inputs_${taskId}`,
      JSON.stringify(inputs)
    );
  },

  getUserInputs: (taskId) => {
    const stored = localStorage.getItem(
      `${STORAGE_PREFIX}task_inputs_${taskId}`
    );
    return stored ? JSON.parse(stored) : [];
  },

  // --- Правильные ответы (индексы) ---
  saveCorrectInputs: (taskId, indexes) => {
    localStorage.setItem(
      `${STORAGE_PREFIX}correct_inputs_${taskId}`,
      JSON.stringify(indexes)
    );
  },

  getCorrectInputs: (taskId) => {
    const stored = localStorage.getItem(
      `${STORAGE_PREFIX}correct_inputs_${taskId}`
    );
    return stored ? JSON.parse(stored) : [];
  },

  // --- Для подсчёта прогресса ---
  getAllCorrectInputs: () => {
    return Object.keys(localStorage).filter((key) =>
      key.startsWith(`${STORAGE_PREFIX}correct_inputs_`)
    );
  },

  // --- Очистка одной задачи ---
  clearTaskProgress: (taskId, totalInputs) => {
    localStorage.removeItem(`${STORAGE_PREFIX}task_inputs_${taskId}`);
    localStorage.removeItem(`${STORAGE_PREFIX}correct_inputs_${taskId}`);

    // хвосты от старых версий
    for (let i = 0; i < totalInputs; i++) {
      localStorage.removeItem(
        `${STORAGE_PREFIX}input_correct_${taskId}_${i}`
      );
    }
  },

  // --- Очистка списка задач ---
  clearAnswersByIds: (ids, tasks = []) => {
    ids.forEach((id) => {
      const task = tasks.find((t) => t.id === id);
      const totalInputs = task ? task.answers.length : 10;
      localStorageImpl.clearTaskProgress(id, totalInputs);
    });
  },

  // =================================================
  // =============== BACKUP / RESTORE =================
  // =================================================

  exportProgress: () => {
    const data = {};

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        data[key] = localStorage.getItem(key);
      }
    });

    return data;
  },

  importProgress: (data) => {
    if (!data || typeof data !== "object") return;

    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.setItem(key, value);
      }
    });
  },
};

// === (Опционально) Supabase ===
const supabaseImpl = {
  // на будущее
};

// === ВЫБОР ХРАНИЛИЩА ===
const storage = USE_SUPABASE ? supabaseImpl : localStorageImpl;

// === ЭКСПОРТЫ ===
export const clearAllAnswers = () => storage.clearAllAnswers();

export const saveUserInputs = (id, inputs) =>
  storage.saveUserInputs(id, inputs);
export const getUserInputs = (id) =>
  storage.getUserInputs(id);

export const saveCorrectInputs = (id, indexes) =>
  storage.saveCorrectInputs(id, indexes);
export const getCorrectInputs = (id) =>
  storage.getCorrectInputs(id);

export const getAllCorrectInputs = () =>
  storage.getAllCorrectInputs();

export const clearTaskProgress = (id, totalInputs) =>
  storage.clearTaskProgress(id, totalInputs);

export const clearAnswersByIds = (ids, tasks) =>
  storage.clearAnswersByIds(ids, tasks);

export const exportProgress = () =>
  storage.exportProgress();
export const importProgress = (data) =>
  storage.importProgress(data);
