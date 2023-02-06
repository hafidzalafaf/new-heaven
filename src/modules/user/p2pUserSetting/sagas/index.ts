import { takeEvery, takeLatest } from 'redux-saga/effects';
import { P2P_USER_SETTING_FETCH } from '../constants';
import { p2pUserSettingSaga } from './p2pUserSettingSaga';

export function* rootP2PUserSettingSaga() {
    yield takeLatest(P2P_USER_SETTING_FETCH, p2pUserSettingSaga);
}
