import { PROFILE_GROUP_FETCH } from './../constants';
import { takeLatest } from 'redux-saga/effects';
import { memberGroupSaga } from './memberGroupSaga';

export function* rootMemberGroupSaga() {
    yield takeLatest(PROFILE_GROUP_FETCH, memberGroupSaga);
}
