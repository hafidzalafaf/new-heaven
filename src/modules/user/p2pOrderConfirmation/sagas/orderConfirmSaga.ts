import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { buildQueryString } from '../../../../helpers';
import { OrderConfirmCreate, orderConfirmCreateData, orderConfirmCreateError } from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* orderConfirmCreateSaga(action: OrderConfirmCreate) {
    try {
        let params = '';
        if (action.payload) {
            params = `?${buildQueryString(action.payload)}`;
        }
        const payload = yield call(
            API.post(config(getCsrfToken())),
            `/market/orders/payment_confirm/${params}`,
            action.payload
        );

        yield put(orderConfirmCreateData(payload));
        yield put(alertPush({ message: ['success.order.confirm.created'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: orderConfirmCreateError,
                },
            })
        );
    }
}
