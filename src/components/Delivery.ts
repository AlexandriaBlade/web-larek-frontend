import { Form } from "./common/Form";
import { IDelivery, IActions } from "../types";
import { IEvents } from "../types";
import { ensureElement } from "../utils/utils";

// Класс Delivery наследуется от формы и представляет доставку
export class Delivery extends Form<IDelivery> {
  // Кнопки для различных способов оплаты
  private _cardButton: HTMLButtonElement;
  private _cashButton: HTMLButtonElement;

  // Конструктор класса
  constructor(container: HTMLFormElement, events: IEvents, actions?: IActions) {
    // Вызываем конструктор родительского класса
    super(container, events);

    // Ищем кнопки в контейнере по селекторам
    this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    
    // Добавляем активный класс для кнопки карты по умолчанию
    this._cardButton.classList.add('button_alt-active');

    // Если переданы действия, добавляем обработчики событий на кнопки
    if (actions?.onClick) {
      this.addEventListeners(actions.onClick);
    }
  }

  // Приватный метод для добавления обработчиков событий на кнопки
  private addEventListeners(onClick: EventListener): void {
    this._cardButton.addEventListener('click', onClick);
    this._cashButton.addEventListener('click', onClick);
  }

  // Метод для переключения активного состояния кнопок
  public toggleButtons(): void {
    this._cardButton.classList.toggle('button_alt-active');
    this._cashButton.classList.toggle('button_alt-active');
  }

  // Сеттер для адреса доставки
  public set address(value: string) {
    // Находим элемент с именем 'address' и присваиваем ему значение
    const addressInput = this.container.elements.namedItem('address') as HTMLInputElement;
    if (addressInput) {
      addressInput.value = value;
    }
  }
}