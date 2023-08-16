import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, defaultStorageLimit, RequestOptions } from '../../../../api';
import { buildQueryString, getHistorySagaParam, sliceArray } from '../../../../helpers';
import { failHistory, HistoryFetch, successHistory } from '../actions';

const config: RequestOptions = {
    apiVersion: 'exchange',
};

export function* historySaga(action: HistoryFetch) {
    try {
        const { type, limit, page } = action.payload;
        const coreEndpoint = {
            deposits: '/account/deposits',
            withdraws: '/account/withdraws',
            trades: '/market/trades',
            transfers: '/account/internal_transfers',
        };

        let params = '';

        if (type === 'trades') {
            params = getHistorySagaParam(action.payload);
        } else {
            params = buildQueryString(action.payload);
        }

        // const params =  getHistorySagaParam(action.payload);
        const data = yield call(API.get(config), `${coreEndpoint[type]}?${params}`);

        let nextPageExists = false;

        if (limit && data.length === limit) {
            const testActionPayload = {
                ...action.payload,
                page: (page + 1) * limit,
                limit: 1,
            };
            const testParams = getHistorySagaParam(testActionPayload);
            const checkData = yield call(API.get(config), `${coreEndpoint[type]}?${testParams}`);

            if (checkData.length === 1) {
                nextPageExists = true;
            }
        }
        let updatedData = data;

        if (type === 'trades') {
            updatedData = sliceArray(data, defaultStorageLimit());
        }

        yield put(successHistory({ list: data, listTrade: updatedData, page, nextPageExists }));
    } catch (error) {
        if (error && error.message && error.message[0] == 'account.withdraw.not_permitted') {
            yield put(
                sendError({
                    error,
                    processingType: 'console',
                    extraOptions: {
                        actionError: failHistory,
                    },
                })
            );
        } else {
            yield put(
                sendError({
                    error,
                    processingType: 'alert',
                    extraOptions: {
                        actionError: failHistory,
                    },
                })
            );
        }
    }
}
