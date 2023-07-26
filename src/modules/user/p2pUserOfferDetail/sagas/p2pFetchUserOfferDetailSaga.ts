import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pUserOfferDetailData, p2pUserOfferDetailError, P2PUserOfferDetailFetch } from '../actions';
import { buildQueryString, getCsrfToken } from 'src/helpers';

const config: RequestOptions = {
    apiVersion: 'p2p',
    withHeaders: true,
};

export function* p2pFetchUserOfferDetailSaga(action: P2PUserOfferDetailFetch) {
    try {
        const { from, to, state, limit, page, offer_number } = action.payload;

        let params: any = {
            from,
            to,
            state,
            limit,
            page,
        };

        const { data, headers } = yield call(
            API.get(config),
            `/account/offer/${offer_number}?${buildQueryString(params)}`
        );

        yield put(
            p2pUserOfferDetailData({
                list: data,
                total: headers.total,
                page: action.payload.page,
                from,
                to,
                state,
            })
        );
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
