import { RootState } from '../../../modules';
import { CommonError } from '../../../modules/types';
import { IPaymentUser } from './types';

export const selectP2PPaymentUser = (state: RootState): [] => state.user.p2pPaymentUser.fetch.data;

export const selectP2PPaymentUserLoading = (state: RootState): boolean => state.user.p2pPaymentUser.fetch.fetching;

export const selectP2PPaymentUserSuccess = (state: RootState): boolean => state.user.p2pPaymentUser.fetch.success;

export const selectP2PPaymentUserError = (state: RootState): CommonError | undefined =>
    state.user.p2pPaymentUser.fetch.error;

export const selectP2PPaymentUserCreateSuccess = (state: RootState): boolean =>
    state.user.p2pPaymentUser.create.success;

export const selectP2PPaymentUserUpdateSuccess = (state: RootState): boolean => state.user.p2pPaymentUser.update.success;

export const selectP2PPaymentUserDeleteSuccess = (state: RootState): boolean => state.user.p2pPaymentUser.delete.success;
