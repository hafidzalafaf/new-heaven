import { takeEvery, takeLatest } from 'redux-saga/effects';
import { P2P_ACCOUNT_FETCH } from '../constants';
import { p2pAccountSaga } from './p2pAccountSaga';

export function* rootP2PAccountSaga() {
    yield takeLatest(P2P_ACCOUNT_FETCH, p2pAccountSaga);
}
