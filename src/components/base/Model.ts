import { IEvents } from "../../types";

// Гарда для проверки на экземпляр модели
export const isModel = (obj: unknown): obj is Model<any> => {
    // Проверяем, является ли объект экземпляром класса Model
    return obj instanceof Model;
}

/**
 * Базовая модель, чтобы можно было отличить ее от простых объектов с данными
 */
export abstract class Model<T> {
    // Конструктор принимает частичные данные и объект для работы с событиями
    constructor(data: Partial<T>, protected events: IEvents) {
        // Копируем данные в объект модели с помощью Object.assign
        Object.assign(this, data);
    }

    // Сообщить всем, что модель изменилась
    emitChanges(event: string, payload?: object) {
        // Состав данных может быть модифицирован, если будет передан payload
        this.events.emit(event, payload ?? {}); // Вызываем событие и передаем данные (или пустой объект, если нет данных)
    }
}