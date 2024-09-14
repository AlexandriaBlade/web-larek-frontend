https://github.com/AlexandriaBlade/web-larek-frontend.git

# Проектная работа "Веб-ларек"
```
Стек: HTML, SCSS, TS, Webpack
```

 ## Структура проекта:
```
src/ — исходные файлы проекта
src/components/ — папка с JS компонентами
src/components/base/ — папка с базовым кодом
```

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

npm install
npm run start
или

```
yarn
yarn start
```

Сборка
npm run build
или
```

yarn build
```


## Архитектура приложения
```

Код приложения разделен на слои согласно парадигме MVP:

слой представления(Viev), отвечает за отображение данных на странице

слой данных, отвечает за хранение и изменение данных(Modal)

презентер(Presenter), отвечает за связь представления и данных.
```


## Базовый код

### Класс Api

Класс API обеспечивает работу с данными с сервера. Он отвечает за отправку HTTP-запросов и обработку ответов от сервера. Класс API содержит методы для выполнения GET и POST запросов к указанному URI.

#### Свойства: 

get(uri: string) - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
post(uri: string, data: object, method: ApiPostMethods = 'POST') - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется POST запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.


### Класс WebLarekApi

Этот класс наследует функциональность от базового класса Api и реализует интерфейс IWebLarekAPI.


 Методы API:

getProductItem(id: string)`: Получает данные о конкретном продукте. В ответ формируется объект товара, в который добавляется полный URL для изображения.
getProductList(): Получает список товаров и возвращает массив объектов с полными ссылками на изображения.
orderProducts(order: IOrder): Отправляет заказ на сервер и возвращает результат выполнения.

Используемые типы данных:

IProduct - интерфейс данных товара;
IOrder - интерфейс структуры данных заказа;
IOrderResult - интерфейс структуры данных результата заказа;
ApiListResponse<T> - обобщенный тип для ответа списка элементов от API;
IWebLarekAPI - интерфейс, описывающий методы WebLarekAPI.




### Класс EventEmitter


Класс EventEmitter представляет собой брокер событий, позволяющий устанавливать и удалять слушателей событий, а также вызывать этих слушателей при возникновении событий. Он содержит методы для установки обработчика на событие (on), удаления обработчика события (off), инициирования события (emit), а также другие методы для работы с событиями.


Основные методы, реализуемые классом:

on(eventName: EventName, callback: (event: T) => void) - добавляем обработчик на определенное событие.


off(eventName: EventName, callback: Subscriber) - удаляем обработчик с определенного события.


emit(eventName: string, data?: T) - инициирует событие с передачей данных(опционально).


onAll(callback: (event: EmitterEvent) => void) - слушать все события.


offAll() - удалить все обработчики событий


trigger(eventName: string, context?: Partial<T>) - возвращает функцию, генерирующую событие при вызове




### Класс Component



Класс Component представляет собой базовый компонент, обеспечивающий работу с DOM-элементами. Он позволяет отображать/скрывать элементы, изменять их атрибуты, добавлять/удалять классы элементов и реагировать на события.

**Основные методы**:

добавление/удаление классов элементов;
protected constructor(container: HTMLElement) - конструктор, на вход принимает контейнер, в котором необходимо создать элемент отображения.

**Реализуемые методы**:
toggleClass(element: HTMLElement, className: string, force?: boolean) - переключает класс у элемента;

protected updateText(element: HTMLElement, value: unknown) - устанавливает текстовое содержимое элемента;

setDisabledState(element: HTMLElement, state: boolean) - устанавливает или удаляет атрибут disabled;

protected hide(element: HTMLElement) - cкрывает элемент;

protected show(element: HTMLElement) - делает элемент видимым;

protected updateImage(element: HTMLImageElement, src: string, alt?: string) - yстанавливает изображение и альтернативный текст для него;

render(data?: Partial<T>) - рендер компонента.


```

### Класс Model
```
Класс Modal является абстрактным классом, предназначенным для работы с данными. Он используется как для представления, так и для работы с данными. Класс Model содержит методы для сообщения об изменениях модели, такие как emitChanges, которые сообщают всем об изменении модели.

**Реализуемые методы**:

emitChanges(event: string, payload?: object) - сообщает всем об изменении модели. Используемые типы данных:


IEvents - интерфейс для работы с событиями;


T - обобщенный тип данных, представляющий структуру данных модели.


```

## Классы для работы с данными

Эти классы содержат информацию о заказе, корзине и карточке товара, полученную с сервера, так же они обеспечивают возможность отображения и обработки этих данных.


```

### Класс AppState


Класс AppState играет ключевую роль в проекте "Веб-ларек" и является основной моделью данных для всего приложения. Он содержит информацию о каталоге продуктов, данных о заказе и ошибках валидации форм доставки и контакта.

AppState расширяет базовый класс Model, что позволяет использовать его функциональность для работы с данными. Класс имеет конструктор, который принимает исходное состояние приложения, представленное в виде объекта типа IAppState

**Включает в себя свойства**:

catalog: Product[] - массив товаров в каталоге;


basket: Product[] - массив товаров в корзине;


order: IOrder - данные о заказе;


preview: string | null - товар для предпросмотра;


formErrors: FormErrors - ошибки форм.


**Реализуемые методы**:

clearBasket() - очистка корзины и генерация соответствующего события;


addToBasket(item: Product) - добавление товара в корзину;


removeFromBasket(item: Product)- удаление товара из корзины;


updateBasket() - обновление состояния корзины;


setCatalog(items: IProduct[]) - заполнение каталога товаров;


setPreview(item: Product) - установка товара для предпросмотра;


clearOrder() - очистка данных заказа;


setDeliveryField(field: keyof IDelivery, value: string) - заполнение полей формы доставки;


setContactField(field: keyof IContact, value: string) - заполнение полей формы контакта. 

**Используемые типы данных**:
IAppState - интерфейс с общим состоянием приложения. Включает в себя поля каталога товаров, корзины, текущего заказа, предпросмотра товара и ошибок форм;


IOrder - интерфейс структуры заказа. Включает в себя информацию о способе оплаты, адресе доставки, электронной почте, номере телефона, общей стоимости и списка заказанных товаров; IDelivery - интерфейс для определения полей формы заказа, связанные с данными о доставке; 

FormErrors - интерфейс структуры хранения ошибок валидации форм; 

IContact - интерфейс формы контактных данных; 


IProduct - интерфейс данных товара.



## Класс Product

Класс Product предназначен для хранения информации о продукте.
В его конструкторе принимаются данные о продукте в соответствии с интерфейсом IProduct.
Этот класс наследует конструктор и методы от класса Model. 

**Вот его свойства**:

id: string - идентификатор продукта;


title: string - название товара;


price: number | null - цена товара;


description: string - описание товара;


category: string - категория товара.


image: string - изображение проудкта. 

**Используемые типы данных**:


IProduct - интерфейс данных товара.
```

```
## Классы отображения
```
В данных классах происходит заполнение информации HTML-элементов и установка обработчиков событий на эти элементы с применением EventEmitter.

``` 

### Класс, описывающий главную страницу

Класс Page предназначен для отображения и управления всеми элементами на странице, такими как каталог товаров и количество товаров в корзине.
Он наследуется от класса Component.
В конструкторе (constructor) принимается контейнер страницы (HTMLElement) и объект (events) для управления событиями.

**Свойства класса**:

protected _counter: HTMLElement; - счетчик корзины;


protected _catalog: HTMLElement; - каталог товаров;


protected _wrapper: HTMLElement; - обертка страницы;


protected _basket: HTMLElement; - корзина товаров. 

**Реализуемые методы**:


set counter(value: number) - сеттер количества товаров в корзине;


set catalog(items: HTMLElement[]) - сеттер каталога товаров на основе переданного массива;


set locked(value: boolean) - сеттер блокировки страницы на основе переданного значения (необходимо при открытии модальных окон).

**Используемые типы данных**:


IPage - интерфейс описывающий структуры данных для компонента.


### Класс, описывающий карточку товара

Класс Card предназначен для управления карточкой товара, он используется как для отображения карточек в каталоге, так и в корзине. Кроме того, класс обрабатывает действия пользователя. Card наследуется от класса Component.
Конструктор constructor(container: HTMLElement, actions?: IActions) принимает в качестве аргументов контейнер для карточки и связанные с ней действия.


**Свойства класса**:

protected titleElement: HTMLElement; - название товара;


protected priceElement: HTMLElement; - цена товара;


protected imageElement: HTMLImageElement; - изображение товара;


protected descriptionElement: HTMLElement; - описание товара;


protected buttonElement: HTMLButtonElement; - кнопка дейтсвия на карточке;


protected categoryElement: HTMLElement; - категория товара;


protected indexElement: HTMLElement; - порядковый номер товара в корзине;


protected _buttonTitle: string; - название кнопки;

**Реализуемые методы**:


set id(value: string)/get id() - сеттер и геттер идентификатора карточки;


set title(value: string)/get title() - сеттер и геттер заголовка карточки;


set price(value: number | null)/get price() - сеттер и геттер цены товара;


set category(value: string)/get category() - сеттер и геттер категории товара;


set index(value: string)/get index() - сеттер и геттер индекса товара;


set image(value: string) - сеттер изображения товара;


set description(value: string) - сеттер описания товара;


set buttonText(value: string) - сеттер текстового содержания в кнопке;


disableButton(value: number | null) - активация/деактивация кнопки в завимости от цены товара;


classByCategory(value: string): string - задает цвет для категории карточки.

**Используемые типы данных**:


ICard - интерфейс структуры данных для карточки товара;


IActions - интерфейс для действий, которые можно выполнить с карточкой товара.





### Класс, описывающий корзину товаров

Класс Basket предназначен для отображения корзины. Он используется для показа списка товаров и их общей стоимости, а также для управления выбором этих товаров. Класс наследуется от Component. 
Конструктор constructor(container: HTMLElement, events: EventEmitter) принимает контейнер и элемент для обработки событий в качестве входных параметров.


**Свойства класса**:

protected itemList: HTMLElement - список товаров в корзине;


protected totalAmount: HTMLElement - общая стоимость заказа;


protected actionButton: HTMLButtonElement - кнопка перехода к оформлению заказа.


**Реализуемые методы**:


set items(items: HTMLElement[]) - сеттер списка товаров в корзине;


set total(total: number) - сеттер общей стоимости товаров в корзине;


toggleButton(disabled: boolean) - активация/деактивация кнопки. 

**Используемые типы данных**:


IBasketView - интерфейс структуры данных, используемых для отображения корзины.


### Класс, описывающий окошко заказа товара

Класс Success предназначен для отображения интерфейсного элемента с уведомлением о том, что операция выполнена успешно. Он является наследником класса Component.
Конструктор constructor(container: HTMLElement, actions: ISuccessActions) принимает в качестве аргументов контейнер и элемент для работы с событиями

**Свойства класса**:

protected closeButton: HTMLElement; - кнокпа закрытия сообщения;


protected totalAmount: HTMLElement; - сообщение о деталях успешной операции.


**Реализуемые методы**:
set total(value: string) - сеттер собщения об итоговой стоимости операции. 

**Используемые типы данных**:

ISuccess - интерфейс структуры данных для компонента;


ISuccessActions - интерфейс действий, которые могут быть выполнены в компоненте.


### Класс, для работы с формами


Класс Form предназначен для работы с формами. Он наследует функциональность класса Component и добавляет новые возможности. Конструктор constructor(container: HTMLFormElement, events: IEvents) принимает контейнер формы и элемент для управления событиями в качестве входных параметров.

**Свойства класса**:

protected submitButton: HTMLButtonElement - кнопка отправки формы;


protected errorContainer: HTMLElement - элемент отображения ошибок валидации формы.



**Реализуемые методы**:


set valid(value: boolean) - сеттер валидности формы, изменяет состояние кнопки в зависимости от того валидная форма или нет;


set errors(value: string) - сеттер ошибок валидации формы;


render(state: Partial<T> & IFormState) - рендер состояния формы с заданными состоянием валидности, ошибками валидации и значениями полей;


onInputChange(field: keyof T, value: string) - обработчик событий ввода, который эмиттирует события изменения для каждого поля формы.

