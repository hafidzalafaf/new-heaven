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
    banned_state: boolean;
    logo: string;
    member: {
        email: string;
        uid: string;
        group: string;
    };
    offer: number;
    feedback: {
        negative: number;
        positive: number;
        total: number;
    };
    success_rate: number;
    trade: {
        completed_rate: string;
        mount_trade: number;
        pay_time: string;
        release_time: string;
        total: number;
    };
    trader_name: string;
}

// import { UserPaymentMethod } from "src/modules";

// export interface Offer {
//     id: number;
//     price: string | number;
//     available_amount: string | number;
//     origin_amount: string | number;
//     min_order_amount: string | number;
//     max_order_amount: string | number;
//     base: string;
//     quote: string;
//     state: string;
//     side: string;
//     created_at: string;
//     time_limit: number;
//     description?: string;
//     payment_methods: UserPaymentMethod[];
//     uid: string;
//     user: {
//         user_nickname: string;
//         offers_count: string | number;
//         success_rate: string | number;
//         user_uid: string;
//     };
//     orders_count?: number;
// }

// export interface P2PCurrency {
//     id: string;
//     type: string;
//     enabled: boolean;
// }

// export interface PaymentMethod {
//     id: number;
//     type: string;
//     name: string;
//     options?: any;
// }
