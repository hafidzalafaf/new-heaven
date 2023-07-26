import { takeLatest } from 'redux-saga/effects';
import {
    P2P_CURRENCIES_FETCH,
    P2P_OFFERS_FETCH,
    P2P_PAYMENT_METHODS_FETCH,
    P2P_FIAT_FETCH,
    P2P_OFFER_DETAIL_FETCH,
    P2P_MERCHANT_DETAIL_FETCH,
} from '../constants';
import { p2pCurrenciesSaga } from './p2pCurrenciesSaga';
import { p2pOffersSaga } from './p2pOffersSaga';
import { p2pPaymentMethodsSaga } from './p2pPaymentMethodsSaga';
import { p2pFiatsSaga } from './p2pFiatSaga';
import { p2pOfferDetailSaga } from './p2pOfferDetailSaga';
import { p2pMerchantDetailSaga } from './p2pMerchantDetailSaga';

export function* rootP2PSaga() {
    yield takeLatest(P2P_OFFERS_FETCH, p2pOffersSaga);
    yield takeLatest(P2P_CURRENCIES_FETCH, p2pCurrenciesSaga);
    yield takeLatest(P2P_PAYMENT_METHODS_FETCH, p2pPaymentMethodsSaga);
    yield takeLatest(P2P_FIAT_FETCH, p2pFiatsSaga);
    yield takeLatest(P2P_OFFER_DETAIL_FETCH, p2pOfferDetailSaga);
    yield takeLatest(P2P_MERCHANT_DETAIL_FETCH, p2pMerchantDetailSaga);
}
