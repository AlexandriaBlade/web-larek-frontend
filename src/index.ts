import './scss/styles.scss';

// Импорт необходимых модулей и компонентов
import { WebLarekAPI } from "./components/WebLarekAPI";
import { API_URL, CDN_URL, PaymentMethods } from "./utils/constants";
import { EventEmitter } from "./components/base/events";
import { AppState, CatalogChangeEvent, Product } from "./components/AppData";
import { Page } from "./components/Page";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { Modal } from "./components/common/Modal";
import { IContact, IDelivery, IOrder } from "./types";
import { Card } from './components/Card';
import { Basket } from './components/common/Basket';
import { Delivery } from './components/Delivery';
import { Contact } from './components/Contact';
import { Success } from './components/common/Success';

// Создание экземпляров для работы с событиями и API
const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Все шаблоны
const templates = {
  cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
  cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
  basket: ensureElement<HTMLTemplateElement>('#basket'),
  cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
  delivery: ensureElement<HTMLTemplateElement>('#order'),
  contact: ensureElement<HTMLTemplateElement>('#contacts'),
  success: ensureElement<HTMLTemplateElement>('#success'),
};

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры для страниц и модальных окон
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые интерфейсы
const basket = new Basket(cloneTemplate(templates.basket), events);
const delivery = new Delivery(cloneTemplate(templates.delivery), events, {
  onClick: (ev: Event) => events.emit('payment:toggle', ev.target)
});
const contact = new Contact(cloneTemplate(templates.contact), events);

// Подписка на события

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
      const card = new Card(cloneTemplate(templates.cardCatalog), {
        onClick: () => events.emit('card:select', item) // Передача события выбора карточки товара
      });
      return card.render({
        title: item.title,
        image: item.image,
        price: item.price,
        category: item.category
      });
    });
});

// Событие перехода к форме контактов
events.on('order:submit', () => {
    modal.render({
      content: contact.render({
        email: '',
        phone: '',
        valid: false,
        errors: []
      })
    });
});
  
// Отправлена форма заказа
events.on('contacts:submit', () => {
    api.orderProducts(appData.order)
      .then((result) => {
        appData.clearBasket(); // Очистка корзины
        appData.clearOrder();  // Очистка заказа
        const success = new Success(cloneTemplate(templates.success), {
            onClick: () => {
                modal.close(); // Закрытие модального окна
            }
        });
        success.total = result.total.toString(); // Установка итоговой стоимости
        modal.render({
            content: success.render({})
        });
      })
      .catch(error => {
          console.error(error);
      });
});

// Обработка изменений состояния валидации формы
events.on('formErrors:change', (errors: Partial<IOrder>) => {
    const { payment, address, email, phone } = errors;
    delivery.valid = !payment && !address;
    contact.valid = !email && !phone;
    delivery.errors = Object.values({ payment, address }).filter(Boolean).join('; ');
    contact.errors = Object.values({ phone, email }).filter(Boolean).join('; ');
});

// Изменение одного из полей доставки или контактов
events.on(/^order\..*:change/, (data: { field: keyof IDelivery, value: string }) => {
    appData.setDeliveryField(data.field, data.value);
});

events.on(/^contacts\..*:change/, (data: { field: keyof IContact, value: string }) => {
    appData.setContactField(data.field, data.value);
});

// Открытие формы заказа
events.on('order:open', () => {
    modal.render({
      content: delivery.render({
        payment: '',
        address: '',
        valid: false,
        errors: []
      })
    });
    appData.order.items = appData.basket.map((item) => item.id);
});

// Изменение просмотра карточки товара
events.on('preview:changed', (item: Product) => {
    const card = new Card(cloneTemplate(templates.cardPreview), {
      onClick: () => {
        events.emit('product:toggle', item); // Включение/выключение товара
        card.buttonTitle = appData.basket.includes(item) ? 'Удалить из корзины' : 'Купить';
      }
    });
    modal.render({
      content: card.render({
        title: item.title,
        description: item.description,
        image: item.image,
        price: item.price,
        category: item.category,
        buttonTitle: appData.basket.includes(item) ? 'Удалить из корзины' : 'Купить'
      })
    });
});

// Открытие карточки товара
events.on('card:select', (item: Product) => {
    appData.setPreview(item); // Установка карточки товара для просмотра
});

// Управление корзиной
events.on('product:add', (item: Product) => {
    appData.addToBasket(item); // Добавление товара в корзину
});

events.on('product:delete', (item: Product) => {
    appData.removeFromBasket(item); // Удаление товара из корзины
});

events.on('product:toggle', (item: Product) => {
    const action = appData.basket.includes(item) ? 'delete' : 'add'; // Определение действия
    events.emit(`product:${action}`, item); // Отправка соответствующего события
});

// Изменение состояния корзины
events.on('basket:changed', (items: Product[]) => {
    basket.items = items.map((item, index) => {
      const card = new Card(cloneTemplate(templates.cardBasket), {
        onClick: () => {
          events.emit('product:delete', item); // Удаление товара из корзины при клике
        }
      });
      return card.render({
        index: (index + 1).toString(),
        title: item.title,
        price: item.price,
      });
    });
    const total = items.reduce((total, item) => total + item.price, 0); // Расчет общей стоимости
    basket.total = total;
    appData.order.total = total;
    const disabled = total === 0; // Условие для отключения кнопки
    basket.toggleButton(disabled);
});

// Открытие корзины
events.on('basket:open', () => {
    modal.render({
      content: basket.render({})
    });
});

// Изменение счетчика товаров в корзине
events.on('counter:changed', () => {
    page.counter = appData.basket.length; // Обновление счетчика
});

// Изменение способа оплаты
events.on('payment:toggle', (target: HTMLElement) => {
    if (!target.classList.contains('button_alt-active')) {
        delivery.toggleButtons();
        appData.order.payment = PaymentMethods[target.getAttribute('name')]; // Установка способа оплаты
    }
});

// Заполнение форм
events.on('delivery:ready', () => {
    delivery.valid = true; // Установка флага валидации
});

events.on('contact:ready', () => {
    contact.valid = true; // Установка флага валидации
});

// Открытие и закрытие модального окна
events.on('modal:open', () => {
    page.locked = true; // Блокировка страницы при открытии модального окна
});

events.on('modal:close', () => {
    page.locked = false; // Разблокировка страницы при закрытии модального окна
});

// Загрузка каталога товаров при открытии страницы
api.getProductList()
    .then(appData.setCatalog.bind(appData)) // Установка каталога товаров в модель данных
    .catch(error => {
        console.error(error); // Обработка ошибок
    });