import { RootState } from '../..';
import { CommonError } from '../../types';

export const selectP2PUserSetting = (state: RootState): [] => state.user.p2pUserSetting.fetch.data;

export const selectP2PUserSettingLoading = (state: RootState): boolean =>
    state.user.p2pUserSetting.fetch.fetching;

export const selectP2PUserSettingSuccess = (state: RootState): boolean => state.user.p2pUserSetting.fetch.success;

export const selectP2PUserSettingError = (state: RootState): CommonError | undefined =>
    state.user.p2pUserSetting.fetch.error;
