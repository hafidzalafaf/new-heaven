import { takeEvery, takeLatest } from 'redux-saga/effects';
import {
    P2P_PROFILE_FETCH,
    P2P_PROFILE_CHANGE_USERNAME,
    P2P_PROFILE_BLOCK_MERCHANT,
    P2P_PROFILE_LIST_BLOCK_MERCHANT,
} from '../constants';
import { p2pProfileSaga } from './p2pProfileSaga';
import { p2pProfileChangeUsernameSaga } from './p2pProfileChangeUsernameSaga';
import { p2pProfileBlockMerchantSaga } from './p2pProfileBlockMerchantSaga';
import { p2pProfileListBlockMerchantSaga } from './p2pProfileListBlockMerchantSaga';

export function* rootP2PProfileSaga() {
    yield takeLatest(P2P_PROFILE_FETCH, p2pProfileSaga);
    yield takeEvery(P2P_PROFILE_CHANGE_USERNAME, p2pProfileChangeUsernameSaga);
    yield takeEvery(P2P_PROFILE_BLOCK_MERCHANT, p2pProfileBlockMerchantSaga);
    yield takeEvery(P2P_PROFILE_LIST_BLOCK_MERCHANT, p2pProfileListBlockMerchantSaga);
}
