import { CommonError } from '../../types';
import { P2PProfileActions } from './actions';
import {
    P2P_PROFILE_FETCH,
    P2P_PROFILE_FETCH_DATA,
    P2P_PROFILE_FETCH_ERROR,
    P2P_PROFILE_CHANGE_USERNAME,
    P2P_PROFILE_CHANGE_USERNAME_DATA,
    P2P_PROFILE_CHANGE_USERNAME_ERROR,
} from './constants';


export interface P2PProfileFetchInterface {
    banned_state: boolean;
    logo: string;
    member: {
        email: string;
        uid: string;
        group: string;
    }
    offer: number;
    positif_feedback: {
        negatif: number;
        positif: number;
        total: number;
    }
    success_rate: number;
    trade: {
        completed_rate: string;
        mount_trade: number;
        pay_time: string;
        release_time: string;
        total: number;
    }
    trader_name: string;
}
export interface P2PProfileState {
    fetch: {
        data: P2PProfileFetchInterface;
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    changeUsername: {
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
}

export const initialP2PProfileState: P2PProfileState = {
    fetch: {
        data: {
            banned_state: false,
            logo: '',
            member: {
                email: '',
                uid: '',
                group: '',
            },
            offer: 0,
            positif_feedback: {
                negatif: 0,
                positif: 0,
                total: 0,
            },
            success_rate: 0,
            trade: {
                completed_rate: '',
                mount_trade: 0,
                pay_time: '',
                release_time: '',
                total: 0,
            },
            trader_name: '',
        },
        fetching: false,
        success: false,
    },
    changeUsername: {
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

const p2pProfileChangeUsernameReducer = (state: P2PProfileState['changeUsername'], action: P2PProfileActions) => {
    switch (action.type) {
        case P2P_PROFILE_CHANGE_USERNAME:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case P2P_PROFILE_CHANGE_USERNAME_DATA:
            return {
                ...state,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_PROFILE_CHANGE_USERNAME_ERROR:
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
        case P2P_PROFILE_CHANGE_USERNAME:
        case P2P_PROFILE_CHANGE_USERNAME_DATA:
        case P2P_PROFILE_CHANGE_USERNAME_ERROR:
            return {
                ...state,
                changeUsername: p2pProfileChangeUsernameReducer({ ...state.changeUsername }, action),
            };

        default:
            return state;
    }
};
