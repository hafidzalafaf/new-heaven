import { call, put } from 'redux-saga/effects';
import { buildQueryString, getOrderAPI } from 'src/helpers';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { userOrdersHistoryData, userOrdersHistoryError, UserOrdersHistoryFetch } from '../actions';

const ordersOptions: RequestOptions = {
    apiVersion: getOrderAPI(),
};

export function* ordersHistorySaga(action: UserOrdersHistoryFetch) {
    try {
        const { pageIndex, limit, type, time_from, time_to, state, market, group } = action.payload;
        let params: any = {
            page: pageIndex,
            limit,
            time_from,
            time_to,
            state,
            market,
            group,
            ...(type === 'open' && { state: ['wait', 'trigger_wait'] }),
        };

        const data = yield call(API.get(ordersOptions), `/market/orders?${buildQueryString(params)}`);
        let nextPageExists = false;

        if (data.length === limit) {
            params = { ...params, page: (pageIndex + 1) * limit, limit: 1 };
            const checkData = yield call(API.get(ordersOptions), `/market/orders?${buildQueryString(params)}`);

            if (checkData.length === 1) {
                nextPageExists = true;
            }
        }

        yield put(userOrdersHistoryData({ list: data, nextPageExists, pageIndex }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: userOrdersHistoryError,
                },
            })
        );
    }
}
