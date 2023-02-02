import { CommonError } from '../../types';
import {
    P2P_ACCOUNT_FETCH,
    P2P_ACCOUNT_FETCH_DATA,
    P2P_ACCOUNT_FETCH_ERROR,
} from './constants';

export interface P2PAccountFetch {
    type: typeof P2P_ACCOUNT_FETCH;
    payload?: {
        type: string;
        ordering: string;
        order_by: string;
    };
}

export interface P2PAccountData {
    type: typeof P2P_ACCOUNT_FETCH_DATA;
    payload: [];
}

export interface P2PAccountError {
    type: typeof P2P_ACCOUNT_FETCH_ERROR;
    error: CommonError;
}

export type P2PAccountActions = P2PAccountFetch | P2PAccountData | P2PAccountError;

export const p2pAccountFetch = (payload?: P2PAccountFetch['payload']): P2PAccountFetch => ({
    type: P2P_ACCOUNT_FETCH,
    payload,
});

export const p2pAccountData = (payload: P2PAccountData['payload']): P2PAccountData => ({
    type: P2P_ACCOUNT_FETCH_DATA,
    payload,
});

export const p2pAccountError = (error: CommonError): P2PAccountError => ({
    type: P2P_ACCOUNT_FETCH_ERROR,
    error,
});
