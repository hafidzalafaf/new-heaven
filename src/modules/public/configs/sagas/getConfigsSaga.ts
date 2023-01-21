import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { configsData, configsError } from '../actions';
import { currenciesData } from '../../currencies';
import { blockchainsData } from '../../blockchains';
import { tradingFeeData } from '../../tradingFee';

const configsOptions: RequestOptions = {
    apiVersion: 'exchange',
};

export function* getConfigsSaga() {
    try {
        const { currencies, blockchains, trading_fees } = yield call(API.get(configsOptions), '/public/config');

        yield put(currenciesData(currencies));
        yield put(blockchainsData(blockchains));
        yield put(tradingFeeData(trading_fees));

        yield put(configsData());
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: configsError,
                },
            })
        );
    }
}
