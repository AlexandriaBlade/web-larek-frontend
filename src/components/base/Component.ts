export abstract class Component<T> {
    // Конструктор класса принимает контейнер, в котором будет размещён компонент
    protected constructor(protected readonly container: HTMLElement) {
    }

    // Инструментарий для работы с DOM в дочерних компонентах

    // Метод для переключения (добавления или удаления) CSS-класса у элемента
    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    // Устанавливает текстовое содержимое для указанного элемента
    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value); // Преобразуем значение в строку и устанавливаем его как текст
        }
    }

    // Сменяет статус блокировки (активен/неактивен) указанного элемента
    setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) {
                // Если состояние true, добавляем атрибут disabled
                element.setAttribute('disabled', 'disabled');
            } else {
                // Если состояние false, удаляем атрибут disabled
                element.removeAttribute('disabled');
            }
        }
    }

    // Метод для скрытия элемента, устанавливая его стиль display в 'none'
    protected setHidden(element: HTMLElement) {
        element.style.display = 'none';
    }

    // Метод для отображения элемента, удаляя стиль display
    protected setVisible(element: HTMLElement) {
        element.style.removeProperty('display'); // Убирает свойство display, чтобы элемент снова стал видимым
    }

    // Устанавливает источник изображения и, при необходимости, альтернативный текст
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src; // Устанавливаем путь к изображению
            if (alt) {
                element.alt = alt; // Устанавливаем альтернативный текст, если он задан
            }
        }
    }

    // Метод для рендеринга компонента, возвращает корневой DOM-элемент
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {}); // Обновляем свойства компонента переданными данными (если есть)
        return this.container; // Возвращаем корневой элемент контейнера
    }
}