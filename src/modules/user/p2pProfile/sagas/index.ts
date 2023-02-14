import { takeEvery, takeLatest } from 'redux-saga/effects';
import { P2P_PROFILE_FETCH, P2P_PROFILE_CHANGE_USERNAME } from '../constants';
import { p2pProfileSaga } from './p2pProfileSaga';
import { p2pProfileChangeUsernameSaga } from './p2pProfileChangeUsernameSaga';

export function* rootP2PProfileSaga() {
    yield takeLatest(P2P_PROFILE_FETCH, p2pProfileSaga);
    yield takeEvery(P2P_PROFILE_CHANGE_USERNAME, p2pProfileChangeUsernameSaga);
}
