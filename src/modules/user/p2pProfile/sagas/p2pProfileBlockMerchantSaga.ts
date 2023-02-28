import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { P2PProfileBlockMerchant, p2pProfileBlockMerchantData, p2pProfileBlockMerchantError } from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* p2pProfileBlockMerchantSaga(actionParam: P2PProfileBlockMerchant) {
    try {
        const { uid, reason, state } = actionParam.payload;
        yield call(API.put(config(getCsrfToken())), `/account/merchants/blocked/${uid}`, {
            reason,
            state,
        });

        yield put(p2pProfileBlockMerchantData());
        yield put(
            alertPush({
                message: state === 'unblocked' ? ['success.merchant.unblocked'] : ['success.merchant.blocked'],
                type: 'success',
            })
        );
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pProfileBlockMerchantError,
                },
            })
        );
    }
}
