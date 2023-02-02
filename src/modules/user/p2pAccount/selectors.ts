import { RootState } from '../..';
import { CommonError } from '../../types';

export const selectP2PAccount = (state: RootState): [] => state.user.p2pOfferAvailable.fetch.data;

export const selectP2PAccountLoading = (state: RootState): boolean =>
    state.user.p2pOfferAvailable.fetch.fetching;

export const selectP2PAccountSuccess = (state: RootState): boolean => state.user.p2pOfferAvailable.fetch.success;

export const selectP2PAccountError = (state: RootState): CommonError | undefined =>
    state.user.p2pOfferAvailable.fetch.error;
