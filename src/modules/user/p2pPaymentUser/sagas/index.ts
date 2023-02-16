import { takeEvery, takeLatest } from 'redux-saga/effects';
import { P2P_PAYMENT_USER_CREATE, P2P_PAYMENT_USER_FETCH } from '../constants';
import { p2pCreatePaymentUserSaga } from './p2pCreatePaymentUserSaga';
import { p2pFetchPaymentUserSaga } from './p2pFetchPaymentUserSaga';

export function* rootP2PPaymentUserSaga() {
    yield takeEvery(P2P_PAYMENT_USER_CREATE, p2pCreatePaymentUserSaga);
    yield takeLatest(P2P_PAYMENT_USER_FETCH, p2pFetchPaymentUserSaga);
}
