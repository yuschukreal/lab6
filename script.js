/**
 * ЛАБОРАТОРНА РОБОТА №4 - JavaScript
 * Станіслав Ющук
 * Варіант 2
 */

// --- 1. ЗБЕРІГАННЯ ДАНИХ ПРО БРАУЗЕР ТА ОС У localStorage ---
function initStorageInfo() {
  // Реальна інформація з браузера
  const realInfo = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    vendor: navigator.vendor || 'Unknown',
    cookieEnabled: navigator.cookieEnabled,
    timestamp: new Date().toLocaleString()
  };

  // Інформація під твій пристрій
  const systemInfo = {
    device: "MacBook Neo (13-inch, A18 Pro)",
    model: "MacBook Neo 13\"",
    chip: "Apple A18 Pro",
    cpu: "6-core CPU (2 performance + 4 efficiency)",
    gpu: "5-core GPU",
    os: "macOS",
    platform: realInfo.platform,
    language: realInfo.language,
    browser: realInfo.userAgent.includes("Safari") ? "Safari" :
      realInfo.userAgent.includes("Chrome") ? "Google Chrome" :
        realInfo.userAgent.includes("Firefox") ? "Mozilla Firefox" : "Unknown Browser",
    timestamp: realInfo.timestamp
  };

  // Зберігаємо реальні дані в localStorage
  localStorage.setItem('userSystemData', JSON.stringify(realInfo));

  // Відображення у футері
  const displayElement = document.getElementById('footer-storage-info');
  if (displayElement) {
    displayElement.innerHTML = `
            <div style="font-size: 13px; opacity: 0.85; margin-top: 12px; text-align: center; line-height: 1.5;">
                <strong>Пристрій:</strong> ${systemInfo.device}<br>
                <strong>Чіп:</strong> ${systemInfo.chip} | 
                <strong>CPU:</strong> ${systemInfo.cpu}<br>
                <strong>ОС:</strong> ${systemInfo.os} | 
                <strong>Браузер:</strong> ${systemInfo.browser}
            </div>
        `;
  }
}

// --- 2. ЗАВАНТАЖЕННЯ КОМЕНТАРІВ З JSONPlaceholder (ВАРІАНТ 2) ---
async function loadEmployerComments(variantNumber) {
  const commentsContainer = document.getElementById('comments-section');
  const loader = document.getElementById('comments-loader');

  if (!commentsContainer) return;

  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${variantNumber}/comments`);

    if (!response.ok) throw new Error("Помилка завантаження");

    const comments = await response.json();

    if (loader) loader.remove();

    comments.forEach(comment => {
      const commentCard = document.createElement('div');
      commentCard.className = 'comment-card';
      commentCard.innerHTML = `
                <h4>${comment.name}</h4>
                <small>${comment.email}</small>
                <p>${comment.body}</p>
            `;
      commentsContainer.appendChild(commentCard);
    });
  } catch (error) {
    console.error("Помилка API:", error);
    if (loader) loader.innerText = "Не вдалося завантажити коментарі. Спробуйте пізніше.";
  }
}

// --- 3. МОДАЛЬНЕ ВІКНО ФОРМИ ЗВОРОТНЬОГО ЗВ'ЯЗКУ ---
function initFeedbackModal() {
  const modal = document.getElementById('feedback-modal');
  const closeBtn = document.getElementById('close-modal-btn');

  // Показати модальне вікно через 1 хвилину
  setTimeout(() => {
    if (modal) modal.classList.add('show');
  }, 60000);

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.remove('show');
    }
  });
}

// --- 4. ПЕРЕМИКАЧ ДЕННОЇ / НІЧНОЇ ТЕМИ ---
function initThemeLogic() {
  const body = document.body;
  const themeBtn = document.getElementById('theme-toggle');

  function applyTheme(isDark) {
    if (isDark) {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
    } else {
      body.classList.add('light-mode');
      body.classList.remove('dark-mode');
    }
    localStorage.setItem('preferredTheme', isDark ? 'dark' : 'light');
  }

  const savedTheme = localStorage.getItem('preferredTheme');
  if (savedTheme) {
    applyTheme(savedTheme === 'dark');
  } else {
    const hour = new Date().getHours();
    const isNight = hour < 7 || hour >= 21;
    applyTheme(isNight);
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isCurrentlyDark = body.classList.contains('dark-mode');
      applyTheme(!isCurrentlyDark);
    });
  }
}

// --- ЗАПУСК ВСІХ ФУНКЦІЙ ---
window.addEventListener('DOMContentLoaded', () => {
  initStorageInfo();
  initThemeLogic();
  initFeedbackModal();

  const myVariant = 2;   // ← Другий варіант
  loadEmployerComments(myVariant);
});