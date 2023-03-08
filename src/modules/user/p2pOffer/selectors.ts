import { RootState } from '../../../modules';
import { CommonError } from '../../../modules/types';
import { P2POffer } from './types';

/* P2P Offers fetch */
export const selectP2PAccountOffer = (state: RootState): P2POffer[] => state.user.p2pOffer.fetch.list;

export const selectP2POffersAccountLoading = (state: RootState): boolean => state.user.p2pOffer.fetch.fetching;

export const selectP2POffersAccountSuccess = (state: RootState): boolean => state.user.p2pOffer.fetch.success;

export const selectP2POffersAccountError = (state: RootState): CommonError | undefined =>
    state.user.p2pOffer.fetch.error;

export const selectP2PCreateOfferLoading = (state: RootState): boolean => state.user.p2pOffer.create.fetching;

export const selectP2PCreateOfferSuccess = (state: RootState): boolean => state.user.p2pOffer.create.success;
