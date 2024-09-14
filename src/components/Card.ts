import { BaseComponent } from "./base/Component"; 
import { ICard, IActions } from "../types";
import { ensureElement } from "../utils/utils";

/**
 * Класс Card представляет карточку товара с её атрибутами.
 */
export class Card extends BaseComponent<ICard> {
    protected titleElement: HTMLElement; // Элемент заголовка
    protected priceElement: HTMLElement; // Элемент цены
    protected imageElement?: HTMLImageElement; // Элемент изображения
    protected descriptionElement?: HTMLElement; // Элемент описания
    protected buttonElement?: HTMLButtonElement; // Элемент кнопки
    protected categoryElement?: HTMLElement; // Элемент категории
    protected indexElement?: HTMLElement; // Элемент индекса

    constructor(container: HTMLElement, actions?: IActions) {
        super(container);

        // Инициализация элементов из контейнера
        this.titleElement = ensureElement<HTMLElement>('.card__title', container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', container);
        this.imageElement = container.querySelector('.card__image') as HTMLImageElement;
        this.buttonElement = container.querySelector('.card__button') as HTMLButtonElement;
        this.descriptionElement = container.querySelector('.card__text') as HTMLElement;
        this.categoryElement = container.querySelector('.card__category') as HTMLElement;
        this.indexElement = container.querySelector('.basket__item-index') as HTMLElement;

        // Добавление обработчика события клика
        if (actions?.onClick) {
            (this.buttonElement || container).addEventListener('click', actions.onClick);
        }
    }

    set id(value: string) {
        this.container.dataset.id = value; // Установка id для контейнера
    }

    get id(): string {
        return this.container.dataset.id || ''; // Получение id из контейнера
    }

    set title(value: string) {
        this.updateText(this.titleElement, value); // Установка текста заголовка
    }

    get title(): string {
        return this.titleElement.textContent || ''; // Получение текста заголовка
    }

    set price(value: number | null) {
        this.updateText(this.priceElement, value !== null ? `${value.toString()} синапсов` : ''); // Установка текста цены
        this.toggleButton(value); // Управление состоянием кнопки в зависимости от цены
    }

    get price(): number {
        return Number(this.priceElement.textContent?.replace(/\D/g, '') || '0'); // Получение цены без "синапсов"
    }

    set category(value: string) {
        this.updateText(this.categoryElement, value); // Установка текста категории
        this.categoryElement.className = this.classByCategory(value); // Установка класса категории
    }

    get category(): string {
        return this.categoryElement.textContent || ''; // Получение текста категории
    }

    set index(value: string) {
        if (this.indexElement) {
            this.indexElement.textContent = value; // Установка индекса
        }
    }

    get index(): string {
        return this.indexElement?.textContent || ''; // Получение текста индекса
    }

    set image(value: string) {
        if (this.imageElement) {
            this.imageElement.src = value; // Установка изображения
        }
    }

    set description(value: string) {
        this.updateText(this.descriptionElement, value); // Установка текста описания
    }

    // Определяет CSS-класс в зависимости от категории
    private classByCategory(value: string): string {
        switch (value) {
            case 'софт-скил':
                return 'card__category_soft';
            case 'хард-скил':
                return 'card__category_hard';
            case 'кнопка':
                return 'card__category_button';
            case 'дополнительное':
                return 'card__category_additional';
            default:
                return 'card__category_other';
        }
    }

    // Управляет состоянием кнопки
    private toggleButton(value: number | null) {
        if (this.buttonElement) {
            this.buttonElement.disabled = value === null || value === 0; // Деактивирует кнопку, если значение null или 0
        }
    }
}