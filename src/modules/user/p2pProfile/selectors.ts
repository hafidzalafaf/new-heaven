import { RootState } from '../..';
import { CommonError } from '../../types';
import { P2PProfileFetchInterface } from './reducer';

export const selectP2PProfile = (state: RootState): P2PProfileFetchInterface => state.user.p2pProfile.fetch.data;

export const selectP2PProfileLoading = (state: RootState): boolean => state.user.p2pProfile.fetch.fetching;

export const selectP2PProfileSuccess = (state: RootState): boolean => state.user.p2pProfile.fetch.success;

export const selectP2PProfileError = (state: RootState): CommonError | undefined => state.user.p2pProfile.fetch.error;

export const selectP2PProfileChangeUsernameLoading = (state: RootState): boolean =>
    state.user.p2pProfile.changeUsername.fetching;

export const selectP2PProfileChangeUsernameSuccess = (state: RootState): boolean =>
    state.user.p2pProfile.changeUsername.success;

export const selectP2PProfileChangeUsernameError = (state: RootState): CommonError | undefined =>
    state.user.p2pProfile.changeUsername.error;

export const selectP2PProfileBlockMerchantLoading = (state: RootState): boolean =>
    state.user.p2pProfile.block_merchant.fetching;

export const selectP2PProfileBlockMerchantSuccess = (state: RootState): boolean =>
    state.user.p2pProfile.block_merchant.success;

export const selectP2PProfileBlockMerchantError = (state: RootState): CommonError | undefined =>
    state.user.p2pProfile.block_merchant.error;