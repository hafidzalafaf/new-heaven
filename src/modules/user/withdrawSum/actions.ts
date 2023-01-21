import { CommonError } from '../../types';
import { WITHDRAW_SUM_DATA, WITHDRAW_SUM_ERROR, WITHDRAW_SUM_FETCH } from './constants';
import { WithdrawSum } from './types';

export interface WithdrawSumFetch {
    type: typeof WITHDRAW_SUM_FETCH;
}

export interface WithdrawSumData {
    type: typeof WITHDRAW_SUM_DATA;
    payload: WithdrawSum;
}

export interface WithdrawSumError {
    type: typeof WITHDRAW_SUM_ERROR;
    error: CommonError;
}

export type withdrawSumAction = WithdrawSumFetch | WithdrawSumData | WithdrawSumError;

export const withdrawSumFetch = (): WithdrawSumFetch => ({
    type: WITHDRAW_SUM_FETCH,
});

export const withdrawSumData = (payload: WithdrawSumData['payload']): WithdrawSumData => ({
    type: WITHDRAW_SUM_DATA,
    payload,
});

export const withdrawSumError = (error: CommonError): WithdrawSumError => ({
    type: WITHDRAW_SUM_ERROR,
    error,
});
