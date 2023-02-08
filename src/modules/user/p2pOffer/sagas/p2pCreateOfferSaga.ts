import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { P2POfferCreate, p2pOfferCreateData, p2pOfferCreateError } from '../actions';
import axios from 'axios';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* p2pCreateOfferSaga(action: P2POfferCreate) {
    try {
        yield call(API.post(config(getCsrfToken())), `/market/trades`, action.payload);
        yield put(p2pOfferCreateData());
        yield put(alertPush({ message: ['success.offer.created'], type: 'success' }));
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
