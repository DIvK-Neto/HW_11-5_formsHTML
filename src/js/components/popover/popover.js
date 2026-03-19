/**
 * Класс для создания и управления всплывающим окном (popover).
 */
export class Popover {
  /**
   * Создаёт экземпляр Popover.
   * @param {HTMLElement} element - DOM-элемент, к которому привязан попап.
   * @param {Object} options - Опции попапа (title, content).
   */
  constructor(element, options = {}) {
    this.element = element;
    this.title = options.title || element.dataset.title || '';
    this.content = options.content || element.dataset.content || '';
    this.popoverElement = null;
  }

  /**
   * Показывает попап.
   */
  show() {
    if (this.popoverElement) return;

    this.popoverElement = this._createPopoverElement();
    document.body.append(this.popoverElement);
    this._positionPopover();
  }

  /**
   * Удаляет попап.
   */
  remove() {
    if (this.popoverElement) {
      this.popoverElement.remove();
      this.popoverElement = null;
    }
  }

  /**
   * Проверяет, открыт ли попап.
   * @returns {boolean}
   */
  isOpen() {
    return this.popoverElement !== null;
  }

  /**
   * Создаёт DOM-элемент попапа.
   * @private
   * @returns {HTMLElement}
   */
  _createPopoverElement() {
    const popover = document.createElement('div');
    popover.className = 'popover';

    const titleEl = document.createElement('div');
    titleEl.className = 'popover-title';
    titleEl.textContent = this.title;

    const contentEl = document.createElement('div');
    contentEl.className = 'popover-content';
    contentEl.textContent = this.content;

    popover.append(titleEl, contentEl);
    return popover;
  }

  /**
   * Вычисляет и устанавливает позицию попапа.
   * @private
   */
  _positionPopover() {
    const triggerRect = this.element.getBoundingClientRect();
    const popoverRect = this.popoverElement.getBoundingClientRect();
    const scrollTop = window.scrollY;
    const scrollLeft = window.scrollX;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let top;
    let addBottomClass = false;

    // Пробуем поставить сверху
    const topTop = triggerRect.top + scrollTop - popoverRect.height - 8;
    if (topTop >= scrollTop) {
      // Сверху помещается
      top = topTop;
    } else {
      // Сверху не помещается – ставим снизу
      top = triggerRect.bottom + scrollTop + 8;
      addBottomClass = true;
      // Если снизу тоже не помещается – поджимаем к нижнему краю
      if (top + popoverRect.height > scrollTop + viewportHeight) {
        top = scrollTop + viewportHeight - popoverRect.height - 8;
      }
    }

    // Горизонтальное центрирование с защитой от краёв
    let left = triggerRect.left + scrollLeft + triggerRect.width / 2 - popoverRect.width / 2;
    if (left < 0) left = 8;
    if (left + popoverRect.width > viewportWidth) {
      left = viewportWidth - popoverRect.width - 8;
    }

    // Устанавливаем класс для стрелки
    if (addBottomClass) {
      this.popoverElement.classList.add('bottom');
    } else {
      this.popoverElement.classList.remove('bottom');
    }

    this.popoverElement.style.top = `${top}px`;
    this.popoverElement.style.left = `${left}px`;
  }
}
