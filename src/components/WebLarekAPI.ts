import { Api } from "./base/api"; // Базовый API
import { IOrderResult, IProduct, IOrder, ApiListResponse, IWebLarekAPI } from "../types"; // Интерфейсы и типы

export class WebLarekAPI extends Api implements IWebLarekAPI {
  readonly cdn: string; // CDN для изображений
  
  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options); // Инициализация базового класса
    this.cdn = cdn; // Установка CDN
  }

  // Получение товара по ID
  getProductItem(id: string): Promise<IProduct> {
    return this.get(`/product/${id}`).then(
      (item: IProduct) => ({
        ...item,
        image: this.cdn + item.image, // Форматирование URL изображения
      })
    );
  }

  // Получение списка товаров
  getProductList(): Promise<IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<IProduct>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image // Форматирование URL изображения для списка
      }))
    );
  }

  // Отправка заказа
  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.post(`/order`, order).then(
      (data: IOrderResult) => data // Возврат результата заказа
    );
  }
}