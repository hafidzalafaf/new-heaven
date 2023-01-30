import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { p2pOfferData, p2pOfferError, P2POfferFetch } from '../actions';
import { buildQueryString } from 'src/helpers';

const config: RequestOptions = {
    apiVersion: 'p2p',
};

export function* p2pFetchOfferSaga(action: P2POfferFetch) {
    try {
        let params = '';
        if (action.payload) {
            params = `?${buildQueryString(action.payload)}`;
        }
        const feedback = yield call(API.get(config), `/market/trades/${params}`);

        yield put(p2pOfferData(feedback));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pOfferError,
                },
            })
        );
    }
}
