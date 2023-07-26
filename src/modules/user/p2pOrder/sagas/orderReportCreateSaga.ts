import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { OrderReportCreate, orderReportCreateData, orderReportCreateError } from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: {
            'X-CSRF-Token': csrfToken,
            Accept: 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'multipart/form-data',
        },
    };
};

export function* orderReportCreateSaga(actionParam: OrderReportCreate) {
    const { order_number, FormData } = actionParam.payload;
    try {
        yield call(API.post(config(getCsrfToken())), `/market/orders/report/${order_number}`, FormData);
        yield put(orderReportCreateData());
        yield put(alertPush({ message: ['success.order.chat'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: orderReportCreateError,
                },
            })
        );
    }
}
