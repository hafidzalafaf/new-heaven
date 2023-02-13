import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { orderData, orderError, OrderFetch } from '../actions';
import { buildQueryString } from '../../../../helpers';
import axios from 'axios';
import { getCsrfToken } from '../../../../helpers';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* orderSaga(action: OrderFetch) {
    try {
        const feedback = yield call(API.get(config(getCsrfToken())), `/account/order`);
        yield put(orderData(feedback));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: orderError,
                },
            })
        );
    }
}
