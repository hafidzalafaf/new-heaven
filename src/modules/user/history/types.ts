import { CommonState } from '../../types';

export interface PublicTrade {
    id: number;
    price: string;
    total?: string;
    amount: string;
    market: string;
    created_at: string;
    taker_type: string;
    price_change?: string;
    fee_currency?: string;
}

export interface PrivateTrade extends PublicTrade {
    side?: string;
    order_id?: number;
    fee_currency?: string;
}

export interface PrivateTradeEvent {
    id: number;
    price: string;
    total: string;
    amount: string;
    currency: string;
    created_at: string;
    taker_type: string;
    side?: string;
    order_id?: number;
    fee_currency?: string;
    market?: string;
}

export interface PrivateTradesState extends CommonState {
    list: PrivateTrade[];
}

export type MakerType = 'buy' | 'sell';

export interface Withdraw {
    currency: string;
    id: number;
    type: string;
    amount: string;
    fee: string;
    blockchain_txid: string;
    blockchain_key: string;
    rid: string;
    status: string;
    created_at: string;
    updated_at: string;
    completed_at: string;
    done_at: string;
    price?: number;
    fee_currency?: string;
    market?: string;
}

export interface Deposit {
    currency: string;
    id: number;
    amount: string;
    blockchain_key: string;
    fee: string;
    txid: string;
    created_at: string;
    confirmations: number | string;
    completed_at: string;
    state: string;
    price?: number;
    fee_currency?: string;
    market?: string;
}

export type WalletHistoryElement = Withdraw | Deposit | PrivateTrade;
export type WalletHistoryList = WalletHistoryElement[];
