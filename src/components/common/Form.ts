import { BaseComponent } from "../base/Component"; // Используйте правильный класс
import { IEvents, IFormState } from "../../types";
import { ensureElement } from "../../utils/utils";

/**
 * Класс Form управляет поведением и состоянием формы.
 * Обрабатывает события ввода и отправки данных.
 */
export class Form<T> extends BaseComponent<IFormState> {
    protected submitButton: HTMLButtonElement; // Кнопка для отправки формы
    protected errorContainer: HTMLElement; // Контейнер для отображения ошибок

    /**
     * Конструктор класса Form.
     * @param container - HTML-форма, которую будет представлять данный класс.
     * @param events - Система управления событиями для взаимодействия.
     */
    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container); // Инициализация базового класса

        // Инициализация кнопки отправки и контейнера ошибок
        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this.errorContainer = ensureElement<HTMLElement>('.form__errors', this.container);

        // Обработчик изменений ввода для отслеживания состояния полей формы
        this.container.addEventListener('input', (event: Event) => {
            const target = event.target as HTMLInputElement;
            const fieldName = target.name as keyof T;
            const fieldValue = target.value;
            this.handleInputChange(fieldName, fieldValue);
        });

        // Обработчик события отправки формы
        this.container.addEventListener('submit', (event: Event) => {
            event.preventDefault(); // Отменяем стандартное поведение
            this.events.emit(`${this.container.name}:submit`); // Эмитируем событие отправки формы
        });
    }

    /**
     * Обрабатывает изменение значения поля ввода.
     * @param field - Имя изменяемого поля.
     * @param value - Новое значение поля.
     */
    protected handleInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    /**
     * Устанавливает состояние валидности формы.
     * Если значение true, кнопка отправки активна, иначе – отключена.
     */
    set valid(isValid: boolean) {
        this.submitButton.disabled = !isValid; // Устанавливаем состояние кнопки отправки
    }

    /**
     * Устанавливает текст ошибок в форме.
     * @param errorMsg - Сообщение об ошибках для отображения.
     */
    set errors(errorMsg: string) {
        this.updateText(this.errorContainer, errorMsg); // Обновляем текст ошибок
    }

    /**
     * Обновляет состояние формы и возвращает элемент контейнера.
     * @param state - Новое состояние формы.
     * @returns HTML-элемент контейнера формы.
     */
    override render(state: Partial<T> & IFormState) {
        const { valid, errors, ...inputValues } = state; // Извлекаем валидность, ошибки и значения полей
        super.render({ valid, errors }); // Обновляем базовое состояние
        Object.assign(this, inputValues); // Применяем значения к форме
        return this.container; // Возвращаем HTML-элемент формы
    }
}
