import { CommonError } from '../../types';
import {
    P2P_PUBLIC_CURRENCIES_DATA,
    P2P_PUBLIC_CURRENCIES_ERROR,
    P2P_PUBLIC_CURRENCIES_FETCH,
    P2P_PUBLIC_FIAT_DATA,
    P2P_PUBLIC_FIAT_ERROR,
    P2P_PUBLIC_FIAT_FETCH,
    P2P_PUBLIC_MERCHANT_DETAIL_DATA,
    P2P_PUBLIC_MERCHANT_DETAIL_ERROR,
    P2P_PUBLIC_MERCHANT_DETAIL_FETCH,
    P2P_PUBLIC_OFFERS_DATA,
    P2P_PUBLIC_OFFERS_ERROR,
    P2P_PUBLIC_OFFERS_FETCH,
    P2P_PUBLIC_PAYMENT_METHODS_DATA,
    P2P_PUBLIC_PAYMENT_METHODS_ERROR,
    P2P_PUBLIC_PAYMENT_METHODS_FETCH,
    P2P_PUBLIC_OFFER_DETAIL_DATA,
    P2P_PUBLIC_OFFER_DETAIL_ERROR,
    P2P_PUBLIC_OFFER_DETAIL_FETCH,
} from './constants';
import {
    P2PPublicOffer,
    P2PPublicCurrency,
    P2PPublicFiat,
    P2PPublicMerchantDetailInterface,
    P2PPublicPaymentMethod,
} from './types';

export interface P2PPublicCurrenciesFetch {
    type: typeof P2P_PUBLIC_CURRENCIES_FETCH;
    payload?: {
        fiat: string;
    };
}

export interface P2PPublicCurrenciesData {
    type: typeof P2P_PUBLIC_CURRENCIES_DATA;
    payload: P2PPublicCurrency;
}

export interface P2PPublicCurrenciesError {
    type: typeof P2P_PUBLIC_CURRENCIES_ERROR;
    error: CommonError;
}

export interface P2PPublicFiatFetch {
    type: typeof P2P_PUBLIC_FIAT_FETCH;
}

export interface P2PPublicFiatData {
    type: typeof P2P_PUBLIC_FIAT_DATA;
    payload: P2PPublicFiat[];
}

export interface P2PPublicFiatError {
    type: typeof P2P_PUBLIC_FIAT_ERROR;
    error: CommonError;
}

export interface P2PPublicMerchantDetailFetch {
    type: typeof P2P_PUBLIC_MERCHANT_DETAIL_FETCH;
    payload: {
        uid: string;
    };
}

export interface P2PPublicMerchantDetailData {
    type: typeof P2P_PUBLIC_MERCHANT_DETAIL_DATA;
    payload: {
        data: P2PPublicMerchantDetailInterface[];
    };
}

export interface P2PPublicMerchantDetailError {
    type: typeof P2P_PUBLIC_MERCHANT_DETAIL_ERROR;
    error: CommonError;
}

export interface P2PPublicOfferDetailFetch {
    type: typeof P2P_PUBLIC_OFFER_DETAIL_FETCH;
    payload: {
        offer_number: string | number;
    };
}

export interface P2PPublicOfferDetailData {
    type: typeof P2P_PUBLIC_OFFER_DETAIL_DATA;
    payload: {
        data: [];
    };
}

export interface P2PPublicOfferDetailError {
    type: typeof P2P_PUBLIC_OFFER_DETAIL_ERROR;
    error: CommonError;
}

export interface P2PPublicOffersFetch {
    type: typeof P2P_PUBLIC_OFFERS_FETCH;
    payload: {
        page?: number;
        limit?: number;
        side?: string;
        fiat?: string;
        currency?: string;
        sort?: string;
        base?: string;
        quote?: string;
        payment_method?: number;
        amount?: string;
        min_price?: string;
        max_price?: string;
    };
}

export interface P2PPublicOffersData {
    type: typeof P2P_PUBLIC_OFFERS_DATA;
    payload: {
        list: P2PPublicOffer[];
        page: number;
        total: number;
        side: string;
        sort?: string;
        base: string;
        quote: string;
        payment_method?: number;
    };
}

export interface P2PPublicOffersError {
    type: typeof P2P_PUBLIC_OFFERS_ERROR;
    error: CommonError;
}

export interface P2PPublicPaymentMethodsFetch {
    type: typeof P2P_PUBLIC_PAYMENT_METHODS_FETCH;
}

export interface P2PPublicPaymentMethodsData {
    type: typeof P2P_PUBLIC_PAYMENT_METHODS_DATA;
    payload: P2PPublicPaymentMethod[];
}

export interface P2PPublicPaymentMethodsError {
    type: typeof P2P_PUBLIC_PAYMENT_METHODS_ERROR;
    error: CommonError;
}

export type P2PActions =
    | P2PPublicCurrenciesFetch
    | P2PPublicCurrenciesData
    | P2PPublicCurrenciesError
    | P2PPublicFiatFetch
    | P2PPublicFiatData
    | P2PPublicFiatError
    | P2PPublicMerchantDetailData
    | P2PPublicMerchantDetailError
    | P2PPublicMerchantDetailFetch
    | P2PPublicOfferDetailData
    | P2PPublicOfferDetailError
    | P2PPublicOfferDetailFetch
    | P2PPublicOffersFetch
    | P2PPublicOffersData
    | P2PPublicOffersError
    | P2PPublicPaymentMethodsFetch
    | P2PPublicPaymentMethodsData
    | P2PPublicPaymentMethodsError;

export const p2pPublicCurrenciesFetch = (payload: P2PPublicCurrenciesFetch['payload']): P2PPublicCurrenciesFetch => ({
    type: P2P_PUBLIC_CURRENCIES_FETCH,
    payload,
});

export const p2pPublicCurrenciesData = (payload: P2PPublicCurrenciesData['payload']): P2PPublicCurrenciesData => ({
    type: P2P_PUBLIC_CURRENCIES_DATA,
    payload,
});

export const p2pPublicCurrenciesError = (error: CommonError): P2PPublicCurrenciesError => ({
    type: P2P_PUBLIC_CURRENCIES_ERROR,
    error,
});

export const p2pPublicFiatFetch = (): P2PPublicFiatFetch => ({
    type: P2P_PUBLIC_FIAT_FETCH,
});

export const p2pPublicFiatData = (payload: P2PPublicFiatData['payload']): P2PPublicFiatData => ({
    type: P2P_PUBLIC_FIAT_DATA,
    payload,
});

export const p2pPublicFiatError = (error: CommonError): P2PPublicFiatError => ({
    type: P2P_PUBLIC_FIAT_ERROR,
    error,
});

export const p2pPublicMerchantDetailFetch = (
    payload?: P2PPublicMerchantDetailFetch['payload']
): P2PPublicMerchantDetailFetch => ({
    type: P2P_PUBLIC_MERCHANT_DETAIL_FETCH,
    payload,
});

export const p2pPublicMerchantDetailData = (
    payload?: P2PPublicMerchantDetailData['payload']
): P2PPublicMerchantDetailData => ({
    type: P2P_PUBLIC_MERCHANT_DETAIL_DATA,
    payload,
});

export const p2pPublicMerchantDetailError = (error: CommonError): P2PPublicMerchantDetailError => ({
    type: P2P_PUBLIC_MERCHANT_DETAIL_ERROR,
    error,
});

export const p2pPublicOfferDetailFetch = (
    payload?: P2PPublicOfferDetailFetch['payload']
): P2PPublicOfferDetailFetch => ({
    type: P2P_PUBLIC_OFFER_DETAIL_FETCH,
    payload,
});

export const p2pPublicOfferDetailData = (payload?: P2PPublicOfferDetailData['payload']): P2PPublicOfferDetailData => ({
    type: P2P_PUBLIC_OFFER_DETAIL_DATA,
    payload,
});

export const p2pPublicOfferDetailError = (error: CommonError): P2PPublicOfferDetailError => ({
    type: P2P_PUBLIC_OFFER_DETAIL_ERROR,
    error,
});

export const p2pPublicOffersFetch = (payload?: P2PPublicOffersFetch['payload']): P2PPublicOffersFetch => ({
    type: P2P_PUBLIC_OFFERS_FETCH,
    payload,
});

export const p2pPublicOffersData = (payload: P2PPublicOffersData['payload']): P2PPublicOffersData => ({
    type: P2P_PUBLIC_OFFERS_DATA,
    payload,
});

export const p2pPublicOffersError = (error: CommonError): P2PPublicOffersError => ({
    type: P2P_PUBLIC_OFFERS_ERROR,
    error,
});

export const p2pPublicPaymentMethodsFetch = (): P2PPublicPaymentMethodsFetch => ({
    type: P2P_PUBLIC_PAYMENT_METHODS_FETCH,
});

export const p2pPublicPaymentMethodsData = (
    payload: P2PPublicPaymentMethodsData['payload']
): P2PPublicPaymentMethodsData => ({
    type: P2P_PUBLIC_PAYMENT_METHODS_DATA,
    payload,
});

export const p2pPublicPaymentMethodsError = (error: CommonError): P2PPublicPaymentMethodsError => ({
    type: P2P_PUBLIC_PAYMENT_METHODS_ERROR,
    error,
});
