import { CommonError } from '../../../modules/types';
import { OrderConfirmActions } from './actions';
import {
    ORDER_CONFIRM_CREATE,
    ORDER_CONFIRM_CREATE_DATA,
    ORDER_CONFIRM_CREATE_ERROR,
    ORDER_CONFIRM_LAST,
    ORDER_CONFIRM_LAST_DATA,
    ORDER_CONFIRM_LAST_ERROR,
    ORDER_CONFIRM_CANCEL,
    ORDER_CONFIRM_CANCEL_DATA,
    ORDER_CONFIRM_CANCEL_ERROR,
} from './constants';
import { OrderConfirm } from './types';

const defaultOrderConfirm: OrderConfirm = {
    is_confirm: '',
    payment_method: '',
};

export interface OrderConfirmState {
    create: {
        data: OrderConfirm;
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    put_last_confirm: {
        data: OrderConfirm;
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    put_cancel_order: {
        data: OrderConfirm;
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
}

export const initialOrderConfirmState: OrderConfirmState = {
    create: {
        data: defaultOrderConfirm,
        fetching: false,
        success: false,
    },
    put_last_confirm: {
        data: defaultOrderConfirm,
        fetching: false,
        success: false,
    },
    put_cancel_order: {
        data: defaultOrderConfirm,
        fetching: false,
        success: false,
    },
};

const orderConfirmCreateReducer = (state: OrderConfirmState['create'], action: OrderConfirmActions) => {
    switch (action.type) {
        case ORDER_CONFIRM_CREATE:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case ORDER_CONFIRM_CREATE_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case ORDER_CONFIRM_CREATE_ERROR:
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

const orderConfirmLastReducer = (state: OrderConfirmState['put_last_confirm'], action: OrderConfirmActions) => {
    switch (action.type) {
        case ORDER_CONFIRM_LAST:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case ORDER_CONFIRM_LAST_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case ORDER_CONFIRM_LAST_ERROR:
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

const orderConfirmCancelReducer = (state: OrderConfirmState['put_cancel_order'], action: OrderConfirmActions) => {
    switch (action.type) {
        case ORDER_CONFIRM_CANCEL:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case ORDER_CONFIRM_CANCEL_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case ORDER_CONFIRM_CANCEL_ERROR:
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

export const orderConfirmReducer = (state = initialOrderConfirmState, action: OrderConfirmActions) => {
    switch (action.type) {
        case ORDER_CONFIRM_CREATE:
        case ORDER_CONFIRM_CREATE_DATA:
        case ORDER_CONFIRM_CREATE_ERROR:
            const orderConfirmCreate = { ...state.create };
            return {
                ...state,
                create: orderConfirmCreateReducer(orderConfirmCreate, action),
            };

        case ORDER_CONFIRM_LAST:
        case ORDER_CONFIRM_LAST_DATA:
        case ORDER_CONFIRM_LAST_ERROR:
            const orderConfirmLast = { ...state.create };
            return {
                ...state,
                create: orderConfirmLastReducer(orderConfirmLast, action),
            };

        case ORDER_CONFIRM_CANCEL:
        case ORDER_CONFIRM_CANCEL_DATA:
        case ORDER_CONFIRM_CANCEL_ERROR:
            const orderConfirmCancel = { ...state.create };
            return {
                ...state,
                create: orderConfirmCancelReducer(orderConfirmCancel, action),
            };

        default:
            return state;
    }
};
