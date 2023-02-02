import { RootState } from '../..';
import { CommonError } from '../../types';

export const selectP2PAvailableOffer = (state: RootState): [] => state.user.p2pOfferAvailable.fetch.data;

export const selectP2PAvailableOfferLoading = (state: RootState): boolean =>
    state.user.p2pOfferAvailable.fetch.fetching;

export const selectP2PAvailableOfferSuccess = (state: RootState): boolean => state.user.p2pOfferAvailable.fetch.success;

export const selectP2PAvailableOfferError = (state: RootState): CommonError | undefined =>
    state.user.p2pOfferAvailable.fetch.error;
