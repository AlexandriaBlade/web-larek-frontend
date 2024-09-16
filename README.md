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


**Архитектура приложения**



Взаимодействия внутри приложения происходят через события. Модели инициализируют события, слушатели событий в основном коде выполняют передачу данных компонентам отображения, а также вычислениями между этой передачей, и еще они меняют значения в моделях.





Код приложения разделен на слои согласно парадигме MVP:


- слой представления(Viev), отвечает за отображение данных на странице

- слой данных, отвечает за хранение и изменение данных(Modal)

- презентер(Presenter), отвечает за связь представления и данных.



**Базовый код**


**Класс Api**

Класс API обеспечивает работу с данными с сервера. Он отвечает за отправку HTTP-запросов и обработку ответов от сервера. Класс API содержит методы для выполнения GET и POST запросов к указанному URI.


`constructor(baseUrl: string, options: RequestInit = {})` - принимает базовый URL и глобальные опции для всех запросов(опционально).


*Свойства*: 

- readonly baseUrl: string - основной URL для отправки запросов к API;

- protected options: RequestInit - базовые настройки запросов.


*Реализуемые методы*:

- get<T>(uri: string): ApiResponse<T> - выполняет GET запросы к указанному URI, возвращает промис с типизированным ответом от сервера;

- post<T>(uri: string, data: object, method: ApiPostMethods): ApiResponse<T> - выполняет POST запросы с данными по указанному URI, возвращает промис с типизированным ответом от сервера

- handleResponse — это функция, которая обрабатывает ответ сервера после выполнения запроса. Она часто используется для обработки успешных и ошибочных ответов, обработки данных и передачи их в приложение.


*Используемые типы данных*:

- ApiPostMethods - тип данных, описывающий допустимые методы HTTP-запросов для POST-запросов;

- ApiResponse<T> - обобщенный тип данных для ответов API.




**Класс WebLarekApi**


Этот класс наследует функциональность от базового класса Api и реализует интерфейс IWebLarekAPI.


`constructor(cdn: string, baseUrl: string, options?: RequestInit)` - конструктор, на вход принимает базовый URL для API и CDN для изображений.


*Свойства класса*:

readonly cdn: string - URL для загрузки изображений товаров; 

*Реализуемые методы*:


- getProductList(): Promise<IProduct[]> - получает весь список продуктов с сервера;


- getProductItem(id: string): Promise<IProduct> - получает информации об одном продукте по его id;


- orderProducts(order: IOrder): Promise<IOrderResult> - отправляет информацию о заказе на сервер и получает результат.


*Используемые типы данных*:


- IProduct - интерфейс данных товара;


- IOrder - интерфейс структуры данных заказа;


- IOrderResult - интерфейс структуры данных результата заказа;


- ApiListResponse<T> - обобщенный тип для ответа списка элементов от API;


- IWebLarekAPI - интерфейс, описывающий методы WebLarekAPI.




**Класс EventEmitter**


Класс EventEmitter представляет собой брокер событий, позволяющий устанавливать и удалять слушателей событий, а также вызывать этих слушателей при возникновении событий. Он содержит методы для установки обработчика на событие (on), удаления обработчика события (off), инициирования события (emit), а также другие методы для работы с событиями.


`constructor()` - конструктор.


*Свойства класса*:


_events: Map<EventName, Set<Subscriber>> - приватное свойство, хранящее множество подписчиков для каждого события.


*Реализуемые методы*:

- on<T extends object>(eventName: EventName, callback: (event: T) => void) - устанавливает обработчик на событие;


- off(eventName: EventName, callback: Subscriber) - снимает обработчик с события;


- emit<T extends object>(eventName: string, data?: T) - иницирует событие с указанным именем и данными;


- onAll(callback: (event: EmitterEvent) => void) - используется, чтобы слушать все события;


- offAll() - сбрасывает все обработчики событий;


- trigger<T extends object>(eventName: string, context?: Partial<T>) - делает коллбек триггер, генерирующий событие при вызове.


*Используемые типы данных*:


- EventName - имя события;


- Subscriber - тип функции-обработчика события;


- IEvents - интерфейс для управления событиями.





**Класс Component**


Класс Component представляет собой базовый компонент, обеспечивающий работу с DOM-элементами.


 Он позволяет :

- отображать/скрывать элементы


- изменять атрибуты элемента 


- добавлять/удалять классы элементов


`protected constructor(container: HTMLElement)` - конструктор, на вход принимает контейнер, в котором необходимо создать элемент отображения.


*Реализуемые методы*:


- toggleClass(element: HTMLElement, className: string, force?: boolean) - переключает класс у элемента;


- protected setText(element: HTMLElement, value: unknown) - устанавливает текстовое содержимое элемента;


- setDisabled(element: HTMLElement, state: boolean) - устанавливает или удаляет атрибут disabled;


- protected setHidden(element: HTMLElement) - cкрывает элемент;


- protected setVisible(element: HTMLElement) - делает элемент видимым;


- protected setImage(element: HTMLImageElement, src: string, alt?: string) - yстанавливает изображение и альтернативный текст для него;


- render(data?: Partial<T>) - рендер компонента.


*Используемые типы данных*:


- T - oбобщенный тип данных.




**Класс Model**


Класс Model является абстрактным классом, предназначенным для работы с данными. Он используется как для представления, так и для работы с данными. Класс Model содержит методы для сообщения об изменениях модели, такие как emitChanges, которые сообщают всем об изменении модели.


`constructor(data:Partial<T>, events: IEvents)` - конструктор, на вход принимает исходные данные для модели и объект событий для сообщения об изменениях модели.


*Реализуемые методы*:


- emitChanges(event: string, payload?: object) - сообщает всем об изменении модели. 


*Используемые типы данных*:


- IEvents - интерфейс для работы с событиями;


- T - обобщенный тип данных, представляющий структуру данных модели.




**Классы для работы с данными**

Эти классы содержат информацию о заказе, корзине и карточке товара, полученную с сервера, так же они обеспечивают возможность отображения и обработки этих данных.




**Класс AppState**


Класс AppState играет ключевую роль в проекте "Веб-ларек" и является основной моделью данных для всего приложения. Он содержит информацию о каталоге продуктов, данных о заказе и ошибках валидации форм доставки и контакта.

AppState расширяет базовый класс Model, что позволяет использовать его функциональность для работы с данными. Класс имеет конструктор, который принимает исходное состояние приложения, представленное в виде объекта типа IAppState


`constructor(data: IAppState)` - конструктор, на вход принимает исходное состояние приложения.


*Свойства* :


- catalog: Product[] - массив товаров в каталоге;


- basket: Product[] - массив товаров в корзине;


- order: IOrder - данные о заказе;


- preview: string | null - товар для предпросмотра;


- formErrors: FormErrors - ошибки форм.


*Реализуемые методы*:


- clearBasket() - очистка корзины и генерация соответствующего события;


- addToBasket(item: Product) - добавление товара в корзину;


- removeFromBasket(item: Product)- удаление товара из корзины;


- updateBasket() - обновление состояния корзины;


- setCatalog(items: IProduct[]) - заполнение каталога товаров;


- setPreview(item: Product) - установка товара для предпросмотра;


- clearOrder() - очистка данных заказа;


- setDeliveryField(field: keyof IDelivery, value: string) - заполнение полей формы доставки;


- setContactField(field: keyof IContact, value: string) - заполнение полей формы контакта. 


*Используемые типы данных*:


- IAppState - интерфейс с общим состоянием приложения. Включает в себя поля каталога товаров, корзины, текущего заказа, предпросмотра товара и ошибок форм;


- IOrder - интерфейс структуры заказа. Включает в себя информацию о способе оплаты, адресе доставки, электронной почте, номере телефона, общей стоимости и списка заказанных товаров; IDelivery - интерфейс для определения полей формы заказа, связанные с данными о доставке; 



- FormErrors - интерфейс структуры хранения ошибок валидации форм; 



- IContact - интерфейс формы контактных данных; 


- IProduct - интерфейс данных товара.




**Класс Product**


Класс Product предназначен для хранения информации о продукте. Этот класс наследует конструктор и методы от класса Model.


`constructor(data: IProduct)` - конструктор, на вход принимает данные продукта согласно интефейсу IProduct.


*Свойства*:


- id: string - идентификатор продукта;


- title: string - название товара;


- price: number | null - цена товара;


- description: string - описание товара;


- category: string - категория товара.


- image: string - изображение проудкта. 


*Используемые типы данных*:


- IProduct - интерфейс данных товара.




**Классы отображения**


В данных классах происходит заполнение информации HTML-элементов и установка обработчиков событий на эти элементы с применением EventEmitter.




**Класс, описывающий главную страницу**


Класс Page предназначен для отображения и управления всеми элементами на странице, такими как каталог товаров и количество товаров в корзине.
Он наследуется от класса Component.


`constructor(container: HTMLElement, events: IEvents)` - конструктор, на вход принимает контейнер страницы и объект для управления событиями.


*Свойства класса*:


- protected _counter: HTMLElement; - счетчик корзины;


- protected _catalog: HTMLElement; - каталог товаров;


- protected _wrapper: HTMLElement; - обертка страницы;


- protected _basket: HTMLElement; - корзина товаров. 


*Реализуемые методы*:


- set counter(value: number) - сеттер количества товаров в корзине;


- set catalog(items: HTMLElement[]) - сеттер каталога товаров на основе переданного массива;


- set locked(value: boolean) - сеттер блокировки страницы на основе переданного значения (необходимо при открытии модальных окон).


*Используемые типы данных*:


- IPage - интерфейс описывающий структуры данных для компонента.




**Класс, описывающий карточку товара**


Класс Card предназначен для управления карточкой товара, он используется как для отображения карточек в каталоге, так и в корзине. Кроме того, класс обрабатывает действия пользователя. Card наследуется от класса Component.


`constructor(container: HTMLElement, actions?: IActions)` - конструктор, на вход принимает контейнер карточки и действия, которые связаны с ней.


*Свойства класса*:


- protected titleElement: HTMLElement; - название товара;


- protected priceElement: HTMLElement; - цена товара;


- protected imageElement: HTMLImageElement; - изображение товара;


- protected descriptionElement: HTMLElement; - описание товара;


- protected buttonElement: HTMLButtonElement; - кнопка дейтсвия на карточке;


- protected categoryElement: HTMLElement; - категория товара;


- protected indexElement: HTMLElement; - порядковый номер товара в корзине;


- protected _buttonTitle: string; - название кнопки;



*Реализуемые методы*:


- set id(value: string)/get id() - сеттер и геттер идентификатора карточки;


- set title(value: string)/get title() - сеттер и геттер заголовка карточки;


- set price(value: number | null)/get price() - сеттер и геттер цены товара;


- set category(value: string)/get category() - сеттер и геттер категории товара;


- set index(value: string)/get index() - сеттер и геттер индекса товара;


- set image(value: string) - сеттер изображения товара;


- set description(value: string) - сеттер описания товара;


- set buttonText(value: string) - сеттер текстового содержания в кнопке;


- disableButton(value: number | null) - активация/деактивация кнопки в завимости от цены товара;


- classByCategory(value: string): string - задает цвет для категории карточки.


*Используемые типы данных*:


- ICard - интерфейс структуры данных для карточки товара;


- IActions - интерфейс для действий, которые можно выполнить с карточкой товара.




**Класс, описывающий корзину товаров**


Класс Basket предназначен для отображения корзины. Он используется для показа списка товаров и их общей стоимости, а также для управления выбором этих товаров. Класс наследуется от Component. 


Конструктор `constructor(container: HTMLElement, events: EventEmitter)` принимает контейнер и элемент для обработки событий в качестве входных параметров.


*Свойства класса*:



- protected _list: HTMLElement - список товаров в корзине;


- protected _total: HTMLElement - общая стоимость заказа;


- protected _button: HTMLButtonElement - кнопка перехода к оформлению заказа.


*Реализуемые методы*:


- set items(items: HTMLElement[]) - сеттер списка товаров в корзине;


- set total(total: number) - сеттер общей стоимости товаров в корзине;


- toggleButton(disabled: boolean) - активация/деактивация кнопки. 


*Используемые типы данных*:


- IBasketView - интерфейс структуры данных, используемых для отображения корзины.




**Класс, описывающий окошко заказа товара**


Класс Success предназначен для отображения интерфейсного элемента с уведомлением о том, что операция выполнена успешно. Он является наследником класса Component.


Конструктор `constructor(container: HTMLElement, actions: ISuccessActions)` принимает в качестве аргументов контейнер и элемент для работы с событиями


*Свойства класса*:


- protected _close: HTMLElement; - кнокпа закрытия сообщения;


- protected _total: HTMLElement; - сообщение о деталях успешной операции.


*Реализуемые методы*:


- set total(value: string) - сеттер собщения об итоговой стоимости операции. 


*Используемые типы данных*:


- ISuccess - интерфейс структуры данных для компонента;


- ISuccessActions - интерфейс действий, которые могут быть выполнены в компоненте.




**Класс, для работы с формами**


Класс Form предназначен для работы с формами. Он наследует функциональность класса Component и добавляет новые возможности. 


Конструктор `constructor(container: HTMLFormElement, events: IEvents)` принимает контейнер формы и элемент для управления событиями в качестве входных параметров.


*Свойства класса*:



- protected submitButton: HTMLButtonElement - кнопка отправки формы;


- protected errorContainer: HTMLElement - элемент отображения ошибок валидации формы.



*Реализуемые методы*:


- set valid(value: boolean) - сеттер валидности формы, изменяет состояние кнопки в зависимости от того валидная форма или нет;


- set errors(value: string) - сеттер ошибок валидации формы;


- render(state: Partial<T> & IFormState) - рендер состояния формы с заданными состоянием валидности, ошибками валидации и значениями полей;


- onInputChange(field: keyof T, value: string) - обработчик событий ввода, который эмиттирует события изменения для каждого поля формы.


*Используемые типы данных*:

- IFormState - тип данных состояния формы;


- T - обобщенный тип данных.




**класс для работы с модальными окнами**


Класс Modal - класс для работы с модальными окнами.
Наследуется от класса Component и расширяет его функциональность.


`constructor(container: HTMLElement, events: IEvents)` - конструктор,  настраивает функциональность модального окна: привязывает элементы управления и добавляет необходимые обработчики событий для корректного поведения окна.


*Свойства класса*:


- protected _closeButton: HTMLButtonElement - кнопка для закрытия модального окна;


- protected _content: HTMLElement - содержимое модального окна. 


*Реализуемые методы*:


- set content(value: HTMLElement) - сеттер содержимого модального окна;

- open() - открытие модального окна и инициализация сответствующего события;


- close() - закрытие модального окна и инициализация соответствующего события;


- render(data: IModalData) - рендер модального окна.


*Используемые типы данных*:


- IPage - интерфейс описывающий структуры данных для компонента.
