import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, isFinexEnabled, RequestOptions } from '../../../../api';
import { getCsrfToken, getOrderAPI } from '../../../../helpers';
import { userOpenOrdersAppend } from '../../openOrders';
import { orderExecuteData, orderExecuteError, OrderExecuteFetch } from '../actions';

const executeOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: getOrderAPI(),
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* ordersExecuteSaga(action: OrderExecuteFetch) {
    try {
        const { market, side, volume, price, ord_type, trigger_price } = action.payload;
        const params = isFinexEnabled()
            ? {
                  market: market,
                  side: side,
                  amount: volume,
                  ...(typeof price !== 'undefined' && { price }),
                  ...(typeof trigger_price !== 'undefined' && { trigger_price }),
                  type: ord_type,
              }
            : action.payload;
        const order = yield call(API.post(executeOptions(getCsrfToken())), '/market/orders', params);
        yield put(orderExecuteData());

        if (getOrderAPI() === 'finex') {
            if (order.type !== 'market') {
                yield put(userOpenOrdersAppend(order));
            }
        } else {
            if (order.ord_type !== 'market') {
                yield put(userOpenOrdersAppend(order));
            }
        }

        yield put(alertPush({ message: ['success.order.created'], type: 'success' }));
    } catch (error) {
        if (error?.message[0] === 'market.trade.not_permitted') {
            yield put(alertPush({ message: [error.message], type: 'error' }));
        } else {
            yield put(
                sendError({
                    error,
                    processingType: 'alert',
                    extraOptions: {
                        actionError: orderExecuteError,
                    },
                })
            );
        }
    }
}
