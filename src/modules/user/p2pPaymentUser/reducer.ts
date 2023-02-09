import { CommonError } from 'src/modules/types';
import { P2PPaymentUserActions, p2pPaymentUserError } from './action';
import {
    P2P_PAYMENT_USER_CREATE,
    P2P_PAYMENT_USER_CREATE_DATA,
    P2P_PAYMENT_USER_CREATE_ERROR,
    P2P_PAYMENT_USER_DATA,
    P2P_PAYMENT_USER_ERROR,
    P2P_PAYMENT_USER_FETCH,
} from './constants';
import { IPaymentUser } from './types';

const defaultP2PPaymentUser: IPaymentUser = {
    payment_method: '',
    account_number: '',
    full_name: '',
};

export interface P2PPaymentUserState {
    create: {
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };

    fetch: {
        data: IPaymentUser[];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
}

export const initialP2PPaymentUserState: P2PPaymentUserState = {
    create: {
        fetching: false,
        success: false,
    },
    fetch: {
        data: [],
        fetching: false,
        success: false,
    },
};

export const p2pPaymentUserFetchReducer = (state: P2PPaymentUserState['fetch'], action: P2PPaymentUserActions) => {
    switch (action.type) {
        case P2P_PAYMENT_USER_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case P2P_PAYMENT_USER_DATA:
            return {
                ...state,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_PAYMENT_USER_ERROR:
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

export const p2pPaymentCreateReducer = (state: P2PPaymentUserState['create'], action: P2PPaymentUserActions) => {
    switch (action.type) {
        case P2P_PAYMENT_USER_CREATE:
            return {
                ...state,
                fetching: true,
            };
        case P2P_PAYMENT_USER_CREATE_DATA:
            return {
                ...state,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_PAYMENT_USER_CREATE_ERROR:
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

export const p2pPaymentUserReducer = (state = initialP2PPaymentUserState, action: P2PPaymentUserActions) => {
    switch (action.type) {
        case P2P_PAYMENT_USER_FETCH:
        case P2P_PAYMENT_USER_DATA:
        case P2P_PAYMENT_USER_ERROR:
            return {
                ...state,
                fetch: p2pPaymentUserFetchReducer({ ...state.fetch }, action),
            };
        case P2P_PAYMENT_USER_CREATE:
        case P2P_PAYMENT_USER_CREATE_DATA:
        case P2P_PAYMENT_USER_CREATE_ERROR:
            const p2pPaymentUserCreateState = { ...state.create };

            return {
                ...state,
                create: p2pPaymentCreateReducer(p2pPaymentUserCreateState, action),
            };
        default:
            return state;
    }
};
