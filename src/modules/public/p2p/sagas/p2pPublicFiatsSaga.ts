import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pPublicFiatData, p2pPublicFiatError, P2PPublicFiatFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'p2p',
    withHeaders: true,
};

export function* p2pPublicFiatsSaga(action: P2PPublicFiatFetch) {
    try {
        const data = yield call(API.get(config), `/public/fiats`);
        yield put(p2pPublicFiatData(data.data));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pPublicFiatError,
                },
            })
        );
    }
}
