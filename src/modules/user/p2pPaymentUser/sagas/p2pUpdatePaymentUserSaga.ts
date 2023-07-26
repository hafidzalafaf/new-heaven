import { call, put } from 'redux-saga/effects';
import { getCsrfToken } from '../../../../helpers';
import { API, RequestOptions } from '../../../../api';
import { alertPush, sendError } from '../../../';
import { P2PPaymentUserUpdate, p2pPaymentUserUpdateData, p2pPaymentUserUpdateError } from '../action';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* p2pUpdatePaymentUserSaga(actionParam: P2PPaymentUserUpdate) {
    const payload = actionParam.payload
    try {
        yield call(API.post(config(getCsrfToken())), `/account/payment/update/${actionParam.payment_id}`, actionParam.payload);
        yield put(p2pPaymentUserUpdateData());
        yield put(alertPush({ message: ['success.payment.method.updated'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pPaymentUserUpdateError,
                },
            })
        );
    }
}
