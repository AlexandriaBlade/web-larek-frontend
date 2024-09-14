// Константа для хранения базового URL API, получаемого из переменной окружения API_ORIGIN
export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`; // URL для работы с API приложения WebLarek

// Константа для хранения базового URL CDN, получаемого из переменной окружения API_ORIGIN
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`; // URL для доступа к контенту через CDN

// Объект settings для хранения настроек приложения (пока пустой)
export const settings = {
    // Можно добавить настройки приложения сюда в будущем
};

// Объект PaymentMethods для хранения доступных методов оплаты
export const PaymentMethods: { [key: string]: string } = {
    "card": "online", // Оплата картой через онлайн-систему
    "cash": "cash"    // Наличная оплата
};