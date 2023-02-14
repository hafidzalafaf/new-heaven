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

export function* orderChatCreateSaga(actionParam: OrderChatCreate) {
    const { offer_number, message } = actionParam.payload;
    try {
        yield call(API.post(config(getCsrfToken())), `/market/orders/information_chat/${offer_number}`, { message });
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
