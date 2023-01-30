import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { OrderCreate, orderCreateData, OrderCreateData, orderCreateError, OrderCreateError } from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* orderCreateSaga(action: OrderCreateData) {
    try {
        const payload = yield call(API.post(config(getCsrfToken())), `/market/orders`, action.payload);
        yield put(orderCreateData(payload));
        yield put(alertPush({ message: ['success.feedback.created'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: orderCreateError,
                },
            })
        );
    }
}
