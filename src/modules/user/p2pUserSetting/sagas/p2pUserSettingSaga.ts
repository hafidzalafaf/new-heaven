import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pUserSettingData, p2pUserSettingError, P2PUserSettingFetch } from '../actions';
import { buildQueryString } from 'src/helpers';

const config: RequestOptions = {
    apiVersion: 'p2p',
};

export function* p2pUserSettingSaga(action: P2PUserSettingFetch) {
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

        yield put(p2pUserSettingData(feedback));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pUserSettingError,
                },
            })
        );
    }
}
