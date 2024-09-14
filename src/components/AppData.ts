// Определение интерфейсов
export interface IProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number;
}

export interface IOrder {
  payment: string;
  address: string;
  email: string;
  phone: string;
  total: number;
  items: IProduct[];
}

export interface IAppState {
  catalog: IProduct[];
  basket: IProduct[];
  order: IOrder;
  preview: string | null;
  formErrors: Record<string, string>;
}

export interface IEvents {
  // Определите вашу архитектуру событий здесь
}

// Базовый класс Model
export class Model<T> {
  protected state: T;
  protected eventSystem: IEvents;

  constructor(initialData: Partial<T>, eventSystem: IEvents) {
      this.state = { ...initialData } as T;
      this.eventSystem = eventSystem;
  }

  public emitChanges(eventName: string, data: any) {
      // Логика эмитирования изменений
      console.log(eventName, data);
  }
}

// Класс Product, реализующий интерфейс IProduct
class Product implements IProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number;

  constructor(data: IProduct) {
      this.id = data.id;
      this.title = data.title;
      this.description = data.description;
      this.category = data.category;
      this.image = data.image;
      this.price = data.price;
  }
}

// Класс AppData управляет состоянием приложения
export class AppData extends Model<IAppState> {
  constructor(initialData: Partial<IAppState>, eventSystem: IEvents) {
      const defaultState: IAppState = {
          catalog: [],
          basket: [],
          order: {
              payment: 'online',
              address: '',
              email: '',
              phone: '',
              total: 0,
              items: []
          },
          preview: null,
          formErrors: {}
      };

      super({ ...defaultState, ...initialData }, eventSystem);
  }

  // Устанавливает каталог продуктов
  setCatalog(items: IProduct[]) {
      this.state.catalog = items.map(item => new Product(item));
      this.emitChanges('catalog:changed', { catalog: this.state.catalog });
  }

  // Устанавливает предварительный просмотр выбранного продукта
  setPreview(item: IProduct) {
      this.state.preview = item.id;
      this.emitChanges('preview:changed', item);
  }

  // Обновляет состояние корзины
  updateBasket() {
      this.emitChanges('basket:changed', this.state.basket);
  }

  // Добавляет продукт в корзину
  addToBasket(item: IProduct) {
      if (!this.state.basket.includes(item)) {
          this.state.basket.push(item);
          this.updateBasket();
      }
  }

  // Удаляет продукт из корзины
  removeFromBasket(item: IProduct) {
      this.state.basket = this.state.basket.filter(it => it !== item);
      this.updateBasket();
  }

  // Устанавливает поле доставки
  setDeliveryField(field: keyof IOrder, value: string) {
      this.state.order[field] = value;
      if (this.validateDelivery()) {
          this.emitChanges('delivery:ready', this.state.order);
      }
  }

  // Устанавливает поле контакта
  setContactField(field: keyof IOrder, value: string) {
      this.state.order[field] = value;
      if (this.validateContact()) {
          this.emitChanges('contact:ready', this.state.order);
      }
  }

  // Валидация данных доставки
  validateDelivery() {
      const errors: Record<string, string> = {};
      if (!this.state.order.address) {
          errors.address = "Необходимо указать адрес";
      }
      this.state.formErrors = errors;
      this.emitChanges('formErrors:change', this.state.formErrors);
      return Object.keys(errors).length === 0;
  }

  // Валидация контактных данных
  validateContact() {
      const errors: Record<string, string> = {};
      if (!this.state.order.email) {
          errors.email = 'Необходимо указать email';
      }
      if (!this.state.order.phone) {
          errors.phone = 'Необходимо указать телефон';
      }
      this.state.formErrors = errors;
      this.emitChanges('formErrors:change', this.state.formErrors);
      return Object.keys(errors).length === 0;
  }
}