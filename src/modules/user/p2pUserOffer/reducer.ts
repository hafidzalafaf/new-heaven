import { defaultStorageLimit } from 'src/api';
import { sliceArray } from 'src/helpers';
import { CommonError } from '../../types';
import { P2PUserOfferActions } from './actions';
import {
    P2P_USER_OFFER_CREATE,
    P2P_USER_OFFER_CREATE_DATA,
    P2P_USER_OFFER_CREATE_ERROR,
    P2P_USER_OFFER_DATA,
    P2P_USER_OFFER_ERROR,
    P2P_USER_OFFER_FETCH,
    P2P_USER_OFFER_CANCEL,
    P2P_USER_OFFER_CANCEL_DATA,
    P2P_USER_OFFER_CANCEL_ERROR
} from './constants';
import { P2PUserOffer } from './types';


export interface P2PUserOfferState {
    create: {
        // data: P2PUserOffer;
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    fetch: {
        page: number;
        total: number;
        list: P2PUserOffer[];
        side: string;
        base: string;
        quote: string;
        payment_method?: number;
        fetching: boolean;
        success: boolean;
        timestamp?: number;
        error?: CommonError;
    };
    cancel: {
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    }
}

export const initialP2PUserOfferState: P2PUserOfferState = {
    create: {
        // data: defaultP2PUserOffer,
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
    cancel:{
        success: false,
        fetching: false
    }
};

export const p2pUserOfferFetchReducer = (state: P2PUserOfferState['fetch'], action: P2PUserOfferActions) => {
    switch (action.type) {
        case P2P_USER_OFFER_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case P2P_USER_OFFER_DATA:
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
        case P2P_USER_OFFER_ERROR:
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

const p2pUserOfferCreateReducer = (state: P2PUserOfferState['create'], action: P2PUserOfferActions) => {
    switch (action.type) {
        case P2P_USER_OFFER_CREATE:
            return {
                ...state,
                fetching: true,
            };
        case P2P_USER_OFFER_CREATE_DATA:
            return {
                ...state,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_USER_OFFER_CREATE_ERROR:
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

export const p2pUserOfferCancelReducer = (state: P2PUserOfferState['cancel'], action: P2PUserOfferActions) => {
    switch (action.type){
        case P2P_USER_OFFER_CANCEL: 
        return {
            ...state,
            fetching: true
        };
        case P2P_USER_OFFER_CANCEL_DATA:
        return {
        ...state,
        fetching: false,
        success: true,
        error: undefined
        };
        case P2P_USER_OFFER_CANCEL_ERROR:
        return{
        ...state,
        fetching: false,
        error: action.error
        }
    }
}

export const p2pUserOfferReducer = (state = initialP2PUserOfferState, action: P2PUserOfferActions) => {
    switch (action.type) {
        case P2P_USER_OFFER_FETCH:
        case P2P_USER_OFFER_DATA:
        case P2P_USER_OFFER_ERROR:
            return {
                ...state,
                fetch: p2pUserOfferFetchReducer({ ...state.fetch }, action),
            };
        case P2P_USER_OFFER_CREATE:
        case P2P_USER_OFFER_CREATE_DATA:
        case P2P_USER_OFFER_CREATE_ERROR:
            const p2pUserOfferCreateState = { ...state.create };
        

            return {
                ...state,
                create: p2pUserOfferCreateReducer(p2pUserOfferCreateState, action),
            };

            case P2P_USER_OFFER_CANCEL:
                case P2P_USER_OFFER_CANCEL_DATA:
                case P2P_USER_OFFER_CANCEL_ERROR:
                    const p2pUserOfferCancelState = { ...state.cancel };
            
                    return {
                        ...state,
                        cancel: p2pUserOfferCancelReducer(p2pUserOfferCancelState, action),
                    };
        default:
            return state;
    }
};
