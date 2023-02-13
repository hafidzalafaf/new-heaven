import { takeEvery, takeLatest } from 'redux-saga/effects';
import {
    ORDER_CREATE,
    ORDER_FETCH,
    ORDER_DETAIL_FETCH,
    ORDER_CANCEL,
    ORDER_CONFIRM,
    ORDER_CONFIRM_PAYMENT,
    ORDER_CHAT,
    ORDER_CHAT_CREATE,
} from '../constants';
import { orderCreateSaga } from './orderCreateSaga';
import { orderSaga } from './orderUserSaga';
import { orderDetailSaga } from './orderDetailSaga';
import { orderCancelSaga } from './orderCancelSaga';
import { orderConfirmSaga } from './orderConfirm';
import { orderConfirmPaymentSaga } from './orderConfirmPaymentSaga';
import { orderChatSaga } from './orderChatSaga';
import { orderChatCreateSaga } from './orderChatCreateSaga';

export function* rootP2POrderSaga() {
    yield takeEvery(ORDER_CREATE, orderCreateSaga);
    yield takeLatest(ORDER_FETCH, orderSaga);
    yield takeLatest(ORDER_DETAIL_FETCH, orderDetailSaga);
    yield takeLatest(ORDER_CANCEL, orderCancelSaga);
    yield takeLatest(ORDER_CONFIRM, orderConfirmSaga);
    yield takeLatest(ORDER_CONFIRM_PAYMENT, orderConfirmPaymentSaga);
    yield takeLatest(ORDER_DETAIL_FETCH, orderDetailSaga);
    yield takeLatest(ORDER_CHAT, orderChatSaga);
    yield takeLatest(ORDER_CHAT_CREATE, orderChatCreateSaga);
}
