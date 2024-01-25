import { defaultStorageLimit } from 'src/api';
import { sliceArray } from 'src/helpers';
import { CommonError } from '../../types';
import { P2PActions } from './actions';
import {
    P2P_PUBLIC_CURRENCIES_DATA,
    P2P_PUBLIC_CURRENCIES_ERROR,
    P2P_PUBLIC_CURRENCIES_FETCH,
    P2P_PUBLIC_FIAT_DATA,
    P2P_PUBLIC_FIAT_FETCH,
    P2P_PUBLIC_FIAT_ERROR,
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
    P2PPublicPaymentMethod,
    P2PPublicMerchantDetailInterface,
} from './types';

export interface P2PState {
    p2p_public_currencies: {
        data: P2PPublicCurrency[];
        fetching: boolean;
        success: boolean;
        timestamp?: number | undefined;
        error?: CommonError | undefined;
    };
    p2p_public_fiat: {
        data: P2PPublicFiat[];
        fetching: boolean;
        success: boolean;
        timestamp?: number | undefined;
        error?: CommonError | undefined;
    };
    p2p_public_merchant_detail: {
        data: P2PPublicMerchantDetailInterface;
        fetching: boolean;
        success: boolean;
        timestamp?: number | undefined;
        error?: CommonError | undefined;
    };
    p2p_public_offer_detail: {
        data: any;
        fetching: boolean;
        success: boolean;
        timestamp?: number | undefined;
        error?: CommonError | undefined;
    };
    p2p_public_offers: {
        page: number;
        total: number;
        list: P2PPublicOffer[];
        side: string;
        base: string;
        quote: string;
        payment_method?: number;
        fetching: boolean;
        success: boolean;
        timestamp?: number | undefined;
        error?: CommonError | undefined;
    };
    p2p_public_payment_methods: {
        data: P2PPublicPaymentMethod[];
        fetching: boolean;
        success: boolean;
        timestamp?: number | undefined;
        error?: CommonError | undefined;
    };
}

export const initialP2PState: P2PState = {
    p2p_public_currencies: {
        data: [],
        fetching: false,
        success: false,
    },
    p2p_public_fiat: {
        data: [],
        fetching: false,
        success: false,
    },
    p2p_public_merchant_detail: {
        data: {
            merchant: {},
            feedbacks: [],
        },
        fetching: false,
        success: false,
    },
    p2p_public_offer_detail: {
        data: [],
        fetching: false,
        success: false,
    },
    p2p_public_offers: {
        page: 0,
        total: 0,
        list: [],
        side: '',
        base: '',
        quote: '',
        fetching: false,
        success: false,
    },
    p2p_public_payment_methods: {
        data: [],
        fetching: false,
        success: false,
    },
};

const p2pPublicCurrenciesReducer = (state: P2PState['p2p_public_currencies'], action: P2PActions) => {
    switch (action.type) {
        case P2P_PUBLIC_CURRENCIES_FETCH:
            return {
                ...state,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_PUBLIC_CURRENCIES_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_PUBLIC_CURRENCIES_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

const p2pPublicFiatsReducer = (state: P2PState['p2p_public_fiat'], action: P2PActions) => {
    switch (action.type) {
        case P2P_PUBLIC_FIAT_FETCH:
            return {
                ...state,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_PUBLIC_FIAT_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_PUBLIC_FIAT_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

const p2pPublicMerchantDetailReducer = (state: P2PState['p2p_public_merchant_detail'], action: P2PActions) => {
    switch (action.type) {
        case P2P_PUBLIC_MERCHANT_DETAIL_FETCH:
            return {
                ...state,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_PUBLIC_MERCHANT_DETAIL_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_PUBLIC_MERCHANT_DETAIL_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

const p2pPublicOfferDetailReducer = (state: P2PState['p2p_public_offer_detail'], action: P2PActions) => {
    switch (action.type) {
        case P2P_PUBLIC_OFFER_DETAIL_FETCH:
            return {
                ...state,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_PUBLIC_OFFER_DETAIL_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_PUBLIC_OFFER_DETAIL_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export const p2pPublicOffersFetchReducer = (state: P2PState['p2p_public_offers'], action: P2PActions) => {
    switch (action.type) {
        case P2P_PUBLIC_OFFERS_FETCH:
            return {
                ...state,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_PUBLIC_OFFERS_DATA:
            return {
                ...state,
                list: sliceArray(action.payload.list, defaultStorageLimit()),
                page: action.payload.page,
                total: action.payload.total,
                side: action.payload.side,
                base: action.payload.base,
                quote: action.payload.quote,
                payment_method: action.payload.payment_method,
                fetching: false,
                success: true,
                error: undefined,
            };

        case P2P_PUBLIC_OFFERS_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                page: 0,
                side: '',
                total: 0,
                list: [],
                error: action.error,
            };
        default:
            return state;
    }
};

const p2pPublicPaymentMethodsReducer = (state: P2PState['p2p_public_payment_methods'], action: P2PActions) => {
    switch (action.type) {
        case P2P_PUBLIC_PAYMENT_METHODS_FETCH:
            return {
                ...state,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_PUBLIC_PAYMENT_METHODS_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_PUBLIC_PAYMENT_METHODS_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export const p2pReducer = (state = initialP2PState, action: P2PActions) => {
    switch (action.type) {
        case P2P_PUBLIC_CURRENCIES_FETCH:
        case P2P_PUBLIC_CURRENCIES_DATA:
        case P2P_PUBLIC_CURRENCIES_ERROR:
            const p2pPublicCurrenciesState = { ...state.p2p_public_currencies };

            return {
                ...state,
                p2pPublicCurrencies: p2pPublicCurrenciesReducer(p2pPublicCurrenciesState, action),
            };

        case P2P_PUBLIC_FIAT_FETCH:
        case P2P_PUBLIC_FIAT_DATA:
        case P2P_PUBLIC_FIAT_ERROR:
            const p2pPublicFiatState = { ...state.p2p_public_fiat };

            return {
                ...state,
                p2p_public_fiat: p2pPublicFiatsReducer(p2pPublicFiatState, action),
            };

        case P2P_PUBLIC_MERCHANT_DETAIL_FETCH:
        case P2P_PUBLIC_MERCHANT_DETAIL_DATA:
        case P2P_PUBLIC_MERCHANT_DETAIL_ERROR:
            const p2pPublicMerchantDetailState = { ...state.p2p_public_merchant_detail };

            return {
                ...state,
                p2pPublicMerchantDetail: p2pPublicMerchantDetailReducer(p2pPublicMerchantDetailState, action),
            };

        case P2P_PUBLIC_OFFER_DETAIL_FETCH:
        case P2P_PUBLIC_OFFER_DETAIL_DATA:
        case P2P_PUBLIC_OFFER_DETAIL_ERROR:
            const p2pPublicOfferDetailState = { ...state.p2p_public_offer_detail };

            return {
                ...state,
                p2p_public_offer_detail: p2pPublicOfferDetailReducer(p2pPublicOfferDetailState, action),
            };

        case P2P_PUBLIC_OFFERS_FETCH:
        case P2P_PUBLIC_OFFERS_DATA:
        case P2P_PUBLIC_OFFERS_ERROR:
            const p2pPublicOffersFetchState = { ...state.p2p_public_offers };

            return {
                ...state,
                p2p_public_offers: p2pPublicOffersFetchReducer(p2pPublicOffersFetchState, action),
            };

        case P2P_PUBLIC_PAYMENT_METHODS_FETCH:
        case P2P_PUBLIC_PAYMENT_METHODS_DATA:
        case P2P_PUBLIC_PAYMENT_METHODS_ERROR:
            const p2pPublicPaymentMethodsState = { ...state.p2p_public_payment_methods };

            return {
                ...state,
                p2p_public_payment_methods: p2pPublicPaymentMethodsReducer(p2pPublicPaymentMethodsState, action),
            };

        default:
            return state;
    }
};
