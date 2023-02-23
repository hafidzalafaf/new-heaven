import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { OrderReportCreate, orderReportCreateData, orderReportCreateError } from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* orderReportCreateSaga(actionParam: OrderReportCreate) {
    const { order_number, reason, upload_payment } = actionParam.payload;
    try {
        yield call(API.post(config(getCsrfToken())), `/market/orders/report/${order_number}`, {
            reason,
            upload_payment,
        });
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
