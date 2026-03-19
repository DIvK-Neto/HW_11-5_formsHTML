import { Popover } from '../popover';

describe('Popover', () => {
  let trigger;
  let popover;

  beforeEach(() => {
    trigger = document.createElement('button');
    trigger.dataset.title = 'Тестовый заголовок';
    trigger.dataset.content = 'Тестовый контент';
    document.body.append(trigger);
  });

  afterEach(() => {
    if (popover) popover.remove();
    trigger.remove();
  });

  test('должен создавать экземпляр с данными из data-атрибутов', () => {
    popover = new Popover(trigger);
    expect(popover.title).toBe('Тестовый заголовок');
    expect(popover.content).toBe('Тестовый контент');
  });

  test('show() должен добавлять попап в body', () => {
    popover = new Popover(trigger);
    popover.show();
    expect(document.querySelector('.popover')).not.toBeNull();
  });

  test('show() должен устанавливать правильное содержимое', () => {
    popover = new Popover(trigger);
    popover.show();
    const popoverEl = document.querySelector('.popover');
    expect(popoverEl.querySelector('.popover-title').textContent).toBe('Тестовый заголовок');
    expect(popoverEl.querySelector('.popover-content').textContent).toBe('Тестовый контент');
  });

  test('remove() должен удалять попап из body', () => {
    popover = new Popover(trigger);
    popover.show();
    popover.remove();
    expect(document.querySelector('.popover')).toBeNull();
  });

  test('isOpen() должен возвращать правильное состояние', () => {
    popover = new Popover(trigger);
    expect(popover.isOpen()).toBe(false);
    popover.show();
    expect(popover.isOpen()).toBe(true);
    popover.remove();
    expect(popover.isOpen()).toBe(false);
  });

  // Параметризованный тест для позиционирования
  describe('_positionPopover', () => {
    test.each([
      {
        triggerTop: 100,
        triggerLeft: 200,
        triggerWidth: 100,
        popoverWidth: 200,
        expectedLeft: 150,
      },
      { triggerTop: 50, triggerLeft: 0, triggerWidth: 100, popoverWidth: 200, expectedLeft: 8 }, // слева край
      {
        triggerTop: 10,
        triggerLeft: 1100,
        triggerWidth: 100,
        popoverWidth: 200,
        viewportWidth: 1200,
        expectedLeft: 992,
      }, // справа край
    ])(
      'должен правильно рассчитывать left: $expectedLeft',
      ({
        triggerTop,
        triggerLeft,
        triggerWidth,
        popoverWidth,
        expectedLeft,
        viewportWidth = 1024,
      }) => {
        popover = new Popover(trigger);

        // Мокаем размеры триггера
        jest.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
          top: triggerTop,
          left: triggerLeft,
          width: triggerWidth,
          height: 40,
          bottom: triggerTop + 40,
          right: triggerLeft + triggerWidth,
        });

        // Создаём элемент попапа вручную (без show), чтобы контролировать его размеры
        popover.popoverElement = popover._createPopoverElement();
        document.body.append(popover.popoverElement);

        // Мокаем размеры попапа
        Object.defineProperty(popover.popoverElement, 'offsetHeight', { value: 100 });
        Object.defineProperty(popover.popoverElement, 'offsetWidth', { value: popoverWidth });
        jest.spyOn(popover.popoverElement, 'getBoundingClientRect').mockReturnValue({
          width: popoverWidth,
          height: 100,
          top: 0, // эти значения не важны для расчёта left
          left: 0,
          bottom: 100,
          right: popoverWidth,
        });

        // Мокаем window.innerWidth
        Object.defineProperty(window, 'innerWidth', { value: viewportWidth, configurable: true });

        popover._positionPopover();

        // Проверяем left (scrollLeft = 0)
        expect(popover.popoverElement.style.left).toBe(`${expectedLeft}px`);

        // Очищаем
        popover.remove();
      },
    );
  });
});
