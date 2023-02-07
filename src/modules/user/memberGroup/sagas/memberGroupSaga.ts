import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { groupData, groupError, GroupMemberFetch } from '../actions';

const membersMe: RequestOptions = {
    apiVersion: 'exchange',
};

export function* memberGroupSaga(action: GroupMemberFetch) {
    try {
        const memberGroup = yield call(API.get(membersMe), '/account/members/me');
        yield put(groupData(memberGroup));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: groupError,
                },
            })
        );
    }
}
