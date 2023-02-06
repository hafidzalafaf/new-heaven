import { CommonError } from '../../types';
import { P2PUserSettingActions } from './actions';
import {
    P2P_USER_SETTING_FETCH,
    P2P_USER_SETTING_FETCH_DATA,
    P2P_USER_SETTING_FETCH_ERROR,
} from './constants';

export interface P2PUserSettingState {
    fetch: {
        data: [];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
}

export const initialP2PUserSettingState: P2PUserSettingState = {
    fetch: {
        data: [],
        fetching: false,
        success: false,
    },
};

const p2pUserSettingFetchReducer = (state: P2PUserSettingState['fetch'], action: P2PUserSettingActions) => {
    switch (action.type) {
        case P2P_USER_SETTING_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case P2P_USER_SETTING_FETCH_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_USER_SETTING_FETCH_ERROR:
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

export const p2pUserSettingReducer = (state = initialP2PUserSettingState, action: P2PUserSettingActions) => {
    switch (action.type) {
        case P2P_USER_SETTING_FETCH:
        case P2P_USER_SETTING_FETCH_DATA:
        case P2P_USER_SETTING_FETCH_ERROR:
            return {
                ...state,
                fetch: p2pUserSettingFetchReducer({ ...state.fetch }, action),
            };

        default:
            return state;
    }
};
