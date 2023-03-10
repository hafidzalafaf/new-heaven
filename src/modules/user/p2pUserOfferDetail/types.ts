import { Payment } from "src/modules/public/p2p";

export interface P2PUserOfferDetail {
    offer: {
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
        side: string;
    }
    order: [];
}

export interface P2PCreateUserOfferDetail {
    currency: string | any;
    price: string;
    fiat: string;
    trade_amount: string;
    min_order: string;
    max_order: string;
    payment: any[];
    payment_limit: string;
    term_of_condition: string;
    auto_replay: string;
    side: string;
    order: []
}