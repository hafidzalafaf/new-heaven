import { CommonError } from '../../types';
import { P2PProfileActions } from './actions';
import {
    P2P_PROFILE_FETCH,
    P2P_PROFILE_FETCH_DATA,
    P2P_PROFILE_FETCH_ERROR,
} from './constants';

export interface P2PProfileState {
    fetch: {
        data: [];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
}

export const initialP2PProfileState: P2PProfileState = {
    fetch: {
        data: [],
        fetching: false,
        success: false,
    },
};

const p2pProfileFetchReducer = (state: P2PProfileState['fetch'], action: P2PProfileActions) => {
    switch (action.type) {
        case P2P_PROFILE_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case P2P_PROFILE_FETCH_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_PROFILE_FETCH_ERROR:
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

export const p2pProfileReducer = (state = initialP2PProfileState, action: P2PProfileActions) => {
    switch (action.type) {
        case P2P_PROFILE_FETCH:
        case P2P_PROFILE_FETCH_DATA:
        case P2P_PROFILE_FETCH_ERROR:
            return {
                ...state,
                fetch: p2pProfileFetchReducer({ ...state.fetch }, action),
            };

        default:
            return state;
    }
};
