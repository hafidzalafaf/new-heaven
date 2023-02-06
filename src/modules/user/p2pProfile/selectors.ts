import { RootState } from '../..';
import { CommonError } from '../../types';

export const selectP2PProfile = (state: RootState): [] => state.user.p2pProfile.fetch.data;

export const selectP2PProfileLoading = (state: RootState): boolean =>
    state.user.p2pProfile.fetch.fetching;

export const selectP2PProfileSuccess = (state: RootState): boolean => state.user.p2pProfile.fetch.success;

export const selectP2PProfileError = (state: RootState): CommonError | undefined =>
    state.user.p2pProfile.fetch.error;
