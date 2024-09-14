import { IEvents } from "../../types";

// Проверка, является ли объект экземпляром Model
export const isModel = (obj: unknown): obj is Model<any> => {
    return obj instanceof Model;
}

/**
 * Абстрактный класс для всех моделей данных.
 * Используется для отличия моделей от обычных объектов.
 */
export abstract class Model<T> {
    constructor(initialData: Partial<T>, protected eventSystem: IEvents) {
        Object.assign(this, initialData); // Копирует данные в текущий объект
    }

    // Уведомляет слушателей об изменении состояния модели
    emitChanges(eventName: string, eventData?: object) {
        // Отправляем события с возможностью указания дополнительных данных
        this.eventSystem.emit(eventName, eventData ?? {});
    }
}