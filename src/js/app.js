import { Popover } from './components/popover/popover';

/**
 * Инициализирует все попапы на странице.
 */
function initPopovers() {
  const triggers = document.querySelectorAll('[data-toggle="popover"]');
  const popovers = [];

  triggers.forEach((trigger) => {
    const popover = new Popover(trigger);
    popovers.push(popover);
  });

  let currentOpen = null;

  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const popover = popovers[index];

      if (currentOpen && currentOpen !== popover) {
        currentOpen.remove();
      }

      if (popover.isOpen()) {
        popover.remove();
        currentOpen = null;
      } else {
        popover.show();
        currentOpen = popover;
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (currentOpen && !currentOpen.element.contains(e.target) && !e.target.closest('.popover')) {
      currentOpen.remove();
      currentOpen = null;
    }
  });
}

// Управление демо-блоком и текстом
function setupDemo() {
  const demoBlock = document.getElementById('demoBlock');
  const demoIcon = document.getElementById('demoIcon');
  const closeBtn = document.getElementById('closeDemoBtn');
  const iconBtn = demoIcon?.querySelector('button');

  const input = document.getElementById('page-text-input');
  const applyBtn = document.getElementById('apply-text-btn');
  const clearBtn = document.getElementById('clear-text-btn');
  const topContainer = document.getElementById('text-container-top');
  const bottomContainer = document.getElementById('text-container-bottom');

  let currentPosition = 'top'; // 'top', 'bottom', 'both'
  const allTexts = []; // массив всех добавленных текстов

  // Обработка переключателей
  document.querySelectorAll('input[name="text-position"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
      currentPosition = e.target.value;
      renderTexts(); // перерисовываем тексты в соответствии с новым положением
    });
  });

  // Функция для отображения текстов в контейнерах согласно currentPosition
  function renderTexts() {
    // Очищаем контейнеры
    topContainer.innerHTML = '';
    bottomContainer.innerHTML = '';

    // Добавляем каждый текст в соответствии с текущей позицией
    allTexts.forEach((text) => {
      if (currentPosition === 'top' || currentPosition === 'both') {
        const p = document.createElement('p');
        p.textContent = text;
        topContainer.append(p);
      }
      if (currentPosition === 'bottom' || currentPosition === 'both') {
        const p = document.createElement('p');
        p.textContent = text;
        bottomContainer.append(p);
      }
    });
  }

  // Применить текст
  if (applyBtn && input) {
    applyBtn.addEventListener('click', () => {
      const text = input.value.trim();
      if (!text) return;

      allTexts.push(text); // сохраняем текст
      renderTexts(); // обновляем отображение

      input.value = ''; // очищаем поле
    });
  }

  // Очистить текст
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      allTexts.length = 0; // очищаем массив
      renderTexts(); // обновляем отображение (контейнеры очистятся)
    });
  }

  // Сворачивание блока
  if (closeBtn && demoBlock && demoIcon) {
    closeBtn.addEventListener('click', () => {
      demoBlock.style.display = 'none';
      demoIcon.style.display = 'block';
    });
  }

  // Разворачивание по иконке
  if (iconBtn && demoBlock && demoIcon) {
    iconBtn.addEventListener('click', () => {
      demoBlock.style.display = 'block';
      demoIcon.style.display = 'none';
    });
  }

  // Enter в поле
  if (input && applyBtn) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        applyBtn.click();
      }
    });
  }
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
  initPopovers();
  setupDemo();
});
