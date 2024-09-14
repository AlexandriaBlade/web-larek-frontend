// Тип для ответа API, который содержит общее количество элементов и массив элементов указанного типа
export type ApiListResponse<Type> = {
  total: number; // Общее количество элементов
  items: Type[]; // Массив элементов типа Type
};

// Типы методов HTTP, поддерживаемые API
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Тип для названия события, может быть строкой или регулярным выражением
export type EventName = string | RegExp;

// Определение функции-подписчика события
export type Subscriber = Function;

// Формат события эмиттера, включая название события и данные
export type EmitterEvent = {
  eventName: string; // Название события
  data: unknown; // Данные, ассоциированные с событием
};

// Интерфейс для системы событий с методами для подписки, эмитации и триггеринга событий
export interface IEvents {
  on<T extends object>(event: EventName, callback: (data: T) => void): void; // Подписка на событие
  emit<T extends object>(event: string, data?: T): void; // Эмитирование события
  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void; // Триггер события
}

// Интерфейс для состояния формы с флагом валидности и массивом ошибок
export interface IFormState {
  valid: boolean; // Является ли форма валидной
  errors: string[]; // Массив ошибок формы
}

// Интерфейс для данных модального окна
export interface IModalData {
  content: HTMLElement; // Содержимое модального окна
}

// Интерфейс для API веб-магазина с методами для получения продуктов и оформления заказов
export interface IWebLarekAPI {
  getProductList: () => Promise<IProduct[]>; // Получить список продуктов
  getProductItem: (id: string) => Promise<IProduct>; // Получить конкретный продукт по ID
  orderProducts: (order: IOrder) => Promise<IOrderResult>; // Оформить заказ
}

// Интерфейс для результата заказа
export interface IOrderResult {
  id: string; // ID заказа
  total: number | null; // Общая сумма заказа
}

// Интерфейс для продукта с основными характеристиками
export interface IProduct {
  id: string; // ID продукта
  title: string; // Название продукта
  description: string; // Описание продукта
  price: number | null; // Цена продукта
  category: string; // Категория продукта
  image: string; // URL изображения продукта
}

// Интерфейс для состояния приложения, включает в себя каталог, корзину, заказы и формы
export interface IAppState {
  catalog: IProduct[]; // Массив продуктов в каталоге
  basket: IProduct[]; // Массив продуктов в корзине
  order: IOrder | null; // Заказ (если есть)
  preview: string | null; // Предварительный просмотр
  orderForm: IOrderForm | null; // Форма заказа
  contactForm: IContact | null; // Контактная форма
  formErrors: FormErrors; // Ошибки формы
}

// Интерфейс для заказа, включает данные формы и контактные данные
export interface IOrder extends IOrderForm, IContact {
  total: number | null; // Общая сумма заказа
  items: string[]; // Массив ID продуктов в заказе
}

// Интерфейс для данных заказа
export interface IOrderForm {
  payment: string; // Способ оплаты
  address: string; // Адрес доставки
}

// Интерфейс для контактных данных
export interface IContact {
  email: string; // Электронная почта
  phone: string; // Телефон
}

// Интерфейс для данных о доставке
export interface IDelivery {
  payment: string; // Способ оплаты
  address: string; // Адрес доставки
}

// Интерфейс для обработки ошибок формы
export interface FormErrors {
  address?: string; // Ошибка адреса (если есть)
  email?: string; // Ошибка электронной почты (если есть)
  phone?: string; // Ошибка телефона (если есть)
}

// Интерфейс для страницы с данными о счетчике и каталоге
export interface IPage {
  counter: number; // Счетчик элементов на странице
  catalog: HTMLElement[]; // Массив элементов каталога
}

// Интерфейс для состояния формы с флагом валидности и массивом ошибок
export interface IFormState {
  valid: boolean; // Является ли форма валидной
  errors: string[]; // Массив ошибок формы
}

// Интерфейс для действий, связанных с кликами
export interface IActions {
  onClick: (event: MouseEvent) => void; // Обработчик клика с событием мыши
}

// Интерфейс для карточки продукта с дополнительными свойствами
export interface ICard extends IProduct {
  index?: string; // Индекс карточки (если есть)
  buttonTitle?: string; // Название кнопки (если есть)
}

// Интерфейс для представления корзины
export interface IBasketView {
  items: HTMLElement[]; // Массив элементов в корзине
  total: number; // Общая сумма в корзине
}

// Интерфейс для успешного результата с общей суммой
export interface ISuccess {
  total: number; // Общая сумма
}

// Интерфейс для действий при успешном результате
export interface ISuccessActions {
  onClick: () => void; // Обработчик клика для успешного события
}