import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pMerchantDetailData, p2pMerchantDetailError, P2PMerchantDetailFetch } from '../actions';
import axios from 'axios';

const config: RequestOptions = {
    apiVersion: 'p2p',
};

export function* p2pMerchantDetailSaga(action: P2PMerchantDetailFetch) {
    try {
        const data = yield call(API.get(config), `/public/trades/merchant/${action.payload.merchant}`);
        // const data = yield call(
        //     axios.get,
        //     `http://192.168.1.56:3001/api/v1/public/trades/merchant/${action.payload.merchant}`
        // );

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
