import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { p2pOfferData, p2pOfferError, P2POfferFetch } from '../actions';
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

export function* p2pFetchOfferSaga(action: P2POfferFetch) {
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

        const { data, headers } = yield call(API.get(config), `/market/trades?${buildQueryString(params)}`);

        yield put(
            p2pOfferData({
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
                    actionError: p2pOfferError,
                },
            })
        );
    }
}
