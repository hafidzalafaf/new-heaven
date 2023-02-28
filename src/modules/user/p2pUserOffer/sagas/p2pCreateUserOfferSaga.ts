import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { P2PUserOfferCreate, p2pUserOfferCreateData, p2pUserOfferCreateError } from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* p2pCreateUserOfferSaga(action: P2PUserOfferCreate) {
    try {
        yield call(API.post(config(getCsrfToken())), `/market/trades`, action.payload);
        yield put(p2pUserOfferCreateData());
        yield put(alertPush({ message: ['success.offer.created'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pUserOfferCreateError,
                },
            })
        );
    }
}
