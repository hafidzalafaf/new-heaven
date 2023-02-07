import { CommonState } from '../../types';
import { MaxWithdrawLimitAction } from './actions';
import { MAX_WITHDRAW_LIMIT_DATA } from './constants';
import { MaxWithdrawLimit } from './types';

export interface MaxWithdrawLimitState extends CommonState {
    list: MaxWithdrawLimit[];
}

export const initialMaxWithdrawLimitState: MaxWithdrawLimitState = {
    list: [],
};

export const maxWithdrawLimitReducer = (state = initialMaxWithdrawLimitState, action: MaxWithdrawLimitAction) => {
    switch (action.type) {
        case MAX_WITHDRAW_LIMIT_DATA:
            return {
                ...state,
                list: action.payload,
            };
        default:
            return state;
    }
};
