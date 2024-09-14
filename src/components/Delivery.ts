import { Form } from "./common/Form"; // Импорт базового класса Form для работы с формами
import { IDelivery, IActions } from "../types"; // Импорт интерфейсов для доставки и действий
import { IEvents } from "../types"; // Импорт интерфейса для событий
import { ensureElement } from "../utils/utils"; // Импорт функции для безопасного выбора элемента

// Класс Delivery, наследующий функциональность от класса Form с параметром IDelivery
export class Delivery extends Form<IDelivery> {
  protected _cardButton: HTMLButtonElement; // Кнопка для выбора оплаты картой
  protected _cashButton: HTMLButtonElement; // Кнопка для выбора оплаты наличными

  // Конструктор класса Delivery, принимает контейнер формы, события и действия
  constructor(container: HTMLFormElement, events: IEvents, actions?: IActions) {
    super(container, events); // Вызов конструктора родительского класса Form

    // Получение и инициализация кнопок оплаты
    this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this._cardButton.classList.add('button_alt-active'); // Добавление стиля для активной кнопки карты

    // Привязка обработчиков событий нажатия к кнопкам, если указаны действия
    if (actions?.onClick) {
      this._cardButton.addEventListener('click', actions.onClick);
      this._cashButton.addEventListener('click', actions.onClick);
    }
  }

  // Метод для переключения активного состояния кнопок
  toggleButtons() {
    this._cardButton.classList.toggle('button_alt-active'); // Переключение класса активности для кнопки карты
    this._cashButton.classList.toggle('button_alt-active'); // Переключение класса активности для кнопки наличных
  }

  // Установка адреса в соответствующее поле формы
  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value; // Присваивание значения полю адреса
  }
}