import { takeEvery, takeLatest } from 'redux-saga/effects';
import { ORDER_CREATE, ORDER_FETCH, ORDER_DETAIL_FETCH, ORDER_CANCEL, ORDER_CONFIRM_PAYMENT } from '../constants';
import { orderCreateSaga } from './orderCreateSaga';
import { orderSaga } from './orderUserSaga';
import { orderDetailSaga } from './orderDetailSaga';
import { orderCancelSaga } from './orderCancelSaga';
import { orderConfirmPaymentSaga } from './orderConfirmPaymentSaga';

export function* rootP2POrderSaga() {
    yield takeEvery(ORDER_CREATE, orderCreateSaga);
    yield takeLatest(ORDER_FETCH, orderSaga);
    yield takeLatest(ORDER_DETAIL_FETCH, orderDetailSaga);
    yield takeLatest(ORDER_CANCEL, orderCancelSaga);
    yield takeLatest(ORDER_CONFIRM_PAYMENT, orderConfirmPaymentSaga);
}
