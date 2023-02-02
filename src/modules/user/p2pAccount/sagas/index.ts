import { takeEvery, takeLatest } from 'redux-saga/effects';
import { P2P_ACCOUNT_FETCH } from '../constants';
import { p2pAvailableOfferSaga } from './p2pAvailableOfferSaga';

export function* rootP2PAvailableOfferSaga() {
    yield takeLatest(P2P_ACCOUNT_FETCH, p2pAvailableOfferSaga);
}
