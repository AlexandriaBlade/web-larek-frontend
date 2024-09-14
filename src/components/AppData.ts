import { Model } from "./base/Model";
import { IProduct, IOrder, IDelivery, IContact, IAppState, FormErrors } from "../types";

// Определение типа события изменения каталога
export type CatalogChangeEvent = {
  catalog: Product[]
};

// Класс Product представляет продукт с его атрибутами
export class Product extends Model<IProduct> {
    id: string; // Уникальный идентификатор продукта
    title: string; // Название продукта
    price: number | null; // Цена продукта
    description: string; // Описание продукта
    category: string; // Категория продукта
    image: string; // URL изображения продукта
}

// Класс AppState управляет состоянием приложения
export class AppState extends Model<IAppState> {
  catalog: Product[]; // Каталог продуктов
  basket: Product[] = []; // Корзина для покупки
  order: IOrder = { // Данные заказа
    payment: 'online',
    address: '',
    email: '',
    phone: '',
    total: 0,
    items: []
  };
  preview: string | null; // Предварительный просмотр выбранного продукта
  formErrors: FormErrors = {}; // Ошибки в форме

  // Очищает корзину
  clearBasket() {
    this.basket = [];
    this.updateBasket();
  }

  // Очищает данные заказа
  clearOrder() {
    this.order = {
      payment: 'online',
      address: '',
      email: '',
      phone: '',
      total: 0,
      items: []
    };
  }

  // Устанавливает каталог продуктов
  setCatalog(items: IProduct[]) {
    this.catalog = items.map(item => new Product(item, this.events));
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  // Устанавливает предварительный просмотр выбранного продукта
  setPreview(item: Product) {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
  }

  // Обновляет состояние корзины
  updateBasket() {
    this.emitChanges('counter:changed', this.basket);
    this.emitChanges('basket:changed', this.basket);
  }

  // Добавляет продукт в корзину
  addToBasket(item: Product) {
    if (!this.basket.includes(item)) { // Проверяем, есть ли продукт в корзине
      this.basket.push(item);
      this.updateBasket();
    }
  }

  // Удаляет продукт из корзины
  removeFromBasket(item: Product) {
    this.basket = this.basket.filter(it => it !== item);
    this.updateBasket();
  }

  // Устанавливает поле доставки
  setDeliveryField(field: keyof IDelivery, value: string) {
    this.order[field] = value;
    if (this.validateDelivery()) {
      this.events.emit('delivery:ready', this.order);
    }
  }

  // Устанавливает поле контакта
  setContactField(field: keyof IContact, value: string) {
    this.order[field] = value;
    if (this.validateContact()) {
      this.events.emit('contact:ready', this.order);
    }
  }

  // Валидация данных доставки
  validateDelivery() {
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
      errors.address = "Необходимо указать адрес";
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  // Валидация контактных данных
  validateContact() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }
}