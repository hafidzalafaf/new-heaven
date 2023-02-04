import { CommonError } from '../../../modules/types';
import {
    P2P_OFFER_FETCH,
    P2P_OFFER_DATA,
    P2P_OFFER_ERROR,
    P2P_OFFER_CREATE,
    P2P_OFFER_CREATE_DATA,
    P2P_OFFER_CREATE_ERROR,
} from './constants';
import { P2POffer } from './types';

export interface P2POfferFetch {
    type: typeof P2P_OFFER_FETCH;
    payload?: {
        offer_id: string;
    };
}

export interface P2POfferData {
    type: typeof P2P_OFFER_DATA;
    payload: [];
}

export interface P2POfferError {
    type: typeof P2P_OFFER_ERROR;
    error: CommonError;
}

export interface P2POfferCreate {
    type: typeof P2P_OFFER_CREATE;
    payload: P2POffer;
}

export interface P2POfferCreateData {
    type: typeof P2P_OFFER_CREATE_DATA;
}

export interface P2POfferCreateError {
    type: typeof P2P_OFFER_CREATE_ERROR;
    error: CommonError;
}

export type P2POfferActions =
    | P2POfferFetch
    | P2POfferData
    | P2POfferError
    | P2POfferCreate
    | P2POfferCreateData
    | P2POfferCreateError;

export const p2pOfferFetch = (payload?: P2POfferFetch['payload']): P2POfferFetch => ({
    type: P2P_OFFER_FETCH,
    payload,
});

export const p2pOfferData = (payload: P2POfferData['payload']): P2POfferData => ({
    type: P2P_OFFER_DATA,
    payload,
});

export const p2pOfferError = (error: CommonError): P2POfferError => ({
    type: P2P_OFFER_ERROR,
    error,
});

export const p2pOfferCreate = (payload: P2POfferCreate['payload']): P2POfferCreate => ({
    type: P2P_OFFER_CREATE,
    payload,
});

export const p2pOfferCreateData = (): P2POfferCreateData => ({
    type: P2P_OFFER_CREATE_DATA,
});

export const p2pOfferCreateError = (error: CommonError): P2POfferCreateError => ({
    type: P2P_OFFER_CREATE_ERROR,
    error,
});
