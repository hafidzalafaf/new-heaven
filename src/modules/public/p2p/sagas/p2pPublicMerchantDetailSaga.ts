import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pPublicMerchantDetailData, p2pPublicMerchantDetailError, P2PPublicMerchantDetailFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'p2p',
    withHeaders: true,
};

export function* p2pPublicMerchantDetailSaga(action: P2PPublicMerchantDetailFetch) {
    try {
        const data = yield call(API.get(config), `/public/trades/merchant/${action.payload.uid}`);

        yield put(p2pPublicMerchantDetailData(data));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pPublicMerchantDetailError,
                },
            })
        );
    }
}
