import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { ISuccess, ISuccessActions } from "../../types";

/**
 * Класс Success представляет уведомление об успешном завершении действия.
 * Управляет отображением информации и обработкой событий закрытия.
 */
export class Success extends Component<ISuccess> {
    protected closeButton: HTMLElement; // Кнопка закрытия уведомления
    protected totalAmount: HTMLElement; // Элемент для отображения общей суммы

    /**
     * Конструктор класса Success.
     * @param container - HTML-элемент, который используется как контейнер для уведомления.
     * @param actions - Объект с действиями, связанными с уведомлением.
     */
    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container); // Инициализация базового класса

        // Получаем элементы кнопки закрытия и элемента для отображения суммы
        this.closeButton = ensureElement<HTMLElement>('.order-success__close', this.container);
        this.totalAmount = ensureElement<HTMLElement>('.order-success__description', this.container);

        // Добавляем обработчик событий для кнопки закрытия, если он задан
        if (actions?.onClick) {
            this.closeButton.addEventListener('click', actions.onClick);
        }
    }

    /**
     * Устанавливает текст для отображения общей суммы.
     * @param value - Сумма, которую нужно отобразить в уведомлении.
     */
    set total(value: string) {
        this.totalAmount.textContent = `Списано ${value} синапсов`; // Обновляем текст элемента с суммой
    }
}
