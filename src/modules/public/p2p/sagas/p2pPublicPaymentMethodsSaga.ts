import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pPublicPaymentMethodsData, p2pPublicPaymentMethodsError } from '../actions';

const config: RequestOptions = {
    apiVersion: 'p2p',
    withHeaders: true,
};

export function* p2pPublicPaymentMethodsSaga() {
    try {
        const data = yield call(API.get(config), '/public/payment_methods');
        yield put(p2pPublicPaymentMethodsData(data));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pPublicPaymentMethodsError,
                },
            })
        );
    }
}
