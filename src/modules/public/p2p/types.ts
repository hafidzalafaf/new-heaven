import { UserPaymentMethod } from 'src/modules';

export interface Payment {
    payment_user_id: number | string;
    bank_name: string;
    symbol: string;
    logo: string;
    base_color: any;
    state: string;
}

export interface FiatCurrency {
    fiat: string;
    currency: string;
}
export interface Offer {
    offer_number: string;
    available_amount: string | number;
    price: string | number;
    currency: string;
    min_order: string | number;
    max_order: string | number;
    payment_time: string | number;
    sum_order: string | number;
    persentage: string | number;
    term_of_condition: string;
    trader: any;
    payment: Payment[];
}

export interface P2PFiat {
    name: string;
    code: string;
    symbol: string;
    scale: number;
    icon: string;
}
export interface P2PCurrency {
    fiat: string;
    currency: FiatCurrency[];
    payment: Payment[];
}

export interface PaymentMethod {
    id: number;
    type: string;
    name: string;
    options?: any;
}

export interface P2PMerchantDetailInterface {
    merchant: any;
    feedbacks: any;
}
