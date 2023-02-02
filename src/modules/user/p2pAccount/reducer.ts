import { CommonError } from '../../types';
import { P2PAccountActions } from './actions';
import {
    P2P_ACCOUNT_FETCH,
    P2P_ACCOUNT_FETCH_DATA,
    P2P_ACCOUNT_FETCH_ERROR,
} from './constants';

export interface P2PAccountState {
    fetch: {
        data: [];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
}

export const initialP2PAccountState: P2PAccountState = {
    fetch: {
        data: [],
        fetching: false,
        success: false,
    },
};

const p2pAccountFetchReducer = (state: P2PAccountState['fetch'], action: P2PAccountActions) => {
    switch (action.type) {
        case P2P_ACCOUNT_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case P2P_ACCOUNT_FETCH_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_ACCOUNT_FETCH_ERROR:
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

export const p2pAccountReducer = (state = initialP2PAccountState, action: P2PAccountActions) => {
    switch (action.type) {
        case P2P_ACCOUNT_FETCH:
        case P2P_ACCOUNT_FETCH_DATA:
        case P2P_ACCOUNT_FETCH_ERROR:
            return {
                ...state,
                fetch: p2pAccountFetchReducer({ ...state.fetch }, action),
            };

        default:
            return state;
    }
};
