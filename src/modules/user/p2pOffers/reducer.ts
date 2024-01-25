import { defaultStorageLimit } from 'src/api';
import { sliceArray } from 'src/helpers';
import { CommonError } from '../../types';
import { P2POfferActions } from './actions';
import {
    P2P_OFFER_CREATE,
    P2P_OFFER_CREATE_DATA,
    P2P_OFFER_CREATE_ERROR,
    P2P_OFFER_DATA,
    P2P_OFFER_ERROR,
    P2P_OFFER_FETCH,
} from './constants';
import { P2POffer } from './types';

export interface P2POffersState {
    create: {
        // data: P2POffer;
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    fetch: {
        page: number;
        total: number;
        list: P2POffer[];
        side: string;
        base: string;
        quote: string;
        payment?: [];
        fetching: boolean;
        success: boolean;
        timestamp?: number;
        error?: CommonError;
    };
}

export const initialP2POfferState: P2POffersState = {
    create: {
        // data: defaultP2POffer,
        fetching: false,
        success: false,
    },
    fetch: {
        page: 0,
        total: 0,
        list: [],
        side: '',
        base: '',
        quote: '',
        fetching: false,
        success: false,
    },
};

export const p2pOfferFetchReducer = (state: P2POffersState['fetch'], action: P2POfferActions) => {
    switch (action.type) {
        case P2P_OFFER_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case P2P_OFFER_DATA:
            return {
                ...state,
                list: sliceArray(action.payload.list, defaultStorageLimit()),
                page: action.payload.page,
                total: action.payload.total,
                side: action.payload.side,
                base: action.payload.base,
                quote: action.payload.quote,
                payment: action.payload.payment,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_OFFER_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                page: 0,
                side: '',
                total: 0,
                list: [],
                error: action.error,
            };
        default:
            return state;
    }
};

const p2pOfferCreateReducer = (state: P2POffersState['create'], action: P2POfferActions) => {
    switch (action.type) {
        case P2P_OFFER_CREATE:
            return {
                ...state,
                fetching: true,
            };
        case P2P_OFFER_CREATE_DATA:
            return {
                ...state,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_OFFER_CREATE_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export const p2pOffersReducer = (state = initialP2POfferState, action: P2POfferActions) => {
    switch (action.type) {
        case P2P_OFFER_FETCH:
        case P2P_OFFER_DATA:
        case P2P_OFFER_ERROR:
            return {
                ...state,
                fetch: p2pOfferFetchReducer({ ...state.fetch }, action),
            };
        case P2P_OFFER_CREATE:
        case P2P_OFFER_CREATE_DATA:
        case P2P_OFFER_CREATE_ERROR:
            const p2pOfferCreateState = { ...state.create };

            return {
                ...state,
                create: p2pOfferCreateReducer(p2pOfferCreateState, action),
            };

        default:
            return state;
    }
};
