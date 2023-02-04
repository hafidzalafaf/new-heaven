import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pOfferDetailData, p2pOfferDetailError, P2POfferDetailFetch } from '../actions';
import axios from 'axios';

const config: RequestOptions = {
    apiVersion: 'p2p',
};

export function* p2pOfferDetailSaga(action: P2POfferDetailFetch) {
    try {
        // const data = yield call(API.get(config), '/public/currencies');
        const data = yield call(
            axios.get,
            `https://www.nusaexchange.com/api/v2/p2p/public/trades/detail/${action.payload.offer_number}`
        );

        yield put(p2pOfferDetailData(data));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pOfferDetailError,
                },
            })
        );
    }
}
