import { takeEvery, takeLatest } from 'redux-saga/effects';
import { ORDER_CONFIRM_CREATE, ORDER_CONFIRM_LAST, ORDER_CONFIRM_CANCEL } from '../constants';
import { orderConfirmCreateSaga } from './orderConfirmSaga';
import { orderConfirmLastSaga } from './lastConfirmSaga';
import { orderConfirmCancelSaga } from './cancelOrderSaga';

export function* rootP2POrderConfirmationSaga() {
    yield takeEvery(ORDER_CONFIRM_CREATE, orderConfirmCreateSaga);
    yield takeLatest(ORDER_CONFIRM_LAST, orderConfirmLastSaga);
    yield takeEvery(ORDER_CONFIRM_CANCEL, orderConfirmCancelSaga);
}
