import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { P2POfferCreate, p2pOfferCreateData, p2pOfferCreateError } from '../actions';
import axios from 'axios';

// const config = (csrfToken?: string): RequestOptions => {
//     return {
//         apiVersion: 'p2p2',
//         headers: { 'X-CSRF-Token': csrfToken },
//     };
// };
const token =
    'eyJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NzUyMzg1MjgsImV4cCI6MTY3NTI0MjEyOCwic3ViIjoic2Vzc2lvbiIsImlzcyI6ImFjY291bnQiLCJhdWQiOlsiZXhjaGFuZ2UiLCJhY2NvdW50Il0sImp0aSI6ImIzMDU5ZDUyYzIwMTkxMTg0YTAwIiwidWlkIjoiSUQ3Q0FGODhDRDMzIiwidXNlcm5hbWUiOm51bGwsImVtYWlsIjoiYWRtaW5AaGVhdmVuZXhjaGFuZ2UuaW8iLCJyb2xlIjoiYWRtaW4iLCJsZXZlbCI6Mywic3RhdGUiOiJhY3RpdmUiLCJyZWZlcnJhbF9pZCI6bnVsbH0.lFQBH5nz2JRrg2F_Ryh8PDUY_OC9QvS_jzNNXIOWOvtjzJH3dWpUHoIDM9PQT0Ajmy1tyASuTFU-hZOdgUe6jz8WANM7YBWrOMf0rCdbiYHQbhac6Txjwj41sSlrVm202L0lbVtbBFfHFRyzGy83EjtQhyZkpjl13S9viGwLBlGKRYSE68OwXchdzrF89vc1uKZ2ycSn_ajfbEqWPohpvh7BoNYthGIfnVYhQV_phwbPfLw0ueW5KEw8yoZ9jtBaNcE0IWk0xqOq_3S96WMup77ya6ICBelpwCGeEBT5uSXX0AfhcdrmmDc8YdEVM7yPudP73V5JCppfhdQzPiIWEw';
const config = {
    headers: { Authorization: `Bearer ${token}` },
    'Content-Type': 'multipart/form-data',
};

export function* p2pCreateOfferSaga(action: P2POfferCreate) {
    try {
        yield call(axios.post, `http://192.168.1.56:3001/api/v1/market/trades`, action.payload, config);
        yield put(p2pOfferCreateData());
        yield put(alertPush({ message: ['success.feedback.created'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pOfferCreateError,
                },
            })
        );
    }
}
