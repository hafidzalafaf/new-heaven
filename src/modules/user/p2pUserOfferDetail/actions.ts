import { CommonError } from '../../types';
import {
    P2P_USER_OFFER_DETAIL_FETCH,
    P2P_USER_OFFER_DETAIL_DATA,
    P2P_USER_OFFER_DETAIL_ERROR,
    P2P_USER_OFFER_DETAIL_CREATE,
    P2P_USER_OFFER_DETAIL_CREATE_DATA,
    P2P_USER_OFFER_DETAIL_CREATE_ERROR,
} from './constants';
import { P2PUserOfferDetail, P2PCreateUserOfferDetail } from './types';

export interface P2PUserOfferDetailFetch {
    type: typeof P2P_USER_OFFER_DETAIL_FETCH;
    payload: {
        page?: number;
        limit?: number;
        state?: string;
        from?: string;
        to?: string;
        offer_number: string;
    };
}

export interface P2PUserOfferDetailData {
    type: typeof P2P_USER_OFFER_DETAIL_DATA;
    payload: {
        list: any;
        page: number;
        total: number;
        state?: string;
        from?: string;
        to?: string;
    };
}

export interface P2PUserOfferDetailError {
    type: typeof P2P_USER_OFFER_DETAIL_ERROR;
    error: CommonError;
}

export interface P2PUserOfferDetailCreate {
    type: typeof P2P_USER_OFFER_DETAIL_CREATE;
    payload: P2PCreateUserOfferDetail;
}

export interface P2PUserOfferDetailCreateData {
    type: typeof P2P_USER_OFFER_DETAIL_CREATE_DATA;
}

export interface P2PUserOfferDetailCreateError {
    type: typeof P2P_USER_OFFER_DETAIL_CREATE_ERROR;
    error: CommonError;
}

export type P2PUserOfferDetailActions =
    | P2PUserOfferDetailFetch
    | P2PUserOfferDetailData
    | P2PUserOfferDetailError
    | P2PUserOfferDetailCreate
    | P2PUserOfferDetailCreateData
    | P2PUserOfferDetailCreateError;

export const p2pUserOfferDetailFetch = (payload?: P2PUserOfferDetailFetch['payload']): P2PUserOfferDetailFetch => ({
    type: P2P_USER_OFFER_DETAIL_FETCH,
    payload,
});

export const p2pUserOfferDetailData = (payload: P2PUserOfferDetailData['payload']): P2PUserOfferDetailData => ({
    type: P2P_USER_OFFER_DETAIL_DATA,
    payload,
});

export const p2pUserOfferDetailError = (error: CommonError): P2PUserOfferDetailError => ({
    type: P2P_USER_OFFER_DETAIL_ERROR,
    error,
});

export const p2pUserOfferDetailCreate = (payload: P2PUserOfferDetailCreate['payload']): P2PUserOfferDetailCreate => ({
    type: P2P_USER_OFFER_DETAIL_CREATE,
    payload,
});

export const p2pUserOfferDetailCreateData = (): P2PUserOfferDetailCreateData => ({
    type: P2P_USER_OFFER_DETAIL_CREATE_DATA,
});

export const p2pUserOfferDetailCreateError = (error: CommonError): P2PUserOfferDetailCreateError => ({
    type: P2P_USER_OFFER_DETAIL_CREATE_ERROR,
    error,
});
