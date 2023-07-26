import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { p2pOfferAvailableData, p2pOfferAvailableError, P2POfferAvailableFetch } from '../actions';
import { buildQueryString } from 'src/helpers';

const config: RequestOptions = {
    apiVersion: 'p2p',
};

export function* p2pAvailableOfferSaga(action: P2POfferAvailableFetch) {
    try {
        let type = '';
        let ordering = '';
        let order_by = '';
        if (action.payload) {
            type = `?${buildQueryString(action.payload.type)}`;
            ordering = `?${buildQueryString(action.payload.ordering)}`;
            order_by = `?${buildQueryString(action.payload.order_by)}`;
        }
        const feedback = yield call(API.get(config), `/trades?type=${type}&ordering=${ordering}&order_by=${order_by}`);

        yield put(p2pOfferAvailableData(feedback));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pOfferAvailableError,
                },
            })
        );
    }
}
