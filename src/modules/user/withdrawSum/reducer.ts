import { CommonError } from '../../types';
import { withdrawSumAction } from './actions';
import { WITHDRAW_SUM_DATA, WITHDRAW_SUM_ERROR, WITHDRAW_SUM_FETCH } from './constants';
import { WithdrawSum } from './types';

export interface WithdrawSumState {
    data: WithdrawSum;
    loading: boolean;
    success: boolean;
    error?: CommonError;
}

export const initialWithdrawSumState: WithdrawSumState = {
    data: {
        last_24_hours: '',
        last_1_month: '',
    },
    loading: false,
    success: false,
};

export const withdrawSumReducer = (state = initialWithdrawSumState, action: withdrawSumAction): WithdrawSumState => {
    switch (action.type) {
        case WITHDRAW_SUM_FETCH:
            return {
                ...state,
                loading: true,
            };
        case WITHDRAW_SUM_DATA:
            return {
                ...state,
                loading: false,
                success: true,
                data: action.payload,
            };
        case WITHDRAW_SUM_ERROR:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};
