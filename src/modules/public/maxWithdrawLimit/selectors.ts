import { RootState } from '../..';
import { MaxWithdrawLimitState } from './reducer';
import { MaxWithdrawLimit } from './types';

const selectMaxWithdrawLimitState = (state: RootState): MaxWithdrawLimitState => state.public.maxWithdrawLimit;

export const selectMaxWithdrawLimit = (state: RootState): MaxWithdrawLimit[] => selectMaxWithdrawLimitState(state).list;
