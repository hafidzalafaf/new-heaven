import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { withdrawSumData, withdrawSumError, WithdrawSumFetch } from '../actions';

const withdrawOption: RequestOptions = {
    apiVersion: 'exchange',
};

export function* withdrawSumSaga(action: WithdrawSumFetch) {
    try {
        const withdrawSum = yield call(API.get(withdrawOption), '/account/withdraws/sums');
        yield put(withdrawSumData(withdrawSum));
    } catch (error) {
        if (error && error.message && error.message[0] == 'account.withdraw.not_permitted') {
            yield put(
                sendError({
                    error,
                    processingType: 'console',
                    extraOptions: {
                        actionError: withdrawSumError,
                    },
                })
            );
        } else {
            yield put(
                sendError({
                    error,
                    processingType: 'alert',
                    extraOptions: {
                        actionError: withdrawSumError,
                    },
                })
            );
        }
    }
}
