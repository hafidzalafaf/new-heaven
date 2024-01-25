import { RootState } from '../..';
import { CommonError } from '../../types';
import { P2POffer } from './types';

/* P2P Offers fetch */
export const selectP2PAccountOffer = (state: RootState): P2POffer[] => state.user.p2pOffers.fetch.list;

export const selectP2POffersAccountLoading = (state: RootState): boolean => state.user.p2pOffers.fetch.fetching;

export const selectP2POffersAccountSuccess = (state: RootState): boolean => state.user.p2pOffers.fetch.success;

export const selectP2POffersAccountError = (state: RootState): CommonError | undefined =>
    state.user.p2pOffers.fetch.error;

export const selectP2PCreateOfferLoading = (state: RootState): boolean => state.user.p2pOffers.create.fetching;

export const selectP2PCreateOfferSuccess = (state: RootState): boolean => state.user.p2pOffers.create.success;
