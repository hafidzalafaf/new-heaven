import { MAX_WITHDRAW_LIMIT_DATA } from './constants';
import { MaxWithdrawLimit } from './types';

export interface MaxWithdrawLimitData {
    type: typeof MAX_WITHDRAW_LIMIT_DATA;
    payload: MaxWithdrawLimit[];
}
export type MaxWithdrawLimitAction = MaxWithdrawLimitData;

export const maxWithdrawLimitData = (payload: MaxWithdrawLimitData['payload']): MaxWithdrawLimitData => ({
    type: MAX_WITHDRAW_LIMIT_DATA,
    payload,
});
