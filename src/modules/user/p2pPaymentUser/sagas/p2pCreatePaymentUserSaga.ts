import { call, put } from 'redux-saga/effects';
import { getCsrfToken } from '../../../../helpers';
import { API, RequestOptions } from '../../../../api';
import { alertPush, sendError } from '../../../';
import { P2PPaymentUserCreate, p2pPaymentUserCreateData, p2pPaymentUserCreateError } from '../action';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* p2pCreatePaymentUserSaga(action: P2PPaymentUserCreate) {
    try {
        yield call(API.post(config(getCsrfToken())), `/account/payment`, action.payload);
        yield put(p2pPaymentUserCreateData());
        yield put(alertPush({ message: ['success.feedback.created'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pPaymentUserCreateError,
                },
            })
        );
    }
}
