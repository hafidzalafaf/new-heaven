import { CommonError } from '../../types';
import {
    P2P_PAYMENT_USER_FETCH,
    P2P_PAYMENT_USER_DATA,
    P2P_PAYMENT_USER_ERROR,
    P2P_PAYMENT_USER_CREATE,
    P2P_PAYMENT_USER_CREATE_DATA,
    P2P_PAYMENT_USER_CREATE_ERROR,
    P2P_PAYMENT_USER_UPDATE,
    P2P_PAYMENT_USER_UPDATE_DATA,
    P2P_PAYMENT_USER_UPDATE_ERROR,
    P2P_PAYMENT_USER_DELETE,
    P2P_PAYMENT_USER_DELETE_DATA,
    P2P_PAYMENT_USER_DELETE_ERROR,
} from './constants';
import { IPaymentUser } from './types';

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

export interface P2PPaymentUserUpdate {
    type: typeof P2P_PAYMENT_USER_UPDATE;
    payload: {
        payment_method?: string;
        account_number?: string;
        full_name?: string;
        payment_id?: string;
    };
}

export interface P2PPaymentUserUpdateData {
    type: typeof P2P_PAYMENT_USER_UPDATE_DATA;
}

export interface P2PPaymentUserUpdateError {
    type: typeof P2P_PAYMENT_USER_UPDATE_ERROR;
    error: CommonError;
}

export interface P2PPaymentUserDelete {
    type: typeof P2P_PAYMENT_USER_DELETE;
    payload: {
        payment_id?: string;
    };
}

export interface P2PPaymentUserDeleteData {
    type: typeof P2P_PAYMENT_USER_DELETE_DATA;
}

export interface P2PPaymentUserDeleteError {
    type: typeof P2P_PAYMENT_USER_DELETE_ERROR;
    error: CommonError;
}

export type P2PPaymentUserActions =
    | P2PPaymentUserFetch
    | P2PPaymentUserData
    | P2PPaymentUserError
    | P2PPaymentUserCreate
    | P2PPaymentUserCreateData
    | P2PPaymentUserCreateError
    | P2PPaymentUserUpdate
    | P2PPaymentUserUpdateData
    | P2PPaymentUserUpdateError
    | P2PPaymentUserDelete
    | P2PPaymentUserDeleteData
    | P2PPaymentUserDeleteError;

export const p2pPaymentUserFetch = (): P2PPaymentUserFetch => ({
    type: P2P_PAYMENT_USER_FETCH,
});

export const p2pPaymentUserData = (payload: P2PPaymentUserData['payload']): P2PPaymentUserData => ({
    type: P2P_PAYMENT_USER_DATA,
    payload,
});

export const p2pPaymentUserError = (error: CommonError): P2PPaymentUserError => ({
    type: P2P_PAYMENT_USER_ERROR,
    error,
});

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

export const p2pPaymentUserUpdate = (payload: P2PPaymentUserUpdate['payload']): P2PPaymentUserUpdate => ({
    type: P2P_PAYMENT_USER_UPDATE,
    payload,
});

export const p2pPaymentUserUpdateData = (): P2PPaymentUserUpdateData => ({
    type: P2P_PAYMENT_USER_UPDATE_DATA,
});

export const p2pPaymentUserUpdateError = (error: CommonError): P2PPaymentUserUpdateError => ({
    type: P2P_PAYMENT_USER_UPDATE_ERROR,
    error,
});

export const p2pPaymentUserDelete = (payload: P2PPaymentUserDelete['payload']): P2PPaymentUserDelete => ({
    type: P2P_PAYMENT_USER_DELETE,
    payload,
});

export const p2pPaymentUserDeleteData = (): P2PPaymentUserDeleteData => ({
    type: P2P_PAYMENT_USER_DELETE_DATA,
});

export const p2pPaymentUserDeleteError = (error: CommonError): P2PPaymentUserDeleteError => ({
    type: P2P_PAYMENT_USER_DELETE_ERROR,
    error,
});
