import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { OrderConfirm, orderConfirmData, orderConfirmError } from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* orderConfirmSaga(action: OrderConfirm) {
    try {
        const payload = yield call(
            API.put(config(getCsrfToken())),
            `/market/orders/confirm/${action.payload.order_number}`,
            action.payload
        );

        yield put(orderConfirmData(payload));
        yield put(alertPush({ message: ['success.order.confirm'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: orderConfirmError,
                },
            })
        );
    }
}
