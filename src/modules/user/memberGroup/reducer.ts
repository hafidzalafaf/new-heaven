import { CommonState } from '../../types';
import { GroupMemberAction } from './actions';
import { PROFILE_GROUP_FETCH, PROFILE_GROUP_DATA, PROFILE_GROUP_ERROR } from './constants';
import { GroupMember } from './types';

export interface GroupMemberState extends CommonState {
    data: GroupMember;
}

const initialGroupMemberState: GroupMemberState = {
    data: {
        uid: '',
        email: '',
        group: 'any',
    },
};

export const groupMemberReducer = (state = initialGroupMemberState, action: GroupMemberAction) => {
    switch (action.type) {
        case PROFILE_GROUP_FETCH:
            return {
                ...state,
                loading: true,
                success: false,
            };
        case PROFILE_GROUP_DATA:
            return {
                ...state,
                loading: false,
                success: true,
                data: action.payload,
            };
        case PROFILE_GROUP_ERROR:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};
