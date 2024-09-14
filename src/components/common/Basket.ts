import { Component } from "../base/Component";
import { createElement, ensureElement } from "../../utils/utils";
import { IBasketView } from "../../types";
import { EventEmitter } from "../base/events";

/**
 * Класс Basket представляет корзину покупок.
 * Управляет отображением товаров, общей ценой и взаимодействием с кнопками.
 */
export class Basket extends Component<IBasketView> {
    protected itemList: HTMLElement; // Список товаров в корзине
    protected totalAmount: HTMLElement; // Элемент для отображения общей суммы
    protected actionButton: HTMLButtonElement; // Кнопка для оформления заказа

    /**
     * Конструктор класса Basket.
     * @param container - HTML-элемент, который будет использоваться как контейнер для корзины.
     * @param events - Объект для управления событиями, связанными с корзиной.
     */
    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        // Получаем необходимые элементы из контейнера корзины
        this.itemList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalAmount = this.container.querySelector('.basket__price');
        this.actionButton = this.container.querySelector('.basket__button');

        // Добавляем обработчик события для кнопки оформления заказа
        if (this.actionButton) {
            this.actionButton.addEventListener('click', () => {
                events.emit('order:open'); // Эмитируем событие открытия заказа
            });
        }

        this.items = []; // Инициализируем пустой массив товаров
        this.actionButton.disabled = true; // Делаем кнопку недоступной
    }

    /**
     * Устанавливает товары в корзину.
     * @param items - Массив HTML-элементов, представляющих товары.
     */
    set items(items: HTMLElement[]) {
        if (items.length) {
            this.itemList.replaceChildren(...items); // Заполняем список товарами
        } else {
            // Если корзина пуста, отображаем соответствующее сообщение
            this.itemList.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    /**
     * Устанавливает общую сумму для корзины.
     * @param total - Общая сумма в числовом формате.
     */
    set total(total: number) {
        this.setText(this.totalAmount, `${total.toString()} синапсов`); // Обновляем текст в элементе суммы
    }

    /**
     * Включает или выключает кнопку оформления заказа.
     * @param disabled - Флаг, указывающий, должна ли кнопка быть отключена.
     */
    toggleButton(disabled: boolean) {
        this.actionButton.disabled = disabled; // Устанавливаем состояние кнопки
    }
}