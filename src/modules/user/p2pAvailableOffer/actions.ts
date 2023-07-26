import { CommonError } from '../../../modules/types';
import {
    P2P_OFFER_AVAILABLE_FETCH,
    P2P_OFFER_AVAILABLE_FETCH_DATA,
    P2P_OFFER_AVAILABLE_FETCH_ERROR,
} from './constants';

export interface P2POfferAvailableFetch {
    type: typeof P2P_OFFER_AVAILABLE_FETCH;
    payload?: {
        type: string;
        ordering: string;
        order_by: string;
    };
}

export interface P2POfferAvailableData {
    type: typeof P2P_OFFER_AVAILABLE_FETCH_DATA;
    payload: [];
}

export interface P2POfferAvailableError {
    type: typeof P2P_OFFER_AVAILABLE_FETCH_ERROR;
    error: CommonError;
}

export type P2POfferAvailableActions = P2POfferAvailableFetch | P2POfferAvailableData | P2POfferAvailableError;

export const p2pOfferAvailableFetch = (payload?: P2POfferAvailableFetch['payload']): P2POfferAvailableFetch => ({
    type: P2P_OFFER_AVAILABLE_FETCH,
    payload,
});

export const p2pOfferAvailableData = (payload: P2POfferAvailableData['payload']): P2POfferAvailableData => ({
    type: P2P_OFFER_AVAILABLE_FETCH_DATA,
    payload,
});

export const p2pOfferAvailableError = (error: CommonError): P2POfferAvailableError => ({
    type: P2P_OFFER_AVAILABLE_FETCH_ERROR,
    error,
});
