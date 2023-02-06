import { takeEvery, takeLatest } from 'redux-saga/effects';
import { P2P_PROFILE_FETCH } from '../constants';
import { p2pProfileSaga } from './p2pProfileSaga';

export function* rootP2PProfileSaga() {
    yield takeLatest(P2P_PROFILE_FETCH, p2pProfileSaga);
}
