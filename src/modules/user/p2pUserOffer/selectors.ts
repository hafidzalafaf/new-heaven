import { RootState } from '../..';
import { CommonError } from '../../types';
import { P2PUserOffer, P2PUserOfferList } from './types';

/* P2P Offers fetch */
export const selectP2PUserAccountOffer = (state: RootState): [] => state.user.p2pUserOffer.fetch.list;

export const selectP2PUserOffersAccountLoading = (state: RootState): boolean => state.user.p2pUserOffer.fetch.fetching;

export const selectP2PUserOffersAccountSuccess = (state: RootState): boolean => state.user.p2pUserOffer.fetch.success;

export const selectP2PUserOffersAccountError = (state: RootState): CommonError | undefined =>
    state.user.p2pUserOffer.fetch.error;

export const selectP2PUserAccountOfferCancelSuccess = (state: RootState): boolean =>
    state.user.p2pUserOffer.cancel.success;

export const selectP2PUserAccountOfferNextPageExists = (state: RootState): boolean =>
    state.user.p2pUserOffer.fetch.nextPageExists;

export const selectP2PUserAccountOfferPage = (state: RootState): number => state.user.p2pUserOffer.fetch.page;
