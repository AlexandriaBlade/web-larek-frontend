import { ApiPostMethods } from "../../types";

// Определяем класс Api, который предназначен для выполнения HTTP-запросов к API
export class Api {
    // Базовый URL для запросов
    readonly baseUrl: string;
    // Настройки запроса
    protected options: RequestInit;

    // Конструктор класса принимает базовый URL и опциональные настройки запросов
    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        // Устанавливаем заголовки по умолчанию и объединяем с заголовками из переданных опций
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {}) // Объединяем заголовки
            }
        };
    }

    // Метод для обработки ответа от сервера
    protected handleResponse(response: Response): Promise<object> {
        // Если ответ успешный (статусный код в диапазоне 200-299)
        if (response.ok) return response.json();
        // Если произошла ошибка, извлекаем сообщение об ошибке
        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }

    // Метод для выполнения GET-запроса
    get(uri: string) {
        // Выполняем fetch-запрос и обрабатываем ответ
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET' // Указываем метод GET
        }).then(this.handleResponse); // Обрабатываем ответ с помощью handleResponse
    }

    // Метод для выполнения POST-запроса
    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        // Выполняем fetch-запрос и обрабатываем ответ
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method, // Используем переданный метод (по умолчанию POST)
            body: JSON.stringify(data) // Преобразуем объект данных в JSON-строку
        }).then(this.handleResponse); // Обрабатываем ответ с помощью handleResponse
    }
}