import { CommonError } from '../../../modules/types';
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

export interface OrderConfirmCreate {
    type: typeof ORDER_CONFIRM_CREATE;
    payload: {
        order_number: string;
    };
}

export interface OrderConfirmCreateData {
    type: typeof ORDER_CONFIRM_CREATE_DATA;
    payload: OrderConfirm;
}

export interface OrderConfirmCreateError {
    type: typeof ORDER_CONFIRM_CREATE_ERROR;
    error: CommonError;
}

export interface OrderConfirmLast {
    type: typeof ORDER_CONFIRM_LAST;
    payload: {
        order_number: string;
    };
}

export interface OrderConfirmLastData {
    type: typeof ORDER_CONFIRM_LAST_DATA;
    payload: OrderConfirm;
}

export interface OrderConfirmLastError {
    type: typeof ORDER_CONFIRM_LAST_ERROR;
    error: CommonError;
}

export interface OrderConfirmCancel {
    type: typeof ORDER_CONFIRM_CANCEL;
    payload: {
        order_number: string;
    };
}

export interface OrderConfirmCancelData {
    type: typeof ORDER_CONFIRM_CANCEL_DATA;
    payload: OrderConfirm;
}

export interface OrderConfirmCancelError {
    type: typeof ORDER_CONFIRM_CANCEL_ERROR;
    error: CommonError;
}

export type OrderConfirmActions =
    | OrderConfirmCreate
    | OrderConfirmCreateData
    | OrderConfirmCreateError
    | OrderConfirmLast
    | OrderConfirmLastData
    | OrderConfirmLastError
    | OrderConfirmCancel
    | OrderConfirmCancelData
    | OrderConfirmCancelError;

export const orderConfirmCreate = (payload: OrderConfirmCreate['payload']): OrderConfirmCreate => ({
    type: ORDER_CONFIRM_CREATE,
    payload,
});

export const orderConfirmCreateData = (payload: OrderConfirmCreateData['payload']): OrderConfirmCreateData => ({
    type: ORDER_CONFIRM_CREATE_DATA,
    payload,
});

export const orderConfirmCreateError = (error: CommonError): OrderConfirmCreateError => ({
    type: ORDER_CONFIRM_CREATE_ERROR,
    error,
});

export const orderConfirmLast = (payload: OrderConfirmLast['payload']): OrderConfirmLast => ({
    type: ORDER_CONFIRM_LAST,
    payload,
});

export const orderConfirmLastData = (payload: OrderConfirmLastData['payload']): OrderConfirmLastData => ({
    type: ORDER_CONFIRM_LAST_DATA,
    payload,
});

export const orderConfirmLastError = (error: CommonError): OrderConfirmLastError => ({
    type: ORDER_CONFIRM_LAST_ERROR,
    error,
});

export const orderConfirmCancel = (payload: OrderConfirmCancel['payload']): OrderConfirmCancel => ({
    type: ORDER_CONFIRM_CANCEL,
    payload,
});

export const orderConfirmCancelData = (payload: OrderConfirmCancelData['payload']): OrderConfirmCancelData => ({
    type: ORDER_CONFIRM_CANCEL_DATA,
    payload,
});

export const orderConfirmCancelError = (error: CommonError): OrderConfirmCancelError => ({
    type: ORDER_CONFIRM_CANCEL_ERROR,
    error,
});
