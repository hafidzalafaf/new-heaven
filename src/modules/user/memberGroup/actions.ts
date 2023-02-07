import { CommonError } from '../../types';
import { PROFILE_GROUP_FETCH, PROFILE_GROUP_DATA, PROFILE_GROUP_ERROR } from './constants';
import { GroupMember } from './types';

export interface GroupMemberFetch {
    type: typeof PROFILE_GROUP_FETCH;
}
export interface GroupMemberData {
    type: typeof PROFILE_GROUP_DATA;
    payload: GroupMember;
}

export interface GroupMemberError {
    type: typeof PROFILE_GROUP_ERROR;
    error: CommonError;
}

export type GroupMemberAction = GroupMemberFetch | GroupMemberData | GroupMemberError;

export const groupFetch = (): GroupMemberFetch => ({
    type: PROFILE_GROUP_FETCH,
});
export const groupData = (payload: GroupMemberData['payload']): GroupMemberData => ({
    type: PROFILE_GROUP_DATA,
    payload,
});
export const groupError = (error: CommonError): GroupMemberError => ({
    type: PROFILE_GROUP_ERROR,
    error,
});
