import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pPublicCurrenciesData, p2pPublicCurrenciesError, P2PPublicCurrenciesFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'p2p',
    withHeaders: true,
};

export function* p2pPublicCurrenciesSaga(action: P2PPublicCurrenciesFetch) {
    try {
        const data = yield call(API.get(config), `/public/fiats/filter?fiat=${action.payload.fiat}`);

        yield put(p2pPublicCurrenciesData(data));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pPublicCurrenciesError,
                },
            })
        );
    }
}
