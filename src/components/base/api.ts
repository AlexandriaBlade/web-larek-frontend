import { ApiPostMethods } from "../../types";

/**
 * Класс Api для выполнения HTTP-запросов к API.
 * Обеспечивает методы для отправки GET и POST запросов.
 */
export class Api {
    readonly baseUrl: string; // Базовый URL для API
    protected options: RequestInit; // Опции для запросов, такие как заголовки

    /**
     * Конструктор класса Api.
     * @param baseUrl - Базовый URL, к которому будут направляться запросы.
     * @param options - Опциональные параметры для конфигурации запросов, по умолчанию пустой объект.
     */
    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl; // Инициализация базового URL
        this.options = {
            headers: {
                'Content-Type': 'application/json', // Заголовок для передачи JSON данных
                ...(options.headers as object ?? {}) // Объединение пользовательских заголовков с заголовками по умолчанию
            },
            ...options // Добавление других пользовательских опций, если они есть
        };
    }

    /**
     * Обрабатывает ответ от сервера.
     * @param response - Ответ сервера.
     * @returns Promise с данными ответа или ошибкой.
     */
    protected handleResponse(response: Response): Promise<object> {
        if (response.ok) {
            // Если ответ успешный, парсим JSON
            return response.json();
        } else {
            // Если произошла ошибка, парсим JSON и отклоняем промис с сообщением об ошибке
            return response.json()
                .then(data => Promise.reject(data.error ?? response.statusText));
        }
    }

    /**
     * Выполняет GET-запрос.
     * @param uri - URI для запроса.
     * @returns Promise с данными ответа.
     */
    get(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET' // Указываем метод GET
        }).then(this.handleResponse); // Обрабатываем ответ от сервера
    }

    /**
     * Выполняет POST-запрос.
     * @param uri - URI для запроса.
     * @param data - Данные, которые будут отправлены в теле запроса.
     * @param method - Метод запроса, по умолчанию 'POST'.
     * @returns Promise с данными ответа.
     */
    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method, // Указываем метод запроса
            body: JSON.stringify(data) // Данные отправляем в формате JSON
        }).then(this.handleResponse); // Обрабатываем ответ от сервера
    }
}
