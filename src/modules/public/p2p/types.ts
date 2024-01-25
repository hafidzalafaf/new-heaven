export interface P2PPublicPayment {
    payment_user_id: number | string;
    bank_name: string;
    symbol: string;
    logo: string;
    base_color: any;
    state: string;
}

export interface P2PPublicFiatCurrency {
    fiat: string;
    currency: string;
}
export interface P2PPublicOffer {
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
    payment: P2PPublicPayment[];
}

export interface P2PPublicFiat {
    name: string;
    code: string;
    symbol: string;
    scale: number;
    icon: string;
}
export interface P2PPublicCurrency {
    fiat: string;
    currency: P2PPublicFiatCurrency[];
    payment: P2PPublicPayment[];
}

export interface P2PPublicPaymentMethod {
    id: number;
    type: string;
    name: string;
    options?: any;
}

export interface P2PPublicMerchantDetailInterface {
    merchant: any;
    feedbacks: any;
}
