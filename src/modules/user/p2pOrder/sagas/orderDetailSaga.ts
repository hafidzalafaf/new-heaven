import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { orderDetailData, orderDetailError, OrderDetailFetch } from '../actions';
import { buildQueryString } from '../../../../helpers';

const config: RequestOptions = {
    apiVersion: 'p2p',
};

export function* orderDetailSaga(action: OrderDetailFetch) {
    try {
        let params = '';
        if (action.payload) {
            params = `?${buildQueryString(action.payload)}`;
        }
        const feedback = yield call(API.get(config), `/market/orders/${params}`);
        yield put(orderDetailData(feedback));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: orderDetailError,
                },
            })
        );
    }
}
