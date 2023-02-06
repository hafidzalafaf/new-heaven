import { CommonError } from '../../types';
import {
    P2P_USER_SETTING_FETCH,
    P2P_USER_SETTING_FETCH_DATA,
    P2P_USER_SETTING_FETCH_ERROR,
} from './constants';

export interface P2PUserSettingFetch {
    type: typeof P2P_USER_SETTING_FETCH;
    payload?: {
        type: string;
        ordering: string;
        order_by: string;
    };
}

export interface P2PUserSettingData {
    type: typeof P2P_USER_SETTING_FETCH_DATA;
    payload: [];
}

export interface P2PUserSettingError {
    type: typeof P2P_USER_SETTING_FETCH_ERROR;
    error: CommonError;
}

export type P2PUserSettingActions = P2PUserSettingFetch | P2PUserSettingData | P2PUserSettingError;

export const p2pUserSettingFetch = (payload?: P2PUserSettingFetch['payload']): P2PUserSettingFetch => ({
    type: P2P_USER_SETTING_FETCH,
    payload,
});

export const p2pUserSettingData = (payload: P2PUserSettingData['payload']): P2PUserSettingData => ({
    type: P2P_USER_SETTING_FETCH_DATA,
    payload,
});

export const p2pUserSettingError = (error: CommonError): P2PUserSettingError => ({
    type: P2P_USER_SETTING_FETCH_ERROR,
    error,
});
