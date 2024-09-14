import { Subscriber, EventName, IEvents, EmitterEvent } from "../../types";

/**
 * Класс для управления событиями, реализующий паттерн EventEmitter.
 * В дальнейшем можно добавить возможность подписки на все события
 * или прослушивания событий по определённым шаблонам.
 */
export class EventEmitter implements IEvents {
    private _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    /**
     * Подписаться на указанные события, добавляя обработчик.
     */
    on<T extends object>(eventName: EventName, callback: (event: T) => void) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        this._events.get(eventName)?.add(callback);
    }

    /**
     * Отписаться от события, удаляя указанный обработчик.
     */
    off(eventName: EventName, callback: Subscriber) {
        if (this._events.has(eventName)) {
            this._events.get(eventName)!.delete(callback);
            if (this._events.get(eventName)?.size === 0) {
                this._events.delete(eventName);
            }
        }
    }

    /**
     * Сгенерировать событие с переданными данными.
     */
    emit<T extends object>(eventName: string, data?: T) {
        this._events.forEach((subscribers, name) => {
            if (name === '*') {
                subscribers.forEach(callback => callback({
                    eventName,
                    data
                }));
            }
            if (name instanceof RegExp && name.test(eventName) || name === eventName) {
                subscribers.forEach(callback => callback(data));
            }
        });
    }

    /**
     * Подписаться на все возможные события.
     */
    onAll(callback: (event: EmitterEvent) => void) {
        this.on("*", callback);
    }

    /**
     * Удалить все зарегистрированные обработчики событий.
     */
    offAll() {
        this._events.clear();
    }

    /**
     * Создать триггер-коллбек, который будет генерировать событие при его вызове.
     */
    trigger<T extends object>(eventName: string, context?: Partial<T>) {
        return (event: object = {}) => {
            this.emit(eventName, {
                ...(event || {}),
                ...(context || {})
            });
        };
    }
}
