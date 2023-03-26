import { defaultStorageLimit } from 'src/api';
import { sliceArray } from 'src/helpers';
import { CommonError } from '../../types';
import { P2PActions } from './actions';
import {
    P2P_CURRENCIES_DATA,
    P2P_CURRENCIES_ERROR,
    P2P_CURRENCIES_FETCH,
    P2P_FIAT_DATA,
    P2P_FIAT_FETCH,
    P2P_FIAT_ERROR,
    P2P_OFFERS_DATA,
    P2P_OFFERS_ERROR,
    P2P_OFFERS_FETCH,
    P2P_PAYMENT_METHODS_DATA,
    P2P_PAYMENT_METHODS_ERROR,
    P2P_PAYMENT_METHODS_FETCH,
    P2P_MERCHANT_DETAIL_DATA,
    P2P_MERCHANT_DETAIL_ERROR,
    P2P_MERCHANT_DETAIL_FETCH,
    P2P_OFFER_DETAIL_DATA,
    P2P_OFFER_DETAIL_ERROR,
    P2P_OFFER_DETAIL_FETCH,
} from './constants';
import { Offer, P2PCurrency, P2PFiat, PaymentMethod, P2PMerchantDetailInterface } from './types';

export interface P2PState {
    fiats: {
        data: P2PFiat[];
        fetching: boolean;
        success: boolean;
        timestamp?: number | undefined;
        error?: CommonError | undefined;
    };
    currencies: {
        data: P2PCurrency[];
        fetching: boolean;
        success: boolean;
        timestamp?: number | undefined;
        error?: CommonError | undefined;
    };
    paymentMethods: {
        data: PaymentMethod[];
        fetching: boolean;
        success: boolean;
        timestamp?: number | undefined;
        error?: CommonError | undefined;
    };
    offers: {
        page: number;
        total: number;
        list: Offer[];
        side: string;
        base: string;
        quote: string;
        payment_method?: number;
        fetching: boolean;
        success: boolean;
        timestamp?: number | undefined;
        error?: CommonError | undefined;
    };
    offer_detail: {
        data: any;
        fetching: boolean;
        success: boolean;
        timestamp?: number | undefined;
        error?: CommonError | undefined;
    };
    merchant_detail: {
        data: P2PMerchantDetailInterface;
        fetching: boolean;
        success: boolean;
        timestamp?: number | undefined;
        error?: CommonError | undefined;
    };
}

export const initialP2PState: P2PState = {
    fiats: {
        data: [],
        fetching: false,
        success: false,
    },
    currencies: {
        data: [],
        fetching: false,
        success: false,
    },
    paymentMethods: {
        data: [],
        fetching: false,
        success: false,
    },
    offers: {
        page: 0,
        total: 0,
        list: [],
        side: '',
        base: '',
        quote: '',
        fetching: false,
        success: false,
    },
    offer_detail: {
        data: [],
        fetching: false,
        success: false,
    },
    merchant_detail: {
        data: {
            merchant: {},
            feedbacks: [],
        },
        fetching: false,
        success: false,
    },
};

export const p2pOffersFetchReducer = (state: P2PState['offers'], action: P2PActions) => {
    switch (action.type) {
        case P2P_OFFERS_FETCH:
            return {
                ...state,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_OFFERS_DATA:
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

        case P2P_OFFERS_ERROR:
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

const p2pFiatsReducer = (state: P2PState['fiats'], action: P2PActions) => {
    switch (action.type) {
        case P2P_FIAT_FETCH:
            return {
                ...state,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_FIAT_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_FIAT_ERROR:
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

const p2pCurrenciesReducer = (state: P2PState['currencies'], action: P2PActions) => {
    switch (action.type) {
        case P2P_CURRENCIES_FETCH:
            return {
                ...state,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_CURRENCIES_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_CURRENCIES_ERROR:
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

const p2pPaymentMethodsReducer = (state: P2PState['paymentMethods'], action: P2PActions) => {
    switch (action.type) {
        case P2P_PAYMENT_METHODS_FETCH:
            return {
                ...state,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_PAYMENT_METHODS_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_PAYMENT_METHODS_ERROR:
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

const p2pOfferDetailReducer = (state: P2PState['offer_detail'], action: P2PActions) => {
    switch (action.type) {
        case P2P_OFFER_DETAIL_FETCH:
            return {
                ...state,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_OFFER_DETAIL_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_OFFER_DETAIL_ERROR:
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

const p2pMerchantDetailReducer = (state: P2PState['merchant_detail'], action: P2PActions) => {
    switch (action.type) {
        case P2P_MERCHANT_DETAIL_FETCH:
            return {
                ...state,
                fetching: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_MERCHANT_DETAIL_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_MERCHANT_DETAIL_ERROR:
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
        case P2P_CURRENCIES_FETCH:
        case P2P_CURRENCIES_DATA:
        case P2P_CURRENCIES_ERROR:
            const p2pCurrenciesState = { ...state.currencies };

            return {
                ...state,
                p2pCurrencies: p2pCurrenciesReducer(p2pCurrenciesState, action),
            };

        case P2P_FIAT_FETCH:
        case P2P_FIAT_DATA:
        case P2P_FIAT_ERROR:
            const p2pFiatState = { ...state.fiats };

            return {
                ...state,
                fiats: p2pFiatsReducer(p2pFiatState, action),
            };

        case P2P_PAYMENT_METHODS_FETCH:
        case P2P_PAYMENT_METHODS_DATA:
        case P2P_PAYMENT_METHODS_ERROR:
            const p2pPaymentMethodsState = { ...state.paymentMethods };

            return {
                ...state,
                paymentMethods: p2pPaymentMethodsReducer(p2pPaymentMethodsState, action),
            };

        case P2P_OFFERS_FETCH:
        case P2P_OFFERS_DATA:
        case P2P_OFFERS_ERROR:
            const p2pOffersFetchState = { ...state.offers };

            return {
                ...state,
                offers: p2pOffersFetchReducer(p2pOffersFetchState, action),
            };

        case P2P_OFFER_DETAIL_FETCH:
        case P2P_OFFER_DETAIL_DATA:
        case P2P_OFFER_DETAIL_ERROR:
            const p2pOfferDetailState = { ...state.offer_detail };

            return {
                ...state,
                offer_detail: p2pOfferDetailReducer(p2pOfferDetailState, action),
            };

        case P2P_MERCHANT_DETAIL_FETCH:
        case P2P_MERCHANT_DETAIL_DATA:
        case P2P_MERCHANT_DETAIL_ERROR:
            const p2pMerchantDetailState = { ...state.merchant_detail };

            return {
                ...state,
                merchant_detail: p2pMerchantDetailReducer(p2pMerchantDetailState, action),
            };

        default:
            return state;
    }
};
