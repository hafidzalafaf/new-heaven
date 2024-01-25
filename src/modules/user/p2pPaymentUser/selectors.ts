import { RootState } from '../../../modules';
import { CommonError } from '../../../modules/types';

export const selectP2PPaymentUser = (state: RootState): [] => state.user.p2pPaymentUser.fetch.data;

export const selectP2PPaymentUserLoading = (state: RootState): boolean => state.user.p2pPaymentUser.fetch.fetching;

export const selectP2PPaymentUserSuccess = (state: RootState): boolean => state.user.p2pPaymentUser.fetch.success;

export const selectP2PPaymentUserError = (state: RootState): CommonError | undefined =>
    state.user.p2pPaymentUser.fetch.error;

export const selectP2PPaymentUserCreateSuccess = (state: RootState): boolean =>
    state.user.p2pPaymentUser.create.success;

export const selectP2PPaymentUserUpdateSuccess = (state: RootState): boolean =>
    state.user.p2pPaymentUser.update.success;

export const selectP2PPaymentUserDeleteSuccess = (state: RootState): boolean =>
    state.user.p2pPaymentUser.delete.success;

export const selectP2PPaymentUserSingle = (state: RootState): {} => state.user.p2pPaymentUser.fetchSingle.data;

export const selectP2PPaymentUserSingleLoading = (state: RootState): boolean =>
    state.user.p2pPaymentUser.fetchSingle.fetching;

export const selectP2PPaymentUserSingleError = (state: RootState): CommonError | undefined =>
    state.user.p2pPaymentUser.fetchSingle.error;
