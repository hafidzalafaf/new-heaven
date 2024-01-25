import { RootState } from '../..';
import { CommonError } from '../../types';
import { P2PPublicOffer, P2PPublicFiat, P2PPublicPaymentMethod, P2PPublicMerchantDetailInterface } from './types';

/* P2P Offers fetch */
export const selectP2POffers = (state: RootState): P2PPublicOffer[] => state.public.p2p.p2p_public_offers.list;

export const selectP2POffersFetchLoading = (state: RootState): boolean => state.public.p2p.p2p_public_offers.fetching;

export const selectP2POffersFetchSuccess = (state: RootState): boolean => state.public.p2p.p2p_public_offers.success;

export const selectP2POffersFetchError = (state: RootState): CommonError | undefined =>
    state.public.p2p.p2p_public_offers.error;

export const selectP2POffersTimestamp = (state: RootState): number | undefined =>
    state.public.p2p.p2p_public_offers.timestamp;

export const selectShouldFetchP2POffers = (state: RootState): boolean =>
    !selectP2POffersTimestamp(state) && !selectP2POffersFetchLoading(state);

export const selectP2POffersTotalNumber = (state: RootState): number => state.public.p2p.p2p_public_offers.total;

export const selectP2POffersCurrentPage = (state: RootState): number => state.public.p2p.p2p_public_offers.page;

export const selectP2POffersPageCount = (state: RootState, limit): number =>
    Math.ceil(state.public.p2p.p2p_public_offers.total / limit);

export const selectP2POffersFirstElemIndex = (state: RootState, limit): number =>
    state.public.p2p.p2p_public_offers.page * limit + 1;

export const selectP2POffersLastElemIndex = (state: RootState, limit: number): number => {
    if (state.public.p2p.p2p_public_offers.page * limit + limit > selectP2POffersTotalNumber(state)) {
        return selectP2POffersTotalNumber(state);
    } else {
        return state.public.p2p.p2p_public_offers.page * limit + limit;
    }
};

export const selectP2POffersNextPageExists = (state: RootState, limit: number): boolean =>
    state.public.p2p.p2p_public_offers.page + 1 < selectP2POffersPageCount(state, limit);

/* P2P Fiat */
export const selectP2PFiatsData = (state: RootState): P2PPublicFiat[] => state.public.p2p.p2p_public_fiat.data;

export const selectP2PFiatsLoading = (state: RootState): boolean => state.public.p2p.p2p_public_fiat.fetching;

export const selectP2PFiatsSuccess = (state: RootState): boolean => state.public.p2p.p2p_public_fiat.success;

export const selectP2PFiatsError = (state: RootState): CommonError | undefined =>
    state.public.p2p.p2p_public_fiat.error;

export const selectP2PFiatsTimestamp = (state: RootState): number | undefined =>
    state.public.p2p.p2p_public_fiat.timestamp;

export const selectShouldFetchP2PFiats = (state: RootState): boolean =>
    !selectP2PFiatsTimestamp(state) && !selectP2PFiatsLoading(state);

/* P2P Currencies */
export const selectP2PCurrenciesData = (state: RootState): any => state.public.p2p.p2p_public_currencies.data;

export const selectP2PCurrenciesLoading = (state: RootState): boolean =>
    state.public.p2p.p2p_public_currencies.fetching;

export const selectP2PCurrenciesSuccess = (state: RootState): boolean => state.public.p2p.p2p_public_currencies.success;

export const selectP2PCurrenciesError = (state: RootState): CommonError | undefined =>
    state.public.p2p.p2p_public_currencies.error;

export const selectP2PCurrenciesTimestamp = (state: RootState): number | undefined =>
    state.public.p2p.p2p_public_currencies.timestamp;

export const selectShouldFetchP2PCurrencies = (state: RootState): boolean =>
    !selectP2PCurrenciesTimestamp(state) && !selectP2PCurrenciesLoading(state);

/* P2P Payment Methods */
export const selectP2PPaymentMethodsData = (state: RootState): P2PPublicPaymentMethod[] =>
    state.public.p2p.p2p_public_payment_methods.data;

export const selectP2PPaymentMethodsLoading = (state: RootState): boolean =>
    state.public.p2p.p2p_public_payment_methods.fetching;

export const selectP2PPaymentMethodsSuccess = (state: RootState): boolean =>
    state.public.p2p.p2p_public_payment_methods.success;

export const selectP2PPaymentMethodsError = (state: RootState): CommonError | undefined =>
    state.public.p2p.p2p_public_payment_methods.error;

export const selectP2PPaymentMethodsTimestamp = (state: RootState): number | undefined =>
    state.public.p2p.p2p_public_payment_methods.timestamp;

export const selectShouldFetchP2PPaymentMethods = (state: RootState): boolean =>
    !selectP2PPaymentMethodsTimestamp(state) && !selectP2PPaymentMethodsLoading(state);

/* P2P Merchant Detail */

export const selectP2PMerchantDetail = (state: RootState): P2PPublicMerchantDetailInterface =>
    state.public.p2p?.p2p_public_merchant_detail?.data;

export const selectP2PMerchantDetailLoading = (state: RootState): boolean =>
    state.public.p2p.p2p_public_merchant_detail.fetching;

export const selectP2PMerchantDetailSuccess = (state: RootState): boolean =>
    state.public.p2p.p2p_public_merchant_detail.success;

export const selectP2PMerchantDetailError = (state: RootState): CommonError | undefined =>
    state.public.p2p.p2p_public_merchant_detail.error;
