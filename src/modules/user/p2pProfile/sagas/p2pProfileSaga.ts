import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pProfileData, p2pProfileError, P2PProfileFetch } from '../actions';
import { buildQueryString } from 'src/helpers';

const config: RequestOptions = {
    apiVersion: 'p2p',
};

export function* p2pProfileSaga(action: P2PProfileFetch) {
    try {
        const feedback = yield call(API.get(config), `/account/users`);

        yield put(p2pProfileData(feedback));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pProfileError,
                },
            })
        );
    }
}
