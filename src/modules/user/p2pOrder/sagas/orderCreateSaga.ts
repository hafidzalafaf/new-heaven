import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { OrderCreate, orderCreateData, orderCreateError } from '../actions';
import axios from 'axios';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* orderCreateSaga(action: OrderCreate) {
    try {
        yield call(API.post(config(getCsrfToken())), `/market/orders`, action.payload);
        yield put(orderCreateData());
        yield put(alertPush({ message: ['success.order.created'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: orderCreateError,
                },
            })
        );
    }
}
