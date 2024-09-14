// Тип для представления ответа от API, содержащий общее количество и массив элементов определенного типа
export type ApiListResponse<Type> = {
  total: number,           // Общее количество элементов
  items: Type[]           // Массив элементов указанного типа
};

// Типы HTTP методов для POST запросов
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Тип для названия события, которое может быть строкой или регулярным выражением
export type EventName = string | RegExp;
// Тип для подписчика события (функция)
export type Subscriber = Function;
// Тип для события эмиттера, включая имя события и данные
export type EmitterEvent = {
  eventName: string,      // Имя события
  data: unknown           // Данные, передаваемые с событием
};

// Интерфейс, описывающий систему событий с методами для подписки, эмита и триггера событий
export interface IEvents {
  on<T extends object>(event: EventName, callback: (data: T) => void): void; // Подписка на событие
  emit<T extends object>(event: string, data?: T): void;                    // Эмитирование события
  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void; // Триггер события с данными
}

// Интерфейс для состояния формы, указывающий, действительна ли форма и массив ошибок
export interface IFormState {
  valid: boolean;         // Статус валидности формы
  errors: string[];      // Массив ошибок валидации
}

// Интерфейс для данных модального окна
export interface IModalData {
  content: HTMLElement;   // Контент модального окна
}

// Интерфейс для взаимодействия с API приложения WebLarek
export interface IWebLarekAPI {
  getProductList: () => Promise<IProduct[]>; // Получение списка продуктов
  getProductItem: (id: string) => Promise<IProduct>; // Получение одного продукта по ID
  orderProducts: (order: IOrder) => Promise<IOrderResult>; // Размещение заказа
}

// Интерфейс для результата заказа
export interface IOrderResult {
  id: string;           // Идентификатор заказа
  total: number | null; // Общая сумма заказа или null
}

// Интерфейс продукта с его свойствами
export interface IProduct {
  id: string;          // Идентификатор продукта
  title: string;       // Название продукта
  description: string; // Описание продукта
  price: number | null; // Цена продукта или null
  category: string;    // Категория продукта
  image: string;       // Ссылка на изображение продукта
}

// Интерфейс состояния приложения, содержащий различные состояния и формы
export interface IAppState {
  catalog: IProduct[];      // Список продуктов в каталоге
  basket: IProduct[];       // Список продуктов в корзине
  order: IOrder | null;     // Заказ или null, если нет заказа
  preview: string | null;    // Предварительный просмотр или null
  orderForm: IOrderForm | null; // Форма заказа или null
  contactForm: IContact | null; // Контактная форма или null
  formErrors: FormErrors;    // Ошибки формы
}

// Интерфейс для описания заказа, который включает в себя информацию о форме заказа и контактные данные
export interface IOrder extends IOrderForm, IContact {
  total: number | null;    // Общая стоимость заказа или null
  items: string[];         // Массив идентификаторов продуктов в заказе
}

// Интерфейс для формы заказа
export interface IOrderForm {
  payment: string;         // Способ оплаты
  address: string;        // Адрес доставки
}

// Интерфейс для контактной информации
export interface IContact {
  email: string;          // Электронная почта
  phone: string;          // Телефон
}

// Интерфейс для доставки
export interface IDelivery {
  payment: string;        // Метод оплаты
  address: string;        // Адрес доставки
}

// Интерфейс для ошибок формы
export interface FormErrors {
  address?: string;       // Ошибки по адресу
  email?: string;         // Ошибки по электронной почте
  phone?: string;         // Ошибки по телефону
}

// Интерфейс для страницы, содержащий счетчик и каталог элементов
export interface IPage {
  counter: number;        // Счетчик
  catalog: HTMLElement[];  // Массив HTML-элементов
}

// Интерфейс для состояния формы
export interface IFormState {
  valid: boolean;         // Статус валидности формы
  errors: string[];      // Массив ошибок валидации
}

// Интерфейс для описания действий на клики
export interface IActions {
  onClick: (event: MouseEvent) => void; // Обработчик клика
}

// Интерфейс для карточки продукта с дополнительными свойствами
export interface ICard extends IProduct {
  index?: string;        // Индекс карточки (необязательное свойство)
  buttonTitle?: string;  // Название кнопки (необязательное свойство)
}

// Интерфейс для представления содержания корзины
export interface IBasketView {
  items: HTMLElement[];   // Элементы для отображения в корзине
  total: number;         // Общая стоимость товаров в корзине
}

// Интерфейс для представления успешной операции
export interface ISuccess {
  total: number;         // Общая сумма успешной операции
}

// Интерфейс для действий успешной операции
export interface ISuccessActions {
  onClick: () => void;   // Обработчик клика для успешной операции
}