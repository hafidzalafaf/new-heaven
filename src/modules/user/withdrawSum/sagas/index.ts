import { takeLatest } from 'redux-saga/effects';
import { WITHDRAW_SUM_FETCH } from '../constants';
import { withdrawSumSaga } from './withdrawSumSaga';

export function* rootWithdrawSumSaga() {
    yield takeLatest(WITHDRAW_SUM_FETCH, withdrawSumSaga);
}
