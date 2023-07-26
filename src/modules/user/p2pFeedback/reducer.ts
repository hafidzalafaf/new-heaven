import { CommonError } from '../../../modules/types';
import { FeedbackActions } from './actions';
import {
    FEEDBACK_CREATE,
    FEEDBACK_CREATE_DATA,
    FEEDBACK_CREATE_ERROR,
    FEEDBACK_DATA,
    FEEDBACK_ERROR,
    FEEDBACK_FETCH,
} from './constants';
import { Feedback } from './types';

const defaultFeedback: Feedback = {
    comment: '',
    assesment: '',
};

export interface P2PFeedbackState {
    create: {
        data: Feedback;
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    fetch: {
        data: Feedback[];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
}

export const initialFeedbackState: P2PFeedbackState = {
    create: {
        data: defaultFeedback,
        fetching: false,
        success: false,
    },
    fetch: {
        data: [],
        fetching: false,
        success: false,
    },
};

export const feedbackFetchReducer = (state: P2PFeedbackState['fetch'], action: FeedbackActions) => {
    switch (action.type) {
        case FEEDBACK_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case FEEDBACK_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case FEEDBACK_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

const feedbackCreateReducer = (state: P2PFeedbackState['create'], action: FeedbackActions) => {
    switch (action.type) {
        case FEEDBACK_CREATE:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case FEEDBACK_CREATE_DATA:
            return {
                ...state,
                // data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case FEEDBACK_CREATE_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export const p2pFeedbackReducer = (state = initialFeedbackState, action: FeedbackActions) => {
    switch (action.type) {
        case FEEDBACK_FETCH:
        case FEEDBACK_DATA:
        case FEEDBACK_ERROR:
            return {
                ...state,
                fetch: feedbackFetchReducer({ ...state.fetch }, action),
            };
        case FEEDBACK_CREATE:
        case FEEDBACK_CREATE_DATA:
        case FEEDBACK_CREATE_ERROR:
            const feedbackCreateState = { ...state.create };

            return {
                ...state,
                create: feedbackCreateReducer(feedbackCreateState, action),
            };

        default:
            return state;
    }
};
