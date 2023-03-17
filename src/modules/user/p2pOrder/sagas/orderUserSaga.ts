import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { orderData, orderError, OrderFetch } from '../actions';
import { buildQueryString } from '../../../../helpers';
import { getCsrfToken } from '../../../../helpers';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* orderSaga(action: OrderFetch) {
    try {
        let currency = '';
        let fiat = '';
        let side = '';
        let state = '';
        let from = '';
        let to = '';

        if (action.payload) {
            currency = action.payload.currency;
            fiat = action.payload.fiat;
            side = action.payload.side;
            state = action.payload.state;
            from = action.payload.from;
            to = action.payload.to;
        }
        // const { fiat, side, state, from, to } = action.payload;
        let params: any = {
            currency,
            fiat,
            side,
            state,
            from,
            to,
        };

        // const data = yield call(
        //     API.get(config(getCsrfToken())),
        //     action.payload ? `/account/order?${buildQueryString(params)}` : `/account/order`
        // );
        const data = yield call(API.get(config(getCsrfToken())), `/account/order${`?${buildQueryString(params)}`}`);
        yield put(orderData(data));
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
