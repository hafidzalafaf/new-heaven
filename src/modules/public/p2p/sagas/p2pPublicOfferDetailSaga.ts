import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pPublicOfferDetailData, p2pPublicOfferDetailError, P2PPublicOfferDetailFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'p2p',
    withHeaders: true,
};

export function* p2pPublicOfferDetailSaga(action: P2PPublicOfferDetailFetch) {
    try {
        const data = yield call(API.get(config), `/public/trades/detail/${action.payload.offer_number}`);

        yield put(p2pPublicOfferDetailData(data));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pPublicOfferDetailError,
                },
            })
        );
    }
}
