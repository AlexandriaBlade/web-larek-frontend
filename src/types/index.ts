export type CategoryType =
  | 'другое'
  | 'софт-скил'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скил';

export interface ItemCard {
    id: string;
    category: CategoryType;
    description: string;
    title: string;
    price: number | null;
    image: string;    
  }

export  type PaymentForm =
  | 'online'
  | 'cash';  


export interface CheckoutProcess {
    items: string[];
    payment: PaymentForm;
    total: number;
	  address: string;
	  email: string;
	  phone: string;
}

export interface IAppData {
	products: ItemCard[];
  basket: ItemCard[];
  order: CheckoutProcess;
}

export type  TProduct = Omit<ItemCard, "description">

export type  TBasketProduct = Pick<ItemCard, "id" | "title" | "price">

export type IOrderForm = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>;

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface Confirmation {
  id: string; 
  total: number;
}