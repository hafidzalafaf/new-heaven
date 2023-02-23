import { takeEvery, takeLatest } from 'redux-saga/effects';
import {
    ORDER_CREATE,
    ORDER_FETCH,
    ORDER_DETAIL_FETCH,
    ORDER_CANCEL,
    ORDER_CONFIRM_SELL,
    ORDER_CONFIRM_PAYMENT,
    ORDER_CHAT,
    ORDER_CHAT_CREATE,
    ORDER_REPORT,
    ORDER_REPORT_CREATE,
} from '../constants';
import { orderCreateSaga } from './orderCreateSaga';
import { orderSaga } from './orderUserSaga';
import { orderDetailSaga } from './orderDetailSaga';
import { orderCancelSaga } from './orderCancelSaga';
import { orderConfirmSellSaga } from './orderConfirmSellSaga';
import { orderConfirmPaymentSaga } from './orderConfirmPaymentSaga';
import { orderChatSaga } from './orderChatSaga';
import { orderChatCreateSaga } from './orderChatCreateSaga';
import { orderReportSaga } from './orderReportSaga';
import { orderReportCreateSaga } from './orderReportCreateSaga';

export function* rootP2POrderSaga() {
    yield takeEvery(ORDER_CREATE, orderCreateSaga);
    yield takeLatest(ORDER_FETCH, orderSaga);
    yield takeLatest(ORDER_DETAIL_FETCH, orderDetailSaga);
    yield takeLatest(ORDER_CANCEL, orderCancelSaga);
    yield takeLatest(ORDER_CONFIRM_SELL, orderConfirmSellSaga);
    yield takeLatest(ORDER_CONFIRM_PAYMENT, orderConfirmPaymentSaga);
    yield takeLatest(ORDER_DETAIL_FETCH, orderDetailSaga);
    yield takeLatest(ORDER_CHAT, orderChatSaga);
    yield takeLatest(ORDER_CHAT_CREATE, orderChatCreateSaga);
    yield takeLatest(ORDER_REPORT, orderReportSaga);
    yield takeLatest(ORDER_REPORT_CREATE, orderReportCreateSaga);
}
