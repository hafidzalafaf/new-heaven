import { RootState } from '../..';
import { CommonError } from '../../types';
import { P2PUserOffer } from './types';

/* P2P Offers fetch */
export const selectP2PUserAccountOffer = (state: RootState): P2PUserOffer[] => state.user.p2pUserOffer.fetch.list;

export const selectP2PUserOffersAccountLoading = (state: RootState): boolean => state.user.p2pUserOffer.fetch.fetching;

export const selectP2PUserOffersAccountSuccess = (state: RootState): boolean => state.user.p2pUserOffer.fetch.success;

export const selectP2PUserOffersAccountError = (state: RootState): CommonError | undefined => state.user.p2pUserOffer.fetch.error;

export const selectP2PUserAccountOfferCancelSuccess = (state: RootState): boolean => state.user.p2pUserOffer.cancel.success