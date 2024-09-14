import { Form } from "./common/Form"; // Импорт базового класса Form для работы с формами
import { IContact, IEvents } from "../types"; // Импорт интерфейсов для контактных данных и событий

// Класс Contact, наследующий функциональность от класса Form с параметрами IContact
export class Contact extends Form<IContact> {
    // Конструктор класса Contact, принимает контейнер формы и события
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events); // Вызов конструктора родительского класса Form
    }

    // Установка значения поля телефон в форме
    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value; // Присваивание значения полю 'phone'
    }

    // Установка значения поля электронная почта в форме
    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value; // Присваивание значения полю 'email'
    }
}