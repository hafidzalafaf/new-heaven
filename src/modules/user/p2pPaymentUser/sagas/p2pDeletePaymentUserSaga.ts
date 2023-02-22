import { call, put } from 'redux-saga/effects';
import { getCsrfToken } from '../../../../helpers';
import { API, RequestOptions } from '../../../../api';
import { alertPush, sendError } from '../../../';
import { P2PPaymentUserDelete, p2pPaymentUserDeleteData, p2pPaymentUserDeleteError } from '../action';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* p2pDeletePaymentUserSaga(action: P2PPaymentUserDelete) {
    try {
        yield call(API.put(config(getCsrfToken())), `/account/payment/delete/${action.payload.payment_id}`);
        yield put(p2pPaymentUserDeleteData());
        yield put(alertPush({ message: ['success.payment.method.deleted'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pPaymentUserDeleteError,
                },
            })
        );
    }
}
