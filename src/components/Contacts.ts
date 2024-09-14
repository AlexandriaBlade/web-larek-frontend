import { Form } from "./common/Form";
import { IContact, IEvents } from "../types";

/**
 * Класс Contact представляет форму для ввода контактной информации.
 */
export class Contact extends Form<IContact> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events); // Инициализация базового класса Form
    }

    // Устанавливает номер телефона в форме
    set phone(value: string) {
        this.setInputValue('phone', value);
    }

    // Устанавливает электронную почту в форме
    set email(value: string) {
        this.setInputValue('email', value);
    }

    // Утилитный метод для установки значения поля ввода
    private setInputValue(fieldName: string, value: string) {
        const inputElement = this.container.elements.namedItem(fieldName) as HTMLInputElement;
        if (inputElement) {
            inputElement.value = value; // Устанавливаем значение поля ввода
        }
    }
}
