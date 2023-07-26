import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { orderReportData, orderReportError, OrderReport } from '../actions';
import { getCsrfToken } from '../../../../helpers';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* orderReportSaga(action: OrderReport) {
    try {
        const feedback = yield call(
            API.get(config(getCsrfToken())),
            `/market/orders/report/${action.payload.order_number}`
        );
        yield put(orderReportData(feedback));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: orderReportError,
                },
            })
        );
    }
}
