import { Model } from "./base/Model"; // Импорт базового класса Model
import { IProduct, IOrder, IDelivery, IContact, IAppState, FormErrors } from "../types"; // Импорт типов для продукта, заказа, доставки и состояния приложения

/**
 * Тип события изменения каталога, включающего массив продуктов.
 */
export type CatalogChangeEvent = {
  catalog: Product[]
};

/**
 * Класс Product представляет собой модель продукта с его характеристиками.
 * Он наследует функциональность от базового класса Model.
 */
export class Product extends Model<IProduct> {
    id: string; // Уникальный идентификатор продукта
    title: string; // Название продукта
    price: number | null; // Цена продукта (может быть null)
    description: string; // Описание продукта
    category: string; // Категория продукта
    image: string; // URL изображения продукта
}

/**
 * Класс AppState представляет состояние приложения, включая каталог продуктов,
 * корзину и информацию о заказе. Он наследует функциональность от базового класса Model.
 */
export class AppState extends Model<IAppState> {
  catalog: Product[]; // Массив продуктов в каталоге
  basket: Product[] = []; // Массив продуктов в корзине (по умолчанию пустой)
  order: IOrder = { // Объект заказа с начальными значениями
    payment: 'online', // Способ оплаты
    address: '', // Адрес доставки
    email: '', // Email клиента
    phone: '', // Телефон клиента
    total: 0, // Общая сумма заказа
    items: [] // Массив товаров в заказе
  };
  preview: string | null; // ID предварительного просмотра продукта (может быть null)
  formErrors: FormErrors = {}; // Объект для хранения ошибок валидации формы

  /**
   * Метод для очистки корзины.
   */
  clearBasket() {
    this.basket = []; // Обнуляем корзину
    this.updateBasket(); // Обновляем состояние корзины
  }

  /**
   * Метод для очистки заказа, сбрасывает все значения к начальным.
   */
  clearOrder() {
    this.order = {
      payment: 'online', // Сброс способа оплаты на онлайн
      address: '', // Сброс адреса
      email: '', // Сброс email
      phone: '', // Сброс телефона
      total: 0, // Сброс общей суммы
      items: [] // Сброс списка товаров заказа
    };
  }

  /**
   * Метод для установки каталога продуктов и генерации события об изменении.
   * @param items - массив продуктов для каталога
   */
  setCatalog(items: IProduct[]) {
    this.catalog = items.map(item => new Product(item, this.events)); // Преобразуем массив IProduct в массив объектов Product
    this.emitChanges('items:changed', { catalog: this.catalog }); // Генерируем событие об изменении каталога
  }

  /**
   * Метод для установки предварительного просмотра выбранного продукта.
   * @param item - продукт для предварительного просмотра
   */
  setPreview(item: Product) {
    this.preview = item.id; // Устанавливаем ID продукта для предварительного просмотра
    this.emitChanges('preview:changed', item); // Генерируем событие об изменении предварительного просмотра
  }

  /**
   * Метод для обновления состояния корзины и генерации соответствующих событий.
   */
  updateBasket() {
    this.emitChanges('counter:changed', this.basket); // Генерация события об изменении счетчика продуктов в корзине
    this.emitChanges('basket:changed', this.basket); // Генерация события об изменении состояния корзины
  }

  /**
   * Метод для добавления продукта в корзину.
   * @param item - продукт, который нужно добавить
   */
  addToBasket(item: Product) {
    if (this.basket.indexOf(item) < 0) { // Проверяем, есть ли продукт уже в корзине
      this.basket.push(item); // Добавляем продукт в корзину
      this.updateBasket(); // Обновляем состояние корзины
    }
  }

  /**
   * Метод для удаления продукта из корзины.
   * @param item - продукт, который нужно удалить
   */
  removeFromBasket(item: Product) {
    this.basket = this.basket.filter((it) => it != item); // Фильтруем корзину, удаляя указанный продукт
    this.updateBasket(); // Обновляем состояние корзины
  }

  /**
   * Метод для установки значения поля доставки в заказе.
   * @param field - поле, которое нужно установить
   * @param value - новое значение для поля
   */
  setDeliveryField(field: keyof IDelivery, value: string) {
    this.order[field] = value; // Устанавливаем новое значение для заданного поля доставки
    if (this.validateDelivery()) { // Если валидация прошла успешно
      this.events.emit('delivery:ready', this.order); // Генерируем событие о готовности доставки
    }
  }

  /**
   * Метод для установки значения поля контакта в заказе.
   * @param field - поле, которое нужно установить
   * @param value - новое значение для поля
   */
  setContactField(field: keyof IContact, value: string) {
    this.order[field] = value; // Устанавливаем новое значение для заданного поля контакта
    if (this.validateContact()) { // Если валидация прошла успешно
      this.events.emit('contact:ready', this.order); // Генерируем событие о готовности контакта
    }
  }

  /**
   * Метод для валидации полей доставки.
   * @returns true, если поля валидны, иначе false
   */
  validateDelivery() {
    const errors: typeof this.formErrors = {}; // Создаем объект для хранения ошибок
    if (!this.order.address) { // Проверяем, заполнено ли поле адреса
      errors.address = "Необходимо указать адрес"; // Если нет, добавляем ошибку
    }
    this.formErrors = errors; // Обновляем объект ошибок
    this.events.emit('formErrors:change', this.formErrors); // Генерируем событие об изменении ошибок
    return Object.keys(errors).length === 0; // Возвращаем true, если нет ошибок
  }

  /**
   * Метод для валидации полей контакта.
   * @returns true, если поля валидны, иначе false
   */
  validateContact() {
    const errors: typeof this.formErrors = {}; // Создаем объект для хранения ошибок
    if (!this.order.email) { // Проверяем, заполнено ли поле email
      errors.email = 'Необходимо указать email'; // Если нет, добавляем ошибку
    }
    if (!this.order.phone) { // Проверяем, заполнено ли поле телефона
      errors.phone = 'Необходимо указать телефон'; // Если нет, добавляем ошибку
    }
    this.formErrors = errors; // Обновляем объект ошибок
    this.events.emit('formErrors:change', this.formErrors); // Генерируем событие об изменении ошибок
    return Object.keys(errors).length === 0; // Возвращаем true, если нет ошибок
  }
}