import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { orderData, orderError, OrderFetch } from '../actions';
import { buildQueryString } from '../../../../helpers';
import axios from 'axios';
import { getCsrfToken } from '../../../../helpers';

// const config: RequestOptions = {
//     apiVersion: 'p2p',
// };

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

// const token = '';
// const configs = {
//     headers: `Bearer ${token}`,
// };

export function* orderSaga(action: OrderFetch) {
    try {
        // const feedback = yield call(API.get(config), `/account/order`);
        const feedback = yield call(API.get(config(getCsrfToken())), `/account/order`);
        // const feedback = yield call(axios.get, `https://www.backendexchange.com/api/v2/p2p/account/order`, configs);
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
