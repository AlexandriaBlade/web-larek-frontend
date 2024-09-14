// URL для API веб-магазина, формируется на основе переменной окружения API_ORIGIN
export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;

// URL для контента веб-магазина, также формируется на основе переменной окружения API_ORIGIN
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

// Объект настроек для приложения (пока пустой, можно добавлять параметры по мере необходимости)
export const settings = {
    // Пример: apiVersion: '1.0', timeout: 5000
};

// Объект, содержащий методы оплаты; ключи — это идентификаторы методов, значения — их описание
export const PaymentMethods: { [key: string]: string } = {
    "card": "online", // Оплата картой осуществляется онлайн
    "cash": "cash"    // Оплата наличными
};