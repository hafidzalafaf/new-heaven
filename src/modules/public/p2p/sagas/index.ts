import { takeLatest } from 'redux-saga/effects';
import {
    P2P_PUBLIC_CURRENCIES_FETCH,
    P2P_PUBLIC_OFFERS_FETCH,
    P2P_PUBLIC_PAYMENT_METHODS_FETCH,
    P2P_PUBLIC_FIAT_FETCH,
    P2P_PUBLIC_OFFER_DETAIL_FETCH,
    // P2P_PUBLIC_MERCHANT_DETAIL_FETCH,
} from '../constants';
// import { p2pPublicCurrenciesSaga } from './p2pPublicCurrenciesSaga';
import { p2pPublicOffersSaga } from './p2pPublicOffersSaga';
import { p2pPublicPaymentMethodsSaga } from './p2pPublicPaymentMethodsSaga';
// import { p2pPublicFiatsSaga } from './p2pPublicFiatsSaga';
import { p2pPublicOfferDetailSaga } from './p2pPublicOfferDetailSaga';
// import { p2pPublicMerchantDetailSaga } from './p2pPublicMerchantDetailSaga';

export function* rootP2PSaga() {
    yield takeLatest(P2P_PUBLIC_OFFERS_FETCH, p2pPublicOffersSaga);
    // yield takeLatest(P2P_PUBLIC_CURRENCIES_FETCH, p2pPublicCurrenciesSaga);
    yield takeLatest(P2P_PUBLIC_PAYMENT_METHODS_FETCH, p2pPublicPaymentMethodsSaga);
    // yield takeLatest(P2P_PUBLIC_FIAT_FETCH, p2pPublicFiatsSaga);
    yield takeLatest(P2P_PUBLIC_OFFER_DETAIL_FETCH, p2pPublicOfferDetailSaga);
    // yield takeLatest(P2P_PUBLIC_MERCHANT_DETAIL_FETCH, p2pPublicMerchantDetailSaga);
}
