import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { buildQueryString } from '../../../../helpers';
import { p2pFiatData, p2pFiatError, P2PFiatFetch } from '../actions';
import axios from 'axios';

const config: RequestOptions = {
    apiVersion: 'p2p',
    withHeaders: true,
};

export function* p2pFiatsSaga(action: P2PFiatFetch) {
    try {
        // const data = yield call(axios.get, `http://192.168.1.56:3001/api/v1/public/fiats`);

        const data = yield call(API.get(config), `/public/fiats`);
        yield put(p2pFiatData(data.data));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pFiatError,
                },
            })
        );
    }
}
