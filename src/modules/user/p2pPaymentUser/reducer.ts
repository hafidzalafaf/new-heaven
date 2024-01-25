import { CommonError } from 'src/modules/types';
import { P2PPaymentUserActions, p2pPaymentUserError } from './action';
import {
    P2P_PAYMENT_USER_DATA,
    P2P_PAYMENT_USER_ERROR,
    P2P_PAYMENT_USER_FETCH,
    P2P_PAYMENT_USER_CREATE,
    P2P_PAYMENT_USER_CREATE_DATA,
    P2P_PAYMENT_USER_CREATE_ERROR,
    P2P_PAYMENT_USER_UPDATE,
    P2P_PAYMENT_USER_UPDATE_DATA,
    P2P_PAYMENT_USER_UPDATE_ERROR,
    P2P_PAYMENT_USER_DELETE,
    P2P_PAYMENT_USER_DELETE_DATA,
    P2P_PAYMENT_USER_DELETE_ERROR,
    P2P_PAYMENT_USER_FETCH_SINGLE,
    P2P_PAYMENT_USER_FETCH_SINGLE_DATA,
    P2P_PAYMENT_USER_FETCH_SINGLE_ERROR,
} from './constants';

export interface P2PPaymentUserState {
    fetch: {
        data: [];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
        page: number;
        limit: number;
    };

    create: {
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };

    update: {
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };

    delete: {
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    fetchSingle: {
        data: {};
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
}

export const initialP2PPaymentUserState: P2PPaymentUserState = {
    fetch: {
        data: [],
        fetching: false,
        success: false,
        page: 1,
        limit: 5,
    },

    create: {
        fetching: false,
        success: false,
    },

    delete: {
        fetching: false,
        success: false,
    },

    update: {
        fetching: false,
        success: false,
    },
    fetchSingle: {
        data: {},
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
        case P2P_PAYMENT_USER_FETCH_SINGLE:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case P2P_PAYMENT_USER_DATA:
            return {
                ...state,
                data: action.payload,
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

export const p2pPaymentUpdateReducer = (state: P2PPaymentUserState['update'], action: P2PPaymentUserActions) => {
    switch (action.type) {
        case P2P_PAYMENT_USER_UPDATE:
            return {
                ...state,
                fetching: true,
            };
        case P2P_PAYMENT_USER_UPDATE_DATA:
            return {
                ...state,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_PAYMENT_USER_UPDATE_ERROR:
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

export const p2pPaymentDeleteReducer = (state: P2PPaymentUserState['delete'], action: P2PPaymentUserActions) => {
    switch (action.type) {
        case P2P_PAYMENT_USER_DELETE:
            return {
                ...state,
                fetching: true,
            };
        case P2P_PAYMENT_USER_DELETE_DATA:
            return {
                ...state,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_PAYMENT_USER_DELETE_ERROR:
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

export const P2PPaymentUserFetchSingleReducer = (
    state: P2PPaymentUserState['fetchSingle'],
    action: P2PPaymentUserActions
) => {
    switch (action.type) {
        case P2P_PAYMENT_USER_FETCH_SINGLE:
            return {
                ...state,
                fetching: true,
            };
        case P2P_PAYMENT_USER_FETCH_SINGLE_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_PAYMENT_USER_FETCH_SINGLE_ERROR:
            return {
                ...state,
                fetching: false,
                error: action.error,
            };
    }
};

export const p2pPaymentUserReducer = (state = initialP2PPaymentUserState, action: P2PPaymentUserActions) => {
    switch (action.type) {
        case P2P_PAYMENT_USER_FETCH:
        case P2P_PAYMENT_USER_DATA:
        case P2P_PAYMENT_USER_ERROR:
            return {
                ...state,
                p2pPaymentUserFetch: p2pPaymentUserFetchReducer({ ...state.fetch }, action),
            };
        case P2P_PAYMENT_USER_CREATE:
        case P2P_PAYMENT_USER_CREATE_DATA:
        case P2P_PAYMENT_USER_CREATE_ERROR:
            const p2pPaymentUserCreateState = { ...state.create };

            return {
                ...state,
                p2pPaymentUserCreate: p2pPaymentCreateReducer(p2pPaymentUserCreateState, action),
            };

        case P2P_PAYMENT_USER_UPDATE:
        case P2P_PAYMENT_USER_UPDATE_DATA:
        case P2P_PAYMENT_USER_UPDATE_ERROR:
            const p2pPaymentUserUpdateState = { ...state.update };

            return {
                ...state,
                p2pPaymentUserUpdate: p2pPaymentUpdateReducer(p2pPaymentUserUpdateState, action),
            };

        case P2P_PAYMENT_USER_DELETE:
        case P2P_PAYMENT_USER_DELETE_DATA:
        case P2P_PAYMENT_USER_DELETE_ERROR:
            const p2pPaymentUserDeleteState = { ...state.delete };

            return {
                ...state,
                p2pPaymentUserDelete: p2pPaymentDeleteReducer(p2pPaymentUserDeleteState, action),
            };
        case P2P_PAYMENT_USER_FETCH_SINGLE:
        case P2P_PAYMENT_USER_FETCH_SINGLE_DATA:
        case P2P_PAYMENT_USER_FETCH_SINGLE_ERROR:
            const p2pPaymentUserFetchSingleState = { ...state.fetchSingle };

            return {
                ...state,
                p2pPaymentUserFetchSingle: P2PPaymentUserFetchSingleReducer(p2pPaymentUserFetchSingleState, action),
            };
        default:
            return state;
    }
};
