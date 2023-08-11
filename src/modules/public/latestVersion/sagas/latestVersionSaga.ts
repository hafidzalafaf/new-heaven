import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import {
    getLatestVersionData, getLatestVersionError,GetLatestVersionFetch
} from '../actions'

const getLatestVersionOptions: RequestOptions = {
    apiVersion: 'exchange',
} 

export function* latestVersionSaga(action: GetLatestVersionFetch) {
    try {
        const response = yield call(API.get(getLatestVersionOptions), '/public/setting');
        yield put(getLatestVersionData(response));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: getLatestVersionError,
                },
            })
        );
    }
}