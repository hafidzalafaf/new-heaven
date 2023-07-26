import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { OrderConfirmSell, orderConfirmSellData, orderConfirmSellError } from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* orderConfirmSellSaga(action: OrderConfirmSell) {
    try {
        yield call(API.put(config(getCsrfToken())), `/market/orders/confirm/${action.payload.order_number}`);

        yield put(orderConfirmSellData());
        yield put(alertPush({ message: ['success.order.confirm'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: orderConfirmSellError,
                },
            })
        );
    }
}
