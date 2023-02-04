import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { OrderCreate, orderCreateData, orderCreateError } from '../actions';
import axios from 'axios';

// const config = (csrfToken?: string): RequestOptions => {
//     return {
//         apiVersion: 'p2p',
//         headers: { 'X-CSRF-Token': csrfToken },
//     };
// };

const token =
    'eyJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NzUzOTkyOTUsImV4cCI6MTY3NTQwMjg5NSwic3ViIjoic2Vzc2lvbiIsImlzcyI6ImFjY291bnQiLCJhdWQiOlsiZXhjaGFuZ2UiLCJhY2NvdW50Il0sImp0aSI6ImI3NDcwZmZkMjQ5ZmU5ZGUyNzBlIiwidWlkIjoiSURCRERFMjg1REYyIiwidXNlcm5hbWUiOm51bGwsImVtYWlsIjoiY2hhbGltYXRpa2FoMDA3QGhlYXZlbmV4Y2hhbmdlLmNvbSIsInJvbGUiOiJhZG1pbiIsImxldmVsIjoyLCJzdGF0ZSI6ImFjdGl2ZSIsInJlZmVycmFsX2lkIjpudWxsfQ.JX8LVaCwAtgEEBc1JlanUY6-dcT7oENr1jkjfRRtBVLkPZEktZk3eHjQbVxG2tWFkxh8PgSMiJwgH-uCVGh2hQ8eaZ2xYgTZUOmlX1aNSTaZ8FJLueSuqumDbfrhwyd-Be-dZO5O2AnqbHsYQ7U5G0L4L6a5ggHaFWJ9bL38f6qwrBhq4H8dWgY3dpkXoG52eaEwGYhtSNNsUuftW0ZdppEs5wk0-SSxL6Qdzxwbfj_hTmRxkSV9NWkCr9xVMfnkruyO5seb1VB2TOuUF4smFRWwY_tmFns4sg8F68UwFqNdgqoWvCQLTuSqpM9hCQE1l-ScXr-rSyoTxPGsV4HQJQ';
const config = {
    headers: { Authorization: `Bearer ${token}` },
    'Content-Type': 'multipart/form-data',
};

export function* orderCreateSaga(action: OrderCreate) {
    try {
        yield call(axios.post, `http://192.168.1.56:3001/api/v1/market/orders`, action.payload, config);
        yield put(orderCreateData());
        yield put(alertPush({ message: ['success.order.created'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: orderCreateError,
                },
            })
        );
    }
}
