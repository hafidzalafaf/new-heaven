import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pUserOfferData, p2pUserOfferError, P2PUserOfferFetch } from '../actions';
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

export function* p2pFetchUserOfferSaga(action: P2PUserOfferFetch) {
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
            pageIndex,
            state
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
            page: pageIndex,
            state
        };
        
        const {data, headers} = yield call(API.get(config), `/account/offer?${buildQueryString(params)}`);
        let nextPageExists = false;

        if (data.length === limit){
            params = {...params, page: (pageIndex + 1) * limit, limit: 1};
            const checkData = yield call(API.get(config), `/account/offer?${buildQueryString(params)}`);

            if (checkData.data.length === 1){
                nextPageExists = true;
            }
        }

        yield put(p2pUserOfferData({
            list: data,
            total: headers.total,
            pageIndex,
            side,
            sort,
            base,
            quote,
            payment_method,
            state,
            nextPageExists
        }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pUserOfferError,
                },
            })
        );
    }
}
