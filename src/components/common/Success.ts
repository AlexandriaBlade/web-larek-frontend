import { Component } from "../base/Component"; // Импорт базового компонента
import { ensureElement } from "../../utils/utils"; // Импорт вспомогательной функции для получения элементов
import { ISuccess, ISuccessActions } from "../../types"; // Импорт типов для успешного сообщения и действий

/**
 * Класс Success представляет собой компонент для отображения успешного сообщения о заказе.
 * Он наследует функциональность от базового класса Component.
 */
export class Success extends Component<ISuccess> {
    protected _close: HTMLElement; // Элемент кнопки закрытия успешного сообщения
    protected _total: HTMLElement; // Элемент, который отображает итоговую сумму заказа

    /**
     * Конструктор класса Success.
     * @param container - HTML-элемент, в котором будет размещён компонент успеха
     * @param actions - объект с действиями, которые могут быть выполнены (например, обработчик клика)
     */
    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container); // Вызов конструктора родительского класса

        // Обеспечиваем наличие элемента кнопки закрытия и элемента для итоговой суммы
        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

        // Если передан обработчик клика, добавляем его на элемент закрытия
        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    /**
     * Сеттер для обновления текста итоговой суммы.
     * @param value - сумма, которая будет отображена
     */
    set total(value: string) {
        this._total.textContent = `Списано ${value} синапсов`; // Обновляем текстовое содержание с использованием переданного значения
    }
}
