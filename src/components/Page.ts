import { BaseComponent } from "./base/Component"; // Исправленный импорт
import { IEvents, IPage } from "../types"; // Импорт интерфейсов событий и страницы
import { ensureElement } from "../utils/utils"; // Импорт утилиты для проверки наличия элементов

// Класс Page наследуется от BaseComponent и представляет собой страницу
export class Page extends BaseComponent<IPage> {
  // Элементы, представляющие различные части страницы
  protected _counter: HTMLElement; // Счетчик корзины
  protected _catalog: HTMLElement; // Каталог товаров
  protected _wrapper: HTMLElement; // Обертка для страницы
  protected _basket: HTMLElement; // Корзина

  // Конструктор класса, принимает контейнер и события
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container); // Вызываем конструктор родительского класса

    // Получаем ссылки на необходимые элементы страницы
    this._counter = ensureElement<HTMLElement>('.header__basket-counter'); // Счетчик корзины в шапке
    this._catalog = ensureElement<HTMLElement>('.gallery'); // Галерея товаров
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper'); // Обертка страницы
    this._basket = ensureElement<HTMLElement>('.header__basket'); // Корзина в шапке

    // Добавляем обработчик события для открытия корзины при клике на элемент корзины
    this._basket.addEventListener('click', () => {
      this.events.emit('basket:open'); // Генерируем событие открытия корзины
    });
  }

  // Сеттер для обновления значения счетчика
  set counter(value: number) {
    this.updateText(this._counter, String(value)); // Устанавливаем текст счетчика
  }

  // Сеттер для обновления содержимого каталога
  set catalog(items: HTMLElement[]) {
    this._catalog.replaceChildren(...items); // Заменяем существующие элементы каталога на новые
  }

  // Сеттер для блокировки страницы
  set locked(value: boolean) {
    if (value) {
      this._wrapper.classList.add('page__wrapper_locked'); // Добавляем класс блокировки
    } else {
      this._wrapper.classList.remove('page__wrapper_locked'); // Убираем класс блокировки
    }
  }
}
