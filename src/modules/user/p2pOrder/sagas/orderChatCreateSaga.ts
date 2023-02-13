import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { OrderChatCreate, orderChatCreateData, orderChatCreateError } from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* orderChatCreateSaga(action: OrderChatCreate) {
    try {
        yield call(
            API.post(config(getCsrfToken())),
            `/market/orders/information_chat/${action.payload.offer_number}`,
            action.payload
        );
        yield put(orderChatCreateData());
        yield put(alertPush({ message: ['success.order.created'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: orderChatCreateError,
                },
            })
        );
    }
}
