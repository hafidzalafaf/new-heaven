import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { buildQueryString } from '../../../../helpers';
import { offersData, offersError, OffersFetch } from '../actions';
import axios from 'axios';

const config: RequestOptions = {
    apiVersion: 'p2p2',
    withHeaders: true,
};

export function* p2pOffersSaga(action: OffersFetch) {
    try {
        const { side, sort, base, quote, payment_method, currency, fiat } = action.payload;
        const { data, headers } = yield call(
            axios.get,
            `http://192.168.1.56:3001/api/v1/public/trades?fiat=${fiat}&currency=${currency}&side=${side}`
        );

        yield put(
            offersData({
                list: data,
                total: headers.total,
                page: action.payload.page,
                side,
                sort,
                base,
                quote,
                payment_method,
            })
        );
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: offersError,
                },
            })
        );
    }
}
