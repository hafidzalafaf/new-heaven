import { CommonError } from '../../../modules/types';
import { OrderActions } from './actions';
import {
    ORDER_CREATE,
    ORDER_CREATE_DATA,
    ORDER_CREATE_ERROR,
    ORDER_DETAIL_DATA,
    ORDER_DETAIL_ERROR,
    ORDER_DETAIL_FETCH,
    ORDER_DATA,
    ORDER_ERROR,
    ORDER_FETCH,
} from './constants';
import { Order } from './types';

const defaultOrder: Order = {
    offer_number: '',
    price: '',
    amount: '',
    payment_order: '',
};

export interface OrderState {
    create: {
        // data: Order;
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    detail: {
        data: Order[];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    fetch: {
        data: Order[];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
}

export const initialOrderState: OrderState = {
    create: {
        // data: defaultOrder,
        fetching: false,
        success: false,
    },
    detail: {
        data: [],
        fetching: false,
        success: false,
    },
    fetch: {
        data: [],
        fetching: false,
        success: false,
    },
};

export const orderFetchReducer = (state: OrderState['fetch'], action: OrderActions) => {
    switch (action.type) {
        case ORDER_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case ORDER_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case ORDER_ERROR:
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

export const orderDetailReducer = (state: OrderState['detail'], action: OrderActions) => {
    switch (action.type) {
        case ORDER_DETAIL_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case ORDER_DETAIL_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case ORDER_DETAIL_ERROR:
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

const orderCreateReducer = (state: OrderState['create'], action: OrderActions) => {
    switch (action.type) {
        case ORDER_CREATE:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case ORDER_CREATE_DATA:
            return {
                ...state,
                // data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case ORDER_CREATE_ERROR:
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

export const orderReducer = (state = initialOrderState, action: OrderActions) => {
    switch (action.type) {
        case ORDER_FETCH:
        case ORDER_DATA:
        case ORDER_ERROR:
            return {
                ...state,
                fetch: orderFetchReducer({ ...state.fetch }, action),
            };

        case ORDER_DETAIL_FETCH:
        case ORDER_DETAIL_DATA:
        case ORDER_DETAIL_ERROR:
            return {
                ...state,
                detail: orderDetailReducer({ ...state.detail }, action),
            };

        case ORDER_CREATE:
        case ORDER_CREATE_DATA:
        case ORDER_CREATE_ERROR:
            const orderCreateState = { ...state.create };
            return {
                ...state,
                create: orderCreateReducer(orderCreateState, action),
            };

        default:
            return state;
    }
};
