import { takeEvery, takeLatest } from 'redux-saga/effects';
import { P2P_OFFER_CREATE, P2P_OFFER_FETCH } from '../constants';
import { p2pCreateOfferSaga } from './p2pCreateOfferSaga';
import { p2pFetchOfferSaga } from './p2pFetchOfferSaga';

export function* rootP2POffersSaga() {
    yield takeEvery(P2P_OFFER_CREATE, p2pCreateOfferSaga);
    yield takeLatest(P2P_OFFER_FETCH, p2pFetchOfferSaga);
}
