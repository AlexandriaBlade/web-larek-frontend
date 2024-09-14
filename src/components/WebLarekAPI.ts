import { Api } from "./base/api"; // Импорт базового класса Api для выполнения API-запросов
import { IOrderResult, IProduct, IOrder, ApiListResponse, IWebLarekAPI } from "../types"; // Импорт интерфейсов, описывающих результат заказа, продукт, заказ и структуру API

// Класс WebLarekAPI, который наследует функциональность от класса Api и реализует интерфейс IWebLarekAPI
export class WebLarekAPI extends Api implements IWebLarekAPI {
  readonly cdn: string; // URL для контентной доставки (CDN)

  // Конструктор класса WebLarekAPI, принимает адрес CDN, базовый URL и параметры запроса
  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options); // Вызов конструктора родительского класса Api
    this.cdn = cdn; // Инициализация свойства cdn
  }

  // Метод для получения информации о продукте по его идентификатору
  getProductItem(id: string): Promise<IProduct> {
    return this.get(`/product/${id}`).then(
      (item: IProduct) => ({
        ...item,
        image: this.cdn + item.image, // Формирование полного URL изображения с использованием CDN
      })
    );
  }

  // Метод для получения списка продуктов
  getProductList(): Promise<IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<IProduct>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image, // Формирование полного URL изображения для каждого продукта
      }))
    );
  }

  // Метод для размещения заказа на продукты
  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.post(`/order`, order).then(
      (data: IOrderResult) => data // Возвращение результата выполнения заказа
    );
  }
}