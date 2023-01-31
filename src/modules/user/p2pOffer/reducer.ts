import { CommonError } from '../../../modules/types';
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

const defaultP2POffer: P2POffer = {
    currency: '',
    price: '',
    fiat: '',
    trade_amount: '',
    min_amount: '',
    max_amount: '',
    payment: [],
    paymen_limit: '',
    term_of_condition: '',
    auto_replay: '',
    side: '',
};

export interface P2POfferState {
    create: {
        data: P2POffer;
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    fetch: {
        data: P2POffer[];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
}

export const initialP2POfferState: P2POfferState = {
    create: {
        data: defaultP2POffer,
        fetching: false,
        success: false,
    },
    fetch: {
        data: [],
        fetching: false,
        success: false,
    },
};

export const p2pOfferFetchReducer = (state: P2POfferState['fetch'], action: P2POfferActions) => {
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
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_OFFER_ERROR:
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

const p2pOfferCreateReducer = (state: P2POfferState['create'], action: P2POfferActions) => {
    switch (action.type) {
        case P2P_OFFER_CREATE:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case P2P_OFFER_CREATE_DATA:
            return {
                ...state,
                data: action.payload,
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

export const p2pOfferReducer = (state = initialP2POfferState, action: P2POfferActions) => {
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
