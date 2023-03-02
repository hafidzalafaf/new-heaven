import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pUserOfferDetailData, p2pUserOfferDetailError, P2PUserOfferDetailFetch } from '../actions';
import { buildQueryString, getCsrfToken } from 'src/helpers';

const config: RequestOptions = {
    apiVersion: 'p2p',
    withHeaders: true,
};

// const config = (csrfToken?: string): RequestOptions => {
//     return {
//         apiVersion: 'p2p',
//         headers: { 'X-CSRF-Token': csrfToken },
//     };
// };

export function* p2pFetchUserOfferDetailSaga(action: P2PUserOfferDetailFetch) {
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
            offer_number
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
            offer_number
        };
        
        const {data, headers} = yield call(API.get(config), `/account/offer/${offer_number}?${buildQueryString(params)}`);

        yield put(p2pUserOfferDetailData({
            list: data,
            total: headers.total,
            page: action.payload.page,
            side,
            sort,
            base,
            quote,
            payment_method,
        }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pUserOfferDetailError,
                },
            })
        );
    }
}
