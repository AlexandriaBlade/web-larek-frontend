import './scss/styles.scss';

import {WebLarekAPI} from "./components/WebLarekAPI";
import {API_URL, CDN_URL, PaymentMethods} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState, CatalogChangeEvent, Product} from "./components/AppData";
import {Page} from "./components/Page";
import {cloneTemplate, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {IContact, IDelivery, IOrder} from "./types";
import { Card } from './components/Card';
import { Basket } from './components/Basket';
import { Delivery} from './components/Delivery';
import { Contact } from './components/Contact';
import { Success } from './components/Success';

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const delivery = new Delivery(cloneTemplate(deliveryTemplate), events, {
  onClick: (ev: Event) => events.emit('payment:toggle', ev.target)
});
const contact = new Contact(cloneTemplate(contactTemplate), events);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
      const card = new Card(cloneTemplate(cardCatalogTemplate), {
        onClick: () => events.emit('card:select', item)
      });
      return card.render({
        title: item.title,
        image: item.image,
        price: item.price,
        category: item.category
      })
    })
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
    })
})
  
// Отправлена форма заказа
events.on('contacts:submit', () => {
    api.orderProducts(appData.order)
      .then((result) => {
        appData.clearBasket();
        appData.clearOrder();
        const success = new Success(cloneTemplate(successTemplate), {
            onClick: () => {
                modal.close();
            }
        });
        success.total = result.total.toString();
        modal.render({
            content: success.render({})
        });
      })
      .catch(error => {
          console.log(error);
      });
})

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrder>) => {
    const {payment, address ,email, phone} = errors;
    delivery.valid = !payment && !address;
    contact.valid = !email && !phone;
    delivery.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
    contact.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
  });
  

// Изменилось одно из полей
events.on(/^order\..*:change/, (data: {field: keyof IDelivery, value: string}) => {
    appData.setDeliveryField(data.field, data.value)
})

events.on(/^contacts\..*:change/, (data: {field: keyof IContact, value: string}) => {
    appData.setContactField(data.field, data.value)
})

// Открыть форму заказа  
events.on('order:open', () => {
    modal.render({
      content: delivery.render({
        payment: '',
        address: '',
        valid: false,
        errors:[]
      })
    })
    appData.order.items = appData.basket.map((item) => item.id);
})

events.on('preview:changed', (item: Product) => {
    const card = new Card(cloneTemplate(cardPreviewTemplate), {
      onClick: () => {
        events.emit('product:toggle', item);
        card.buttonTitle = (appData.basket.indexOf(item) < 0) ? 'Купить' : 'Удалить из корзины'
      }
    });
    modal.render({
      content: card.render({
        title: item.title,
        description: item.description,
        image: item.image,
        price: item.price,
        category: item.category,
        buttonTitle: (appData.basket.indexOf(item) < 0) ? 'Купить' : "Удалить из корзины"
      })
    })
})

// Открытие карточки товара
events.on('card:select', (item: Product) => {
    appData.setPreview(item);
})

// Изменение счетчика товаров
events.on('product:add', (item: Product) => {
    appData.addToBasket(item);
  
})

events.on('product:delete', (item: Product) => {
    appData.removeFromBasket(item)
})

events.on('product:toggle', (item: Product) => {
    if(appData.basket.indexOf(item) < 0){
      events.emit('product:add', item);
    }
    else{
      events.emit('product:delete', item);
    }
})

// Изменение состояния корзины
events.on('basket:changed', (items: Product[]) => {
    basket.items = items.map((item, index) => {
      const card = new Card(cloneTemplate(cardBasketTemplate), {
        onClick: () => {
          events.emit('product:delete', item)
        }
      });
      return card.render({
        index: (index+1).toString(),
        title: item.title,
        price: item.price,
      })
    })
    const total = items.reduce((total, item) => total + item.price, 0)
    basket.total = total
    appData.order.total = total;
    const disabled = total===0;
    basket.toggleButton(disabled)
})

// Открытие корзины
events.on('basket:open', () => {
    modal.render({
      content: basket.render({})
    })
})
  

events.on('counter:changed', (event: string[]) => {
    page.counter = appData.basket.length;
})

// Изменен способ оплаты
events.on('payment:toggle', (target: HTMLElement) => {
    if(!target.classList.contains('button_alt-active')){
      delivery.toggleButtons();
      appData.order.payment = PaymentMethods[target.getAttribute('name')];
    }
})

// Заполнена форма доставки
events.on('delivery:ready' , () => {
    delivery.valid = true;
})
  
// Заполнена форма данных о контакте
events.on('contact:ready', () => {
    contact.valid = true;
})

// Открыто модадльное окно
events.on('modal:open', () => {
    page.locked = true;
})
  
// Закрыто модальное окно
events.on('modal:close', () => {
    page.locked = false;
})
  
// Загрузка каталога товаров при открытии страницы
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(error => {
        console.log(error);
});
  