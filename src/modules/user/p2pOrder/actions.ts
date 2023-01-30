import { CommonError } from '../../../modules/types';
import { ORDER_FETCH, ORDER_DATA, ORDER_ERROR, ORDER_CREATE, ORDER_CREATE_DATA, ORDER_CREATE_ERROR } from './constants';
import { Order } from './types';

export interface OrderFetch {
    type: typeof ORDER_FETCH;
    payload?: {
        offer_number: string;
    };
}

export interface OrderData {
    type: typeof ORDER_DATA;
    payload: [];
}

export interface OrderError {
    type: typeof ORDER_ERROR;
    error: CommonError;
}

export interface OrderCreate {
    type: typeof ORDER_CREATE;
    error: CommonError;
}

export interface OrderCreateData {
    type: typeof ORDER_CREATE_DATA;
    payload: Order;
}

export interface OrderCreateError {
    type: typeof ORDER_CREATE_ERROR;
    error: CommonError;
}

export type OrderActions = OrderFetch | OrderData | OrderError | OrderCreate | OrderCreateData | OrderCreateError;

export const orderFetch = (payload?: OrderFetch['payload']): OrderFetch => ({
    type: ORDER_FETCH,
    payload,
});

export const orderData = (payload: OrderData['payload']): OrderData => ({
    type: ORDER_DATA,
    payload,
});

export const orderError = (error: CommonError): OrderError => ({
    type: ORDER_ERROR,
    error,
});

export const orderCreate = (error: CommonError): OrderCreate => ({
    type: ORDER_CREATE,
    error,
});

export const orderCreateData = (payload: OrderCreateData['payload']): OrderCreateData => ({
    type: ORDER_CREATE_DATA,
    payload,
});

export const orderCreateError = (error: CommonError): OrderCreateError => ({
    type: ORDER_CREATE_ERROR,
    error,
});
