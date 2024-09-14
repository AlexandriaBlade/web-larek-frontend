typescript
/**
 * Абстрактный базовый компонент для работы с DOM-элементами.
 * Позволяет создавать компоненты с общими функциями для работы с HTML.
 */
export abstract class BaseComponent<T> {
    protected constructor(protected readonly container: HTMLElement) {}

    // Переключает наличие указанного класса на элементе
    protected toggleClass(element: HTMLElement, className: string, force?: boolean): void {
        element.classList.toggle(className, force);
    }

    // Обновляет текстовое содержимое элемента
    protected updateText(element: HTMLElement, value: unknown): void {
        if (element) {
            element.textContent = String(value);
        }
    }

    // Устанавливает состояние блокировки элемента (используется для кнопок и форм)
    protected setDisabledState(element: HTMLElement, isDisabled: boolean): void {
        if (element) {
            isDisabled ? element.setAttribute('disabled', 'disabled') : element.removeAttribute('disabled');
        }
    }

    // Скрывает элемент, устанавливая его стиль на 'none'
    protected hide(element: HTMLElement): void {
        element.style.display = 'none';
    }

    // Показывает элемент, убирая его стиль display
    protected show(element: HTMLElement): void {
        element.style.display = ''; // Возвращает элемент в состояние отображения по умолчанию
    }

    // Устанавливает изображение и альтернативный текст для элемента img
    protected updateImage(element: HTMLImageElement, src: string, alt?: string): void {
        if (element) {
            element.src = src; // Устанавливаем источник изображения
            if (alt) {
                element.alt = alt; // Устанавливаем альтернативный текст, если он задан
            }
        }
    }

    // Возвращает корневой DOM-элемент компонента
    public render(data?: Partial<T>): HTMLElement {
        Object.assign(this, data ?? {}); // Обновляет свойства компонента, основываясь на переданных данных (если они есть)
        return this.container; // Возвращает контейнер, содержащий компонент
    }
}