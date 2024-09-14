import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents, IModalData } from "../../types";

/**
 * Класс Modal представляет модальное окно.
 * Управляет открытием, закрытием и содержимым модального окна.
 */
export class Modal extends Component<IModalData> {
    protected closeButton: HTMLButtonElement; // Кнопка закрытия модального окна
    protected content: HTMLElement; // Контейнер для содержимого модального окна

    /**
     * Конструктор класса Modal.
     * @param container - HTML-элемент, который будет использоваться как контейнер для модального окна.
     * @param events - Объект для управления событиями, связанными с модальным окном.
     */
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container); // Инициализация базового класса

        // Получаем элементы кнопки закрытия и контейнера содержимого
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.content = ensureElement<HTMLElement>('.modal__content', container);

        // Добавляем слушатели событий
        this.closeButton.addEventListener('click', this.close.bind(this)); // Закрытие при нажатии на кнопку закрытия
        this.container.addEventListener('click', this.close.bind(this)); // Закрытие при клике вне содержимого
        this.content.addEventListener('click', (event) => event.stopPropagation()); // Предотвращение закрытия при клике внутри содержимого
    }

    /**
     * Устанавливает содержимое модального окна.
     * @param value - Новый HTML-элемент, который будет заменять текущее содержимое модального окна.
     */
    set content(value: HTMLElement) {
        this.content.replaceChildren(value); // Заменяем текущее содержимое на новое значение
    }

    /**
     * Открывает модальное окно и эмитирует событие открытия.
     */
    open() {
        this.container.classList.add('modal_active'); // Добавляем класс для отображения модального окна
        this.events.emit('modal:open'); // Эмитируем событие об открытии модального окна
    }

    /**
     * Закрывает модальное окно и эмитирует событие закрытия.
     */
    close() {
        this.container.classList.remove('modal_active'); // Убираем класс, чтобы скрыть модальное окно
        this.content = null; // Очищаем содержимое модального окна
        this.events.emit('modal:close'); // Эмитируем событие о закрытии модального окна
    }

    /**
     * Отрисовывает модальное окно с заданными данными.
     * @param data - Данные для обновления содержимого модального окна.
     * @returns HTML-элемент контейнера модального окна.
     */
    render(data: IModalData): HTMLElement {
        super.render(data); // Вызываем метод родительского класса для рендера данных
        this.open(); // Открываем модальное окно после рендера
        return this.container; // Возвращаем HTML-элемент контейнера модального окна
    }
}
