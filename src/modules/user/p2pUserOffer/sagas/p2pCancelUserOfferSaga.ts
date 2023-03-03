import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pUserOfferCancel, P2PUserOfferCancel, p2pUserOfferError, p2pUserOfferCancelData } from '../actions';
import { buildQueryString, getCsrfToken } from 'src/helpers';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

// const config = (csrfToken?: string): RequestOptions => {
//     return {
//         apiVersion: 'p2p',
//         headers: { 'X-CSRF-Token': csrfToken },
//     };
// };

// export function* p2pFetchUserOfferSaga(action: P2PUserOfferFetch) {
//     try {
//         const {
//             side,
//             sort,
//             base,
//             quote,
//             payment_method,
//             currency,
//             fiat,
//             amount,
//             max_price,
//             min_price,
//             limit,
//             page,
//         } = action.payload;
//         let params: any = {
//             side,
//             sort,
//             base,
//             quote,
//             payment_method,
//             currency,
//             fiat,
//             amount,
//             max_price,
//             min_price,
//             limit,
//             page,
//         };
        
//         const {data, headers} = yield call(API.put(config), `/account/offer?${buildQueryString(params)}`);

//         yield put(p2pUserOfferData({
//             list: data,
//             total: headers.total,
//             page: action.payload.page,
//             side,
//             sort,
//             base,
//             quote,
//             payment_method,
//         }));
//     } catch (error) {
//         yield put(
//             sendError({
//                 error,
//                 processingType: 'alert',
//                 extraOptions: {
//                     actionError: p2pUserOfferError,
//                 },
//             })
//         );
//     }
// }

export function* p2pCancelUserOfferSaga(action: P2PUserOfferCancel) {
    try {
        yield call(API.put(config(getCsrfToken())), `/account/offer/cancel/${action.payload.payment_user_uid}`);
        yield put(p2pUserOfferCancelData());
        yield put(alertPush({ message: ['success.payment.method.updated'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pUserOfferError,
                },
            })
        );
    }
}