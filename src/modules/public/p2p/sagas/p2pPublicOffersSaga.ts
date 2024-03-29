import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { buildQueryString, getOrderAPI } from 'src/helpers';
import { p2pPublicOffersData, p2pPublicOffersError, P2PPublicOffersFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'p2p',
    withHeaders: true,
};

export function* p2pPublicOffersSaga(action: P2PPublicOffersFetch) {
    try {
        const {
            side,
            sort,
            base,
            quote,
            payment_method,
            currency,
            fiat,
            amount,
            max_price,
            min_price,
            limit,
            page,
        } = action.payload;
        let params: any = {
            side,
            sort,
            base,
            quote,
            payment_method,
            currency,
            fiat,
            amount,
            max_price,
            min_price,
            limit,
            page,
        };

        const { data, headers } = yield call(API.get(config), `/public/trades?${buildQueryString(params)}`);

        yield put(
            p2pPublicOffersData({
                list: data,
                total: headers.total,
                page: action.payload.page,
                side,
                sort,
                base,
                quote,
                payment_method,
            })
        );
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pPublicOffersError,
                },
            })
        );
    }
}
