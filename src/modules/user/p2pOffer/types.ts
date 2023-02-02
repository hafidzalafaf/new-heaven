export interface P2POffer {
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
