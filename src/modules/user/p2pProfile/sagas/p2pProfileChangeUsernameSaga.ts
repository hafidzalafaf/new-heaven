import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { P2PProfileChangeUsername, p2pProfileChangeUsernameData, p2pProfileChangeUsernameError } from '../actions';
import axios from 'axios';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* p2pProfileChangeUsernameSaga(action: P2PProfileChangeUsername) {
    try {
        yield call(API.post(config(getCsrfToken())), `/account/users`, action.payload);
        yield put(p2pProfileChangeUsernameData());
        yield put(alertPush({ message: ['success.username.changed'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pProfileChangeUsernameError,
                },
            })
        );
    }
}
