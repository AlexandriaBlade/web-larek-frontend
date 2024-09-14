import { Component } from "../base/Component";
import { createElement, ensureElement } from "../../utils/utils";
import { IBasketView } from "../../types";
import { EventEmitter } from "../base/events";

/**
 * Класс Basket представляет корзину покупок и управляет её отображением.
 * Он наследует функциональность от базового класса Component.
 */
export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement; // Элемент, в котором отображается список товаров в корзине
    protected _total: HTMLElement; // Элемент, отображающий общую сумму
    protected _button: HTMLButtonElement; // Кнопка для оформления заказа

    /**
     * Конструктор класса Basket.
     * @param container - контейнер, в котором размещается корзина
     * @param events - экземпляр EventEmitter для управления событиями
     */
    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container); // Вызов конструктора родительского класса

        // Обеспечиваем наличие элемента списка (при ошибке будет выброшено исключение)
        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price'); // Находим элемент для отображения суммы
        this._button = this.container.querySelector('.basket__button'); // Находим кнопку оформления заказа

        // Если кнопка найдена, добавляем обработчик события на клик
        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open'); // Генерируем событие для открытия оформления заказа
            });
        }

        this.items = []; // Инициализируем пустой массив для товаров в корзине
        this._button.disabled = true; // Делаем кнопку неактивной по умолчанию
    }

    /**
     * Сеттер для обновления списка товаров.
     * @param items - массив элементов, представляющих товары
     */
    set items(items: HTMLElement[]) {
        // Если есть товары, заменяем содержимое списка
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            // Если корзина пуста, отображаем текст о пустой корзине
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста' // Сообщение для отображения при пустой корзине
            }));
        }
    }

    /**
     * Сеттер для обновления общей суммы.
     * @param total - общая сумма, которую нужно показать
     */
    set total(total: number) {
        this.setText(this._total, `${total.toString()} синапсов`); // Обновляем текст элемента суммы
    }

    /**
     * Метод для переключения состояния кнопки оформления заказа.
     * @param disabled - если true, кнопка будет неактивной, если false - активной
     */
    toggleButton(disabled: boolean) {
        this._button.disabled = disabled; // Устанавливаем состояние кнопки
    }
}