import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pCurrenciesData, p2pCurrenciesError, P2PCurrenciesFetch } from '../actions';
import axios from 'axios';

const config: RequestOptions = {
    apiVersion: 'p2p',
};

export function* p2pCurrenciesSaga(action: P2PCurrenciesFetch) {
    try {
        // const data = yield call(API.get(config), '/public/currencies');
        const data = yield call(
            axios.get,
            `http://192.168.1.56:3001/api/v1/public/fiats/filter?fiat=${action.payload.fiat}`
        );

        yield put(p2pCurrenciesData(data.data));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pCurrenciesError,
                },
            })
        );
    }
}
