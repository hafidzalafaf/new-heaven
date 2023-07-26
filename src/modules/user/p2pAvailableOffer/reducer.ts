import { CommonError } from '../../../modules/types';
import { P2POfferAvailableActions } from './actions';
import {
    P2P_OFFER_AVAILABLE_FETCH,
    P2P_OFFER_AVAILABLE_FETCH_DATA,
    P2P_OFFER_AVAILABLE_FETCH_ERROR,
} from './constants';

export interface P2POfferAvailableState {
    fetch: {
        data: [];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
}

export const initialP2PAvailableOfferState: P2POfferAvailableState = {
    fetch: {
        data: [],
        fetching: false,
        success: false,
    },
};

const p2pOfferAvailableFetchReducer = (state: P2POfferAvailableState['fetch'], action: P2POfferAvailableActions) => {
    switch (action.type) {
        case P2P_OFFER_AVAILABLE_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case P2P_OFFER_AVAILABLE_FETCH_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_OFFER_AVAILABLE_FETCH_ERROR:
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

export const p2pOfferAvailableReducer = (state = initialP2PAvailableOfferState, action: P2POfferAvailableActions) => {
    switch (action.type) {
        case P2P_OFFER_AVAILABLE_FETCH:
        case P2P_OFFER_AVAILABLE_FETCH_DATA:
        case P2P_OFFER_AVAILABLE_FETCH_ERROR:
            return {
                ...state,
                fetch: p2pOfferAvailableFetchReducer({ ...state.fetch }, action),
            };

        default:
            return state;
    }
};
