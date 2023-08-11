import { takeLatest } from 'redux-saga/effects';
import {
GET_LATEST_VERSION_FETCH
} from '../constants'
import {latestVersionSaga} from './latestVersionSaga'

export function* rootGetLatestVersionSaga() {
yield takeLatest(GET_LATEST_VERSION_FETCH, latestVersionSaga)
}
