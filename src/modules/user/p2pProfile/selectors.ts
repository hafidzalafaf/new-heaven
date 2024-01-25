import { RootState } from '../..';
import { CommonError } from '../../types';
import { P2PProfileFetchInterface } from './reducer';

export const selectP2PProfile = (state: RootState): P2PProfileFetchInterface =>
    state.user.p2pProfile.p2p_profile_fetch.data;

export const selectP2PProfileLoading = (state: RootState): boolean => state.user.p2pProfile.p2p_profile_fetch.fetching;

export const selectP2PProfileSuccess = (state: RootState): boolean => state.user.p2pProfile.p2p_profile_fetch.success;

export const selectP2PProfileError = (state: RootState): CommonError | undefined =>
    state.user.p2pProfile.p2p_profile_fetch.error;

export const selectP2PProfileChangeUsernameLoading = (state: RootState): boolean =>
    state.user.p2pProfile.p2p_profile_change_username.fetching;

export const selectP2PProfileChangeUsernameSuccess = (state: RootState): boolean =>
    state.user.p2pProfile.p2p_profile_change_username.success;

export const selectP2PProfileChangeUsernameError = (state: RootState): CommonError | undefined =>
    state.user.p2pProfile.p2p_profile_change_username.error;

export const selectP2PProfileBlockMerchantLoading = (state: RootState): boolean =>
    state.user.p2pProfile.p2p_profile_block_merchant.fetching;

export const selectP2PProfileBlockMerchantSuccess = (state: RootState): boolean =>
    state.user.p2pProfile.p2p_profile_block_merchant.success;

export const selectP2PProfileBlockMerchantError = (state: RootState): CommonError | undefined =>
    state.user.p2pProfile.p2p_profile_block_merchant.error;

export const selectP2PProfileListBlockMerchant = (state: RootState): any =>
    state.user.p2pProfile.p2p_profile_list_block_merchant.data;

export const selectP2PProfileListBlockMerchantLoading = (state: RootState): boolean =>
    state.user.p2pProfile.p2p_profile_list_block_merchant.fetching;

export const selectP2PProfileListBlockMerchantSuccess = (state: RootState): boolean =>
    state.user.p2pProfile.p2p_profile_list_block_merchant.success;

export const selectP2PProfileListBlockMerchantError = (state: RootState): CommonError | undefined =>
    state.user.p2pProfile.p2p_profile_list_block_merchant.error;
