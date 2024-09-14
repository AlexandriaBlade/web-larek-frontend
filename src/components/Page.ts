import { Component } from "./base/Component"; // Импорт базового класса Component для создания компонентов страницы
import { IEvents, IPage } from "../types"; // Импорт интерфейсов для событий и страницы
import { ensureElement } from "../utils/utils"; // Импорт функции для безопасной выборки элемента из DOM

// Класс Page, представляющий собой страницу в приложении, наследуется от класса Component с параметром IPage
export class Page extends Component<IPage> {
  protected _counter: HTMLElement; // Элемент счетчика в корзине
  protected _catalog: HTMLElement; // Элемент для отображения каталога товаров
  protected _wrapper: HTMLElement; // Обертка страницы
  protected _basket: HTMLElement; // Элемент для корзины

  // Конструктор класса Page, принимает контейнер элемента и события
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container); // Вызов конструктора родительского класса Component

    // Получение и инициализация элементов DOM с помощью функции ensureElement
    this._counter = ensureElement<HTMLElement>('.header__basket-counter');
    this._catalog = ensureElement<HTMLElement>('.gallery');
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
    this._basket = ensureElement<HTMLElement>('.header__basket');

    // Добавление обработчика клика на элемент корзины, который генерирует событие 'basket:open'
    this._basket.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  // Установка значения счетчика в корзине
  set counter(value: number) {
    this.setText(this._counter, String(value)); // Присвоение текстового значения счетчику
  }

  // Установка элементов каталога, заменяет все дочерние элементы каталога новыми элементами
  set catalog(items: HTMLElement[]) {
    this._catalog.replaceChildren(...items); // Замена содержимого элемента каталога новыми элементами
  }

  // Установка состояния блокировки страницы, добавляет или удаляет класс блокировки
  set locked(value: boolean) {
    if (value) {
        this._wrapper.classList.add('page__wrapper_locked'); // Добавление класса блокировки
    } else {
        this._wrapper.classList.remove('page__wrapper_locked'); // Удаление класса блокировки
    }
  }
}