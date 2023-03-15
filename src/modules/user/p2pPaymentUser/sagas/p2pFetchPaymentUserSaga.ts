import { call, put } from 'redux-saga/effects';
import { buildQueryString } from 'src/helpers';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { p2pPaymentUserData, p2pPaymentUserError, P2PPaymentUserFetch, P2PPaymentUserFetchSingle } from '../action';

const config: RequestOptions = {
    apiVersion: 'p2p',
};

export function* p2pFetchPaymentUserSaga(action: P2PPaymentUserFetch) {
    try {
        const {pageIndex, limit, type, time_from, time_to} = action.payload;
        let params: any = {
            page: pageIndex,
            limit,
            type,
            time_from,
            time_to
        } 
        const feedback = yield call(API.get(config), `/account/payment?${buildQueryString(params)}`);
        let nextPageExists = false;

        if (feedback.length === limit){
            params = {...params, page: (pageIndex + 1) * limit, limit : 1};
            const checkData = yield call(API.get(config), `account/payment?${buildQueryString(params)}`);
            if (checkData.length === 1){
                nextPageExists = true
            }
        }

        yield put(p2pPaymentUserData({list: feedback, nextPageExists, pageIndex}));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pPaymentUserError,
                },
            })
        );
    }
}
