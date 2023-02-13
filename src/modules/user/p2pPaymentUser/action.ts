import { CommonError } from '../../types';
import {
    P2P_PAYMENT_USER_FETCH,
    P2P_PAYMENT_USER_DATA,
    P2P_PAYMENT_USER_ERROR,
    P2P_PAYMENT_USER_CREATE,
    P2P_PAYMENT_USER_CREATE_DATA,
    P2P_PAYMENT_USER_CREATE_ERROR,
} from './constants';
import { IPaymentUser } from './types';

export interface P2PPaymentUserCreate {
    type: typeof P2P_PAYMENT_USER_CREATE;
    payload: IPaymentUser;
}

export interface P2PPaymentUserCreateData {
    type: typeof P2P_PAYMENT_USER_CREATE_DATA;
}

export interface P2PPaymentUserCreateError {
    type: typeof P2P_PAYMENT_USER_CREATE_ERROR;
    error: CommonError;
}

export interface P2PPaymentUserFetch {
    type: typeof P2P_PAYMENT_USER_FETCH;
}

export interface P2PPaymentUserData {
    type: typeof P2P_PAYMENT_USER_DATA;
    payload: [];
}

export interface P2PPaymentUserError {
    type: typeof P2P_PAYMENT_USER_ERROR;
    error: CommonError;
}

export type P2PPaymentUserActions =
    | P2PPaymentUserCreate
    | P2PPaymentUserCreateData
    | P2PPaymentUserCreateError
    | P2PPaymentUserFetch
    | P2PPaymentUserData
    | P2PPaymentUserError;

export const p2pPaymentUserCreate = (payload: P2PPaymentUserCreate['payload']): P2PPaymentUserCreate => ({
    type: P2P_PAYMENT_USER_CREATE,
    payload,
});

export const p2pPaymentUserCreateData = (): P2PPaymentUserCreateData => ({
    type: P2P_PAYMENT_USER_CREATE_DATA,
});

export const p2pPaymentUserCreateError = (error: CommonError): P2PPaymentUserCreateError => ({
    type: P2P_PAYMENT_USER_CREATE_ERROR,
    error,
});

export const p2pPaymentUserFetch = (): P2PPaymentUserFetch => ({
    type: P2P_PAYMENT_USER_FETCH,
});

export const p2pPaymentUserData = (payload:P2PPaymentUserData['payload']): P2PPaymentUserData => ({
    type: P2P_PAYMENT_USER_DATA,
    payload
});

export const p2pPaymentUserError = (error: CommonError): P2PPaymentUserError => ({
    type: P2P_PAYMENT_USER_ERROR,
    error,
});
