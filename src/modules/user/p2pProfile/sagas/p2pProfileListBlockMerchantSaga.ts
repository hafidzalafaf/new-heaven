import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import {
    p2pProfileListBlockMerchantData,
    p2pProfileListBlockMerchantError,
    P2PProfileListBlockMerchant,
} from '../actions';

const config: RequestOptions = {
    apiVersion: 'p2p',
};

export function* p2pProfileListBlockMerchantSaga(action: P2PProfileListBlockMerchant) {
    try {
        const response = yield call(API.get(config), `/account/users/blocked`);
        yield put(p2pProfileListBlockMerchantData(response));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pProfileListBlockMerchantError,
                },
            })
        );
    }
}
