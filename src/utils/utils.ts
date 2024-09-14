// Преобразует строку в формате PascalCase в формат kebab-case
export function pascalToKebab(value: string): string {
    return value.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase(); // Заменяет заглавные буквы на строчные, разделяя их дефисами
}

// Проверяет, является ли переданный аргумент строкой и содержит более одного символа
export function isSelector(x: any): x is string {
    return (typeof x === "string") && x.length > 1;
}

// Проверяет, является ли значение пустым (null или undefined)
export function isEmpty(value: any): boolean {
    return value === null || value === undefined;
}

// Тип, представляющий коллекцию селекторов
export type SelectorCollection<T> = string | NodeListOf<Element> | T[];

// Получает все элементы, соответствующие селектору, из заданного контекста
export function ensureAllElements<T extends HTMLElement>(selectorElement: SelectorCollection<T>, context: HTMLElement = document as unknown as HTMLElement): T[] {
    if (isSelector(selectorElement)) {
        return Array.from(context.querySelectorAll(selectorElement)) as T[]; // Получаем элементы по селектору
    }
    if (selectorElement instanceof NodeList) {
        return Array.from(selectorElement) as T[]; // Преобразуем NodeList в массив
    }
    if (Array.isArray(selectorElement)) {
        return selectorElement; // Возвращаем массив элементов
    }
    throw new Error(`Unknown selector element`); // Ошибка, если тип селектора неизвестен
}

// Тип, представляющий элемент селектора (строка или экземпляр типа T)
export type SelectorElement<T> = T | string;

// Убедитесь, что селектор всегда возвращает один элемент
export function ensureElement<T extends HTMLElement>(selectorElement: SelectorElement<T>, context?: HTMLElement): T {
    if (isSelector(selectorElement)) {
        const elements = ensureAllElements<T>(selectorElement, context); // Получаем все элементы по селектору
        if (elements.length > 1) {
            console.warn(`selector ${selectorElement} returned more than one element`); // Предупреждение, если найдено больше одного элемента
        }
        if (elements.length === 0) {
            throw new Error(`selector ${selectorElement} returned nothing`); // Ошибка, если не найдено ни одного элемента
        }
        return elements.pop() as T; // Возвращаем последний найденный элемент
    }
    if (selectorElement instanceof HTMLElement) {
        return selectorElement as T; // Возвращаем элемент, если это уже HTMLElement
    }
    throw new Error('Unknown selector element'); // Ошибка, если тип селектора неизвестен
}

// Клонирует HTML-шаблон и возвращает его как элемент определённого типа
export function cloneTemplate<T extends HTMLElement>(query: string | HTMLTemplateElement): T {
    const template = ensureElement(query) as HTMLTemplateElement; // Получаем шаблон
    return template.content.firstElementChild.cloneNode(true) as T; // Клонируем и возвращаем элемент
}

// Функция для генерации имен классов по БЭМ-методу
export function bem(block: string, element?: string, modifier?: string): { name: string, class: string } {
    let name = block; // Начинаем с имени блока
    if (element) name += `__${element}`; // Добавляем элемент, если он есть
    if (modifier) name += `_${modifier}`; // Добавляем модификатор, если он есть
    return {
        name,
        class: `.${name}` // Возвращаем объект с именем и классом
    };
}

// Получает все свойства объекта с опциональным фильтром
export function getObjectProperties(obj: object, filter?: (name: string, prop: PropertyDescriptor) => boolean): string[] {
    return Object.entries(
        Object.getOwnPropertyDescriptors(
            Object.getPrototypeOf(obj) // Получаем дескрипторы свойств прототипа объекта
        )
    )
        .filter(([name, prop]: [string, PropertyDescriptor]) => filter ? filter(name, prop) : (name !== 'constructor')) // Применяем фильтр
        .map(([name, prop]) => name); // Возвращаем только имена свойств
}

/**
 * Устанавливает dataset атрибуты элемента.
 */
export function setElementData<T extends Record<string, unknown> | object>(el: HTMLElement, data: T) {
    for (const key in data) {
        el.dataset[key] = String(data[key]); // Присваиваем значения dataset атрибутам элемента
    }
}

/**
 * Получает типизированные данные из dataset атрибутов элемента.
 */
export function getElementData<T extends Record<string, unknown>>(el: HTMLElement, scheme: Record<string, Function>): T {
    const data: Partial<T> = {};
    for (const key in el.dataset) {
        data[key as keyof T] = scheme[key](el.dataset[key]); // Применяем функцию преобразования к значению dataset
    }
    return data as T; // Возвращаем данные в типизированном виде
}

/**
 * Проверка, является ли объект простым объектом.
 */
export function isPlainObject(obj: unknown): obj is object {
    const prototype = Object.getPrototypeOf(obj);
    return  prototype === Object.getPrototypeOf({}) || // Проверяем, является ли прототип Object
        prototype === null; // Или проверяем на null
}

// Проверяем, является ли значение логическим типом
export function isBoolean(v: unknown): v is boolean {
    return typeof v === 'boolean'; // Проверка типа
}

/**
 * Фабрика DOM-элементов в простейшей реализации.
 * Здесь не учтено много факторов.
 * В интернете можно найти более полные реализации.
 */
export function createElement<
    T extends HTMLElement
>(
    tagName: keyof HTMLElementTagNameMap, // Имя тега
    props?: Partial<Record<keyof T, string | boolean | object>>, // Свойства элемента
    children?: HTMLElement | HTMLElement[] // Дочерние элементы
): T {
    const element = document.createElement(tagName) as T; // Создаем элемент
    if (props) {
        for (const key in props) {
            const value = props[key];
            if (isPlainObject(value) && key === 'dataset') {
                setElementData(element, value); // Если свойство - это объект для dataset, устанавливаем его
            } else {
                // @ts-expect-error fix indexing later
                element[key] = isBoolean(value) ? value : String(value); // Устанавливаем другие свойства
            }
        }
    }
    if (children) {
        for (const child of Array.isArray(children) ? children : [children]) {
            element.append(child); // Добавляем дочерние элементы
        }
    }
    return element; // Возвращаем созданный элемент
}