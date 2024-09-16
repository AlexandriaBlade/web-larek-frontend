import { Component } from "./base/Component"; // Импорт базового класса Component
import { ICard, IActions } from "../types"; // Импорт интерфейсов для карточки и действий
import { ensureElement } from "../utils/utils"; // Импорт вспомогательной функции для гарантированной выборки элемента

// Класс Card представляет собой компонент карточки
export class Card extends Component<ICard> {
    // Элементы карточки
    protected _title: HTMLElement; // Заголовок карточки
    protected _price: HTMLElement; // Цена карточки
    protected _image?: HTMLImageElement; // Изображение карточки (может отсутствовать)
    protected _description?: HTMLElement; // Описание карточки (может отсутствовать)
    protected _button?: HTMLButtonElement; // Кнопка карточки (может отсутствовать)
    protected _category?: HTMLElement; // Категория карточки (может отсутствовать)
    protected _index?: HTMLElement; // Индекс карточки в корзине (может отсутствовать)
    protected _buttonTitle: string; // Заголовок кнопки карточки

    // Конструктор класса Card, инициализирует элементы и добавляет обработчики событий
    constructor(container: HTMLElement, actions?: IActions) {
        super(container); // Вызов конструктора базового класса

        // Получение ссылок на элементы карточки
        this._title = ensureElement<HTMLElement>('.card__title', container); // Заголовок
        this._price = ensureElement<HTMLElement>('.card__price', container); // Цена
        this._image = container.querySelector('.card__image'); // Изображение
        this._button = container.querySelector('.card__button'); // Кнопка
        this._description = container.querySelector('.card__text'); // Описание
        this._category = container.querySelector('.card__category'); // Категория
        this._index = container.querySelector('.basket__item-index'); // Индекс

        // Привязка обработчика клика к кнопке или контейнеру
        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick); // Обработчик клика на кнопке
            } else {
                container.addEventListener('click', actions.onClick); // Обработчик клика на контейнере
            }
        }
    }

    // Установка и получение идентификатора карточки
    set id(value: string) {
        this.container.dataset.id = value; // Сохранение идентификатора в dataset
    }

    get id(): string {
        return this.container.dataset.id || ''; // Возврат значения идентификатора
    }

    // Установка и получение заголовка карточки
    set title(value: string) {
        this.setText(this._title, value); // Установка текста заголовка
    }

    get title(): string {
        return this._title.textContent || ''; // Возврат текста заголовка
    }

    // Установка и получение цены карточки
    set price(value: number | null) {
        this.setText(this._price, value ? `${value.toString()} синапсов` : ''); // Установка текста цены
        this.disableButton(value); // Отключение кнопки при отсутствии цены
    }

    get price(): number {
        return Number(this._price.textContent || ''); // Возврат значения цены
    }

    // Установка и получение категории карточки
    set category(value: string) {
        this.setText(this._category, value); // Установка текста категории
        this.toggleClass(this._category, this.classByCategory(value), true); // Используем toggleClass вместо classList.add
    }

    get category(): string {
        return this._category.textContent || ''; // Возврат текста категории
    }

    // Установка и получение индекса карточки
    set index(value: string) {
        this.setText(this._index, value); // Используем setText для установки текста индекса
    }

    get index(): string {
        return this._index.textContent || ''; // Возврат текста индекса
    }

    // Установка изображения карточки
    set image(value: string) {
        this.setImage(this._image, value, this.title); // Установка изображения
    }

    // Установка описания карточки
    set description(value: string) {
        this.setText(this._description, value); // Установка текста описания
    }

    // Установка заголовка кнопки
    set buttonTitle(value: string) {
        if (this._button) {
            this.setText(this._button, value); // Используем setText для установки текста кнопки
        }
    }

    // Метод для возврата класса в зависимости от категории
    classByCategory(value: string): string {
        switch (value) {
            case 'софт-скил':
                return 'card__category_soft'; // Класс для софт-скилов
            case 'хард-скил':
                return 'card__category_hard'; // Класс для хард-скилов
            case 'кнопка':
                return 'card__category_button'; // Класс для кнопок
            case 'дополнительное':
                return 'card__category_additional'; // Класс для дополнительных категорий
            default:
                return 'card__category_other'; // Класс для остальных категорий
        }
    }

    // Метод для отключения кнопки в зависимости от значения
    disableButton(value: number | null) {
        if (this._button) {
            this.setDisabled(this._button, !value); // Используем setDisabled вместо прямого изменения свойства disabled
        }
    }
}
