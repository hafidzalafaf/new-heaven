import { RootState } from '../../';
import { CommonError } from '../../types';
import { WithdrawSum } from './types';

export const selectWithdrawSum = (state: RootState): WithdrawSum => state.user.withdrawSum?.data;

// export const selectWithdrawSumLoading = (state: RootState): boolean => state.user.withdrawSum.loading;

// export const selectWithdrawSumSuccess = (state: RootState): boolean => state.user.withdrawSum.success;

// export const selectWithdrawSumError = (state: RootState): CommonError | undefined => state.user.withdrawSum.error;
