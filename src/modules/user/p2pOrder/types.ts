export interface Order {
    offer_number: string;
    price: string;
    amount: string;
    payment_order?: string;
}

export interface Confirm {
    payment_method: string;
    is_confirm: string;
}
