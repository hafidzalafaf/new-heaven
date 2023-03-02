import { defaultStorageLimit } from 'src/api';
import { sliceArray } from 'src/helpers';
import { CommonError } from '../../types';
import { P2PUserOfferDetailActions } from './actions';
import {
    P2P_USER_OFFER_DETAIL_CREATE,
    P2P_USER_OFFER_DETAIL_CREATE_DATA,
    P2P_USER_OFFER_DETAIL_CREATE_ERROR,
    P2P_USER_OFFER_DETAIL_DATA,
    P2P_USER_OFFER_DETAIL_ERROR,
    P2P_USER_OFFER_DETAIL_FETCH,
} from './constants';
import { P2PUserOfferDetail } from './types';


export interface P2PUserOfferDetailState {
    create: {
        // data: P2PUserOfferDetail;
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    fetch: {
        page: number;
        total: number;
        list: P2PUserOfferDetail;
        side: string;
        base: string;
        quote: string;
        payment_method?: number;
        fetching: boolean;
        success: boolean;
        timestamp?: number;
        error?: CommonError;
    };
}

export const initialP2PUserOfferDetailState: P2PUserOfferDetailState = {
    create: {
        // data: defaultP2PUserOfferDetail,
        fetching: false,
        success: false,
    },
    fetch: {
        page: 0,
        total: 0,
        list: {
            offer: {
                offer_number: '',
                available_amount: 0,
                price: 0,
                currency: '',
                min_order: 0,
                max_order: 0,
                payment_time: 0,
                sum_order: 0,
                persentage: 0,
                term_of_condition: '',
                trader: {},
                payment: []
            },
            order: []
        },
        side: '',
        base: '',
        quote: '',
        fetching: false,
        success: false,
    },
};

export const p2pUserOfferDetailFetchReducer = (state: P2PUserOfferDetailState['fetch'], action: P2PUserOfferDetailActions) => {
    switch (action.type) {
        case P2P_USER_OFFER_DETAIL_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case P2P_USER_OFFER_DETAIL_DATA:
            return {
                ...state,
                list: sliceArray(action.payload.list, defaultStorageLimit()),
                page: action.payload.page,
                total: action.payload.total,
                side: action.payload.side,
                base: action.payload.base,
                quote: action.payload.quote,
                payment_method: action.payload.payment_method,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_USER_OFFER_DETAIL_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                page: 0,
                side: '',
                total: 0,
                list: {},
                error: action.error,
            };
        default:
            return state;
    }
};

const p2pUserOfferDetailCreateReducer = (state: P2PUserOfferDetailState['create'], action: P2PUserOfferDetailActions) => {
    switch (action.type) {
        case P2P_USER_OFFER_DETAIL_CREATE:
            return {
                ...state,
                fetching: true,
            };
        case P2P_USER_OFFER_DETAIL_CREATE_DATA:
            return {
                ...state,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_USER_OFFER_DETAIL_CREATE_ERROR:
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

export const p2pUserOfferDetailReducer = (state = initialP2PUserOfferDetailState, action: P2PUserOfferDetailActions) => {
    switch (action.type) {
        case P2P_USER_OFFER_DETAIL_FETCH:
        case P2P_USER_OFFER_DETAIL_DATA:
        case P2P_USER_OFFER_DETAIL_ERROR:
            return {
                ...state,
                fetch: p2pUserOfferDetailFetchReducer({ ...state.fetch }, action),
            };
        case P2P_USER_OFFER_DETAIL_CREATE:
        case P2P_USER_OFFER_DETAIL_CREATE_DATA:
        case P2P_USER_OFFER_DETAIL_CREATE_ERROR:
            const p2pUserOfferDetailCreateState = { ...state.create };

            return {
                ...state,
                create: p2pUserOfferDetailCreateReducer(p2pUserOfferDetailCreateState, action),
            };

        default:
            return state;
    }
};
