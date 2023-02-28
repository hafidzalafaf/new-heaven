import { CommonError } from '../../types';
import {
    P2P_USER_OFFER_FETCH,
    P2P_USER_OFFER_DATA,
    P2P_USER_OFFER_ERROR,
    P2P_USER_OFFER_CREATE,
    P2P_USER_OFFER_CREATE_DATA,
    P2P_USER_OFFER_CREATE_ERROR,
} from './constants';
import { P2PUserOffer, P2PCreateUserOffer } from './types';

export interface P2PUserOfferFetch {
    type: typeof P2P_USER_OFFER_FETCH;
    payload: {
        page?: number;
        limit?: number;
        side?: string;
        fiat?: string;
        currency?: string;
        sort?: string;
        base?: string;
        quote?: string;
        payment_method?: number;
        amount?: string;
        max_amount?: string;
        min_price?: string;
        max_price?: string;
    };
}

export interface P2PUserOfferData {
    type: typeof P2P_USER_OFFER_DATA;
    payload: {
        list: [];
        page: number;
        total: number;
        side: string;
        sort?: string;
        base: string;
        quote: string;
        payment_method?: number;
    }
}

export interface P2PUserOfferError {
    type: typeof P2P_USER_OFFER_ERROR;
    error: CommonError;
}

export interface P2PUserOfferCreate {
    type: typeof P2P_USER_OFFER_CREATE;
    payload: P2PCreateUserOffer;
}

export interface P2PUserOfferCreateData {
    type: typeof P2P_USER_OFFER_CREATE_DATA;
}

export interface P2PUserOfferCreateError {
    type: typeof P2P_USER_OFFER_CREATE_ERROR;
    error: CommonError;
}

export type P2PUserOfferActions =
    | P2PUserOfferFetch
    | P2PUserOfferData
    | P2PUserOfferError
    | P2PUserOfferCreate
    | P2PUserOfferCreateData
    | P2PUserOfferCreateError;

export const p2pUserOfferFetch = (payload?: P2PUserOfferFetch['payload']): P2PUserOfferFetch => ({
    type: P2P_USER_OFFER_FETCH,
    payload,
});

export const p2pUserOfferData = (payload: P2PUserOfferData['payload']): P2PUserOfferData => ({
    type: P2P_USER_OFFER_DATA,
    payload,
});

export const p2pUserOfferError = (error: CommonError): P2PUserOfferError => ({
    type: P2P_USER_OFFER_ERROR,
    error,
});

export const p2pUserOfferCreate = (payload: P2PUserOfferCreate['payload']): P2PUserOfferCreate => ({
    type: P2P_USER_OFFER_CREATE,
    payload,
});

export const p2pUserOfferCreateData = (): P2PUserOfferCreateData => ({
    type: P2P_USER_OFFER_CREATE_DATA,
});

export const p2pUserOfferCreateError = (error: CommonError): P2PUserOfferCreateError => ({
    type: P2P_USER_OFFER_CREATE_ERROR,
    error,
});
