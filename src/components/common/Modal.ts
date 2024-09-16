import { Component } from "../base/Component"; // Импорт базового компонента
import { ensureElement } from "../../utils/utils"; // Импорт вспомогательной функции для получения элементов
import { IEvents, IModalData } from "../../types"; // Импорт типов событий и данных модального окна

/**
 * Класс Modal отвечает за отображение модального окна в приложении.
 * Он наследует функциональность от базового класса Component.
 */
export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement; // Кнопка закрытия модального окна
    protected _content: HTMLElement; // Элемент, содержащий содержимое модального окна

    /**
     * Конструктор класса Modal.
     * @param container - HTML-элемент, в котором будет размещено модальное окно
     * @param events - экземпляр для управления событиями
     */
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container); // Вызов конструктора родительского класса

        // Обеспечиваем наличие кнопки закрытия и элемента для содержимого модального окна
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        // Добавление обработчиков событий для закрытия модального окна
        this._closeButton.addEventListener('click', this.close.bind(this)); // Закрытие окна при клике на кнопку
        this.container.addEventListener('click', this.close.bind(this)); // Закрытие окна при клике вне содержимого
        this._content.addEventListener('click', (event) => event.stopPropagation()); // Остановить всплытие события клика на содержимом
    }

    /**
     * Сеттер для обновления содержимого модального окна.
     * @param value - новый HTML элемент, который будет размещён в модальном окне
     */
    set content(value: HTMLElement) {
        this._content.replaceChildren(value); // Заменяем текущее содержимое новым элементом
    }

    /**
     * Метод для установки текстового содержимого модального окна.
     * @param text - текст, который нужно установить
     */
    setContentText(text: string) {
        this.setText(this._content, text); // Используем метод setText для установки текстового содержимого
    }

    /**
     * Метод для открытия модального окна.
     */
    open() {
        this.toggleClass(this.container, 'modal_active', true); // Используем toggleClass для добавления класса
        this.events.emit('modal:open'); // Генерируем событие открытия модального окна
    }

    /**
     * Метод для закрытия модального окна.
     */
    close() {
        this.toggleClass(this.container, 'modal_active', false); // Используем toggleClass для удаления класса
        this.content = null; // Очищаем содержимое модального окна
        this.events.emit('modal:close'); // Генерируем событие закрытия модального окна
    }

    /**
     * Метод для деактивации кнопки закрытия модального окна.
     * @param state - если true, то кнопка будет заблокирована; если false, то разблокирована
     */
    setCloseButtonDisabled(state: boolean) {
        this.setDisabled(this._closeButton, state); // Используем setDisabled для управления состоянием кнопки
    }

    /**
     * Метод для рендеринга модального окна с учетом данных.
     * @param data - данные для отображения в модальном окне
     * @returns контейнер модального окна
     */
    render(data: IModalData): HTMLElement {
        super.render(data); // Вызываем метод рендеринга родительского класса
        this.open(); // Открываем модальное окно после рендеринга
        return this.container; // Возвращаем контейнер модального окна
    }
}
