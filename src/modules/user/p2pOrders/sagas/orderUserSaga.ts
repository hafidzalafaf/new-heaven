import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { orderData, orderError, OrderFetch } from '../actions';
import { buildQueryString } from '../../../../helpers';
import { getCsrfToken } from '../../../../helpers';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
        withHeaders: true,
    };
};

export function* orderSaga(action: OrderFetch) {
    try {
        let currency = '';
        let fiat = '';
        let side = '';
        let state = '';
        let from = 0;
        let to = 0;
        let pageIndex = 0;
        let limit = 5;

        if (action.payload) {
            currency = action.payload.currency;
            fiat = action.payload.fiat;
            side = action.payload.side;
            state = action.payload.state;
            from = action.payload.from;
            to = action.payload.to;
            pageIndex = action.payload.page;
            limit = action.payload.limit;
        }
        // const { fiat, side, state, from, to } = action.payload;
        let params: any = {
            currency,
            fiat,
            side,
            state,
            from,
            to,
            page: action.payload.page,
            limit,
        };

        // const data = yield call(
        //     API.get(config(getCsrfToken())),
        //     action.payload ? `/account/order?${buildQueryString(params)}` : `/account/order`
        // );
        const data = yield call(API.get(config(getCsrfToken())), `/account/order?${`${buildQueryString(params)}`}`);
        let nextPageExists = false;

        if (data.data.length === limit) {
            params = { ...params, page: (pageIndex + 1) * limit, limit: 1 };
            const checkData = yield call(API.get(config(getCsrfToken())), `/account/order?${buildQueryString(params)}`);
            if (checkData.data.length === 1) {
                nextPageExists = true;
            }
        }

        yield put(
            orderData({
                data: data.data,
                nextPageExists: nextPageExists,
                page: pageIndex,
                total: data.total,
            })
        );
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: orderError,
                },
            })
        );
    }
}
