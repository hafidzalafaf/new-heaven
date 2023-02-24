import { takeEvery, takeLatest } from 'redux-saga/effects';
import {
    P2P_PAYMENT_USER_FETCH,
    P2P_PAYMENT_USER_FETCH_SINGLE,
    P2P_PAYMENT_USER_CREATE,
    P2P_PAYMENT_USER_UPDATE,
    P2P_PAYMENT_USER_DELETE,
} from '../constants';
import { p2pFetchPaymentUserSaga } from './p2pFetchPaymentUserSaga';
import { p2pCreatePaymentUserSaga } from './p2pCreatePaymentUserSaga';
import { p2pUpdatePaymentUserSaga } from './p2pUpdatePaymentUserSaga';
import { p2pDeletePaymentUserSaga } from './p2pDeletePaymentUserSaga';
import { p2pFetchSinglePaymentUserSaga } from './p2pFetchSinglePaymentUserSaga';

export function* rootP2PPaymentUserSaga() {
    yield takeLatest(P2P_PAYMENT_USER_FETCH, p2pFetchPaymentUserSaga);
    takeLatest(P2P_PAYMENT_USER_FETCH_SINGLE, p2pFetchSinglePaymentUserSaga);
    yield takeEvery(P2P_PAYMENT_USER_CREATE, p2pCreatePaymentUserSaga);
    yield takeEvery(P2P_PAYMENT_USER_UPDATE, p2pUpdatePaymentUserSaga);
    yield takeEvery(P2P_PAYMENT_USER_DELETE, p2pDeletePaymentUserSaga);
}
