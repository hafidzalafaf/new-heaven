import { takeEvery, takeLatest } from 'redux-saga/effects';
import { ORDER_CREATE, ORDER_FETCH } from '../constants';
import { orderCreateSaga } from './orderCreateSaga';
import { orderDetailSaga } from './orderDetailSaga';

export function* rootP2POrderSaga() {
    yield takeEvery(ORDER_CREATE, orderCreateSaga);
    yield takeLatest(ORDER_FETCH, orderDetailSaga);
}
