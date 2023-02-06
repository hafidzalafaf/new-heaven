import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { orderData, orderError, OrderFetch } from '../actions';
import { buildQueryString } from '../../../../helpers';

const config: RequestOptions = {
    apiVersion: 'p2p',
};

export function* orderSaga(action: OrderFetch) {
    try {
        const feedback = yield call(API.get(config), `/account/order`);
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
