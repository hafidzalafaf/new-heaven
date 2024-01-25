import { P2PPublicPayment } from 'src/modules/public/p2p';

export interface P2PUserOfferList {
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
    state: string;
}
export interface P2PUserOffer {
    list: [
        {
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
            state: string;
        }
    ];
    nextPageExists?: boolean;
    page: number;
}

export interface P2PCreateUserOffer {
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
}
