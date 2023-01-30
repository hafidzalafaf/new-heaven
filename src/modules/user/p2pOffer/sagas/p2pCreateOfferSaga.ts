import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { P2POfferCreate, p2pOfferCreateData, p2pOfferCreateError } from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* p2pCreateOfferSaga(action: P2POfferCreate) {
    try {
        const payload = yield call(API.post(config(getCsrfToken())), `/market/feedback/`);
        yield put(p2pOfferCreateData(payload));
        yield put(alertPush({ message: ['success.feedback.created'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pOfferCreateError,
                },
            })
        );
    }
}
