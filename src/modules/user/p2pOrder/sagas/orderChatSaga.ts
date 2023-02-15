import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { orderChatData, orderChatError, OrderChat } from '../actions';
import { getCsrfToken } from '../../../../helpers';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* orderChatSaga(action: OrderChat) {
    try {
        const feedback = yield call(
            API.get(config(getCsrfToken())),
            `/market/orders/information_chat/${action.payload.offer_number}`
        );
        yield put(orderChatData(feedback));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: orderChatError,
                },
            })
        );
    }
}
