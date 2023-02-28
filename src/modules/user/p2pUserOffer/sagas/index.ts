import { takeEvery, takeLatest } from 'redux-saga/effects';
import { P2P_USER_OFFER_CREATE, P2P_USER_OFFER_FETCH } from '../constants';
import { p2pCreateUserOfferSaga } from './p2pCreateUserOfferSaga';
import { p2pFetchUserOfferSaga } from './p2pFetchUserOfferSaga';

export function* rootP2PUserOfferSaga() {
    yield takeEvery(P2P_USER_OFFER_CREATE, p2pCreateUserOfferSaga);
    yield takeLatest(P2P_USER_OFFER_FETCH, p2pFetchUserOfferSaga);
}
