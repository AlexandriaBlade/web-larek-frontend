import { Component } from "../base/Component";
import { IEvents, IFormState } from "../../types";
import { ensureElement } from "../../utils/utils";

/**
 * Класс Form представляет собой общую форму, которая управляет состоянием ввода и ошибок.
 * Он наследует функциональность от базового класса Component.
 */
export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement; // Кнопка отправки формы
    protected _errors: HTMLElement; // Элемент для отображения ошибок валидации формы

    /**
     * Конструктор класса Form.
     * @param container - HTML-элемент формы, который будет обрабатывать события
     * @param events - экземпляр для управления событиями
     */
    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container); // Вызов конструктора родительского класса

        // Обеспечиваем наличие кнопки отправки формы
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        // Обеспечиваем наличие элемента для отображения ошибок
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        // Добавляем обработчик событий для изменения входных данных в форме
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement; // Приводим событие к типу HTMLInputElement
            const field = target.name as keyof T; // Имя поля формы
            const value = target.value; // Значение, введенное в поле
            this.onInputChange(field, value); // Обрабатываем изменение ввода
        });

        // Добавляем обработчик событий на отправку формы
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault(); // Отменяем стандартное поведение отправки формы
            this.events.emit(`${this.container.name}:submit`); // Генерируем событие отправки формы
        });
    }

    /**
     * Метод для обработки изменения ввода в полях формы.
     * @param field - имя поля, которое изменилось
     * @param value - новое значение поля
     */
    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value // Передаем информацию об измененном поле и его новом значении
        });
    }

    /**
     * Сеттер для управления состоянием кнопки отправки формы.
     * @param value - если true, кнопка станет активной, если false - неактивной
     */
    set valid(value: boolean) {
        this._submit.disabled = !value; // Устанавливаем состояние кнопки отправки
    }

    /**
     * Сеттер для обновления текстового содержимого элемента ошибок.
     * @param value - строка, содержащая сообщение об ошибках
     */
    set errors(value: string) {
        this.setText(this._errors, value); // Обновляем текстовое содержание элемента ошибок
    }

    /**
     * Метод для рендеринга формы с учетом текущего состояния.
     * @param state - частичное состояние формы и состояния валидации
     * @returns контейнер формы
     */
    render(state: Partial<T> & IFormState) {
        const { valid, errors, ...inputs } = state; // Деструктурируем состояние
        super.render({ valid, errors }); // Вызываем метод рендеринга родительского класса
        Object.assign(this, inputs); // Заполняем значения входных данных формы
        return this.container; // Возвращаем контейнер формы
    }
}