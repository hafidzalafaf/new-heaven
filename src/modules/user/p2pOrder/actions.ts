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
    payload: Order;
}

export interface OrderCreateData {
    type: typeof ORDER_CREATE_DATA;
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

export const orderCreate = (payload: OrderCreate['payload']): OrderCreate => ({
    type: ORDER_CREATE,
    payload,
});

export const orderCreateData = (): OrderCreateData => ({
    type: ORDER_CREATE_DATA,
});

export const orderCreateError = (error: CommonError): OrderCreateError => ({
    type: ORDER_CREATE_ERROR,
    error,
});
