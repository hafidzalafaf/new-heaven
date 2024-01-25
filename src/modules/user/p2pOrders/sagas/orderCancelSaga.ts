import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { OrderCancel, orderCancelData, orderCancelError } from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* orderCancelSaga(action: OrderCancel) {
    try {
        yield call(API.put(config(getCsrfToken())), `/market/orders/cancel_order/${action.payload.order_number}`);

        yield put(orderCancelData());
        yield put(alertPush({ message: ['success.order.cancel'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: orderCancelError,
                },
            })
        );
    }
}
