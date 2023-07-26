import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pMerchantDetailData, p2pMerchantDetailError, P2PMerchantDetailFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'p2p',
    withHeaders: true,
};

export function* p2pMerchantDetailSaga(action: P2PMerchantDetailFetch) {
    try {
        const data = yield call(API.get(config), `/public/trades/merchant/${action.payload.uid}`);

        yield put(p2pMerchantDetailData(data));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pMerchantDetailError,
                },
            })
        );
    }
}
