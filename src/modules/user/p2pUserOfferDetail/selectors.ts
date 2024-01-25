import { RootState } from '../..';
import { CommonError } from '../../types';
import { P2PUserOfferDetail } from './types';

/* P2P Offers fetch */
export const selectP2PUserAccountOfferDetail = (state: RootState): P2PUserOfferDetail =>
    state.user.p2pUserOfferDetail.p2p_user_offer_detail_fetch.list;

export const selectP2PUserOfferDetailsAccountLoading = (state: RootState): boolean =>
    state.user.p2pUserOfferDetail.p2p_user_offer_detail_fetch.fetching;

export const selectP2PUserOfferDetailsAccountSuccess = (state: RootState): boolean =>
    state.user.p2pUserOfferDetail.p2p_user_offer_detail_fetch.success;

export const selectP2PUserOfferDetailsAccountError = (state: RootState): CommonError | undefined =>
    state.user.p2pUserOfferDetail.p2p_user_offer_detail_fetch.error;
