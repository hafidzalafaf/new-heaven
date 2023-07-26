import { takeEvery, takeLatest } from 'redux-saga/effects';
import { P2P_USER_OFFER_DETAIL_CREATE, P2P_USER_OFFER_DETAIL_FETCH } from '../constants';
import { p2pFetchUserOfferDetailSaga } from './p2pFetchUserOfferDetailSaga';

export function* rootP2PUserOfferDetailSaga() {
    yield takeLatest(P2P_USER_OFFER_DETAIL_FETCH, p2pFetchUserOfferDetailSaga);
}
