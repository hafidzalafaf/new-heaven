import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pPaymentUserData, P2PPaymentUserFetchSingleError, P2PPaymentUserFetchSingle, P2PPaymentUserFetchSingleData, p2pPaymentUserFetchSingleData } from '../action';

const config: RequestOptions = {
    apiVersion: 'p2p',
};

export function* p2pFetchSinglePaymentUserSaga(action: P2PPaymentUserFetchSingle) {
    try {
        const data = yield call(API.get(config), `/account/payment/${action.payload.payment_user_uid}`);
        yield put(p2pPaymentUserFetchSingleData(data));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: P2PPaymentUserFetchSingleError,
                },
            })
        );
    }
}
