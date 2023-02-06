import { CommonError } from '../../../modules/types';
import {
    ORDER_FETCH,
    ORDER_DATA,
    ORDER_ERROR,
    ORDER_CREATE,
    ORDER_CREATE_DATA,
    ORDER_CREATE_ERROR,
    ORDER_DETAIL_DATA,
    ORDER_DETAIL_ERROR,
    ORDER_DETAIL_FETCH,
} from './constants';
import { Order } from './types';

export interface OrderFetch {
    type: typeof ORDER_FETCH;
}

export interface OrderData {
    type: typeof ORDER_DATA;
    payload: [];
}

export interface OrderError {
    type: typeof ORDER_ERROR;
    error: CommonError;
}

export interface OrderDetailFetch {
    type: typeof ORDER_DETAIL_FETCH;
    payload?: {
        offer_number: string;
    };
}

export interface OrderDetailData {
    type: typeof ORDER_DETAIL_DATA;
    payload: [];
}

export interface OrderDetailError {
    type: typeof ORDER_DETAIL_ERROR;
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

export type OrderActions =
    | OrderFetch
    | OrderData
    | OrderError
    | OrderDetailFetch
    | OrderDetailData
    | OrderDetailError
    | OrderCreate
    | OrderCreateData
    | OrderCreateError;

export const orderFetch = (): OrderFetch => ({
    type: ORDER_FETCH,
});

export const orderData = (payload: OrderData['payload']): OrderData => ({
    type: ORDER_DATA,
    payload,
});

export const orderError = (error: CommonError): OrderError => ({
    type: ORDER_ERROR,
    error,
});

export const orderDetailFetch = (payload?: OrderDetailFetch['payload']): OrderDetailFetch => ({
    type: ORDER_DETAIL_FETCH,
    payload,
});

export const orderDetailData = (payload: OrderDetailData['payload']): OrderDetailData => ({
    type: ORDER_DETAIL_DATA,
    payload,
});

export const orderDetailError = (error: CommonError): OrderDetailError => ({
    type: ORDER_DETAIL_ERROR,
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
