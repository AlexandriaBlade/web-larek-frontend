import { Subscriber, EventName, IEvents, EmitterEvent } from "../../types";

/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах возможно подписываться на все события
 * или слушать события по шаблону (например, используя регулярные выражения)
 */
export class EventEmitter implements IEvents {
    // Хранит события и их подписчиков в виде Map, где ключ - имя события, а значение - множество подписчиков
    _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        // Инициализация пустой карты для хранения событий
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    /**
     * Установка обработчика на указанное событие
     * @param eventName - имя события
     * @param callback - функция-обработчик, вызываемая при возникновении события
     */
    on<T extends object>(eventName: EventName, callback: (event: T) => void) {
        // Проверяем, есть ли уже обработчики для данного события. Если нет — создаем новое множество подписчиков
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        // Добавляем переданный коллбек в множество подписчиков для указанного события
        this._events.get(eventName)?.add(callback);
    }

    /**
     * Удаление обработчика с указанного события
     * @param eventName - имя события
     * @param callback - функция-обработчик, которую нужно удалить
     */
    off(eventName: EventName, callback: Subscriber) {
        // Проверяем, существует ли событие
        if (this._events.has(eventName)) {
            // Удаляем указанный коллбек из множества подписчиков для этого события
            this._events.get(eventName)!.delete(callback);
            // Если после удаления подписчиков для события не осталось, удаляем само событие из карты
            if (this._events.get(eventName)?.size === 0) {
                this._events.delete(eventName);
            }
        }
    }

    /**
     * Инициирует событие и вызывает его подписчиков с данными
     * @param eventName - имя события
     * @param data - данные, передаваемые подписчикам
     */
    emit<T extends object>(eventName: string, data?: T) {
        // Проходим по всем событиям и их подписчикам
        this._events.forEach((subscribers, name) => {
            // Если имя события — триггер для всех событий, вызываем коллбеки всех подписчиков
            if (name === '*') {
                subscribers.forEach(callback => callback({
                    eventName,
                    data
                }));
            }
            // Если имя события совпадает или соответствует регулярному выражению, вызываем соответствующие коллбеки
            if (name instanceof RegExp && name.test(eventName) || name === eventName) {
                subscribers.forEach(callback => callback(data));
            }
        });
    }

    /**
     * Подписка на все события
     * @param callback - функция-обработчик, вызываемая при возникновении любого события
     */
    onAll(callback: (event: EmitterEvent) => void) {
        // Подписываемся на событие "*", которое срабатывает для всех событий
        this.on("*", callback);
    }

    /**
     * Удаление всех обработчиков
     */
    offAll() {
        // Обнуляем карту событий, удаляя все события и подписчиков
        this._events = new Map<string, Set<Subscriber>>();
    }

    /**
     * Создает триггер-функцию, которая инициирует событие при вызове
     * @param eventName - имя события
     * @param context - контекст (дополнительные данные), передаваемые при инициировании события
     * @returns функция, инициирующая событие с объединенными данными
     */
    trigger<T extends object>(eventName: string, context?: Partial<T>) {
        return (event: object = {}) => {
            // Вызываем emit с объединёнными данными события и контекстом
            this.emit(eventName, {
                ...(event || {}),
                ...(context || {})
            });
        };
    }
}