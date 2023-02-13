import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { OrderConfirmPayment, orderConfirmPaymentData, orderConfirmPaymentError } from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* orderConfirmPaymentSaga(action: OrderConfirmPayment) {
    try {
        const payload = yield call(
            API.put(config(getCsrfToken())),
            `/market/orders/payment_confirm/${action.payload.order_number}`,
            action.payload
        );

        yield put(orderConfirmPaymentData(payload));
        yield put(alertPush({ message: ['success.order.confirm.payment'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: orderConfirmPaymentError,
                },
            })
        );
    }
}
