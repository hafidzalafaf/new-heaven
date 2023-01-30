import { CommonError } from '../../../modules/types';
import {
    FEEDBACK_FETCH,
    FEEDBACK_DATA,
    FEEDBACK_ERROR,
    FEEDBACK_CREATE,
    FEEDBACK_CREATE_DATA,
    FEEDBACK_CREATE_ERROR,
} from './constants';
import { Feedback } from './types';

export interface FeedbackFetch {
    type: typeof FEEDBACK_FETCH;
    payload?: {
        order_number: string;
    };
}

export interface FeedbackData {
    type: typeof FEEDBACK_DATA;
    payload: [];
}

export interface FeedbackError {
    type: typeof FEEDBACK_ERROR;
    error: CommonError;
}

export interface FeedbackCreate {
    type: typeof FEEDBACK_CREATE;
    payload: {
        order_number: string;
    };
}

export interface FeedbackCreateData {
    type: typeof FEEDBACK_CREATE_DATA;
    payload: Feedback;
}

export interface FeedbackCreateError {
    type: typeof FEEDBACK_CREATE_ERROR;
    error: CommonError;
}

export type FeedbackActions =
    | FeedbackFetch
    | FeedbackData
    | FeedbackError
    | FeedbackCreate
    | FeedbackCreateData
    | FeedbackCreateError;

export const feedbackFetch = (payload?: FeedbackFetch['payload']): FeedbackFetch => ({
    type: FEEDBACK_FETCH,
    payload,
});

export const feedbackData = (payload: FeedbackData['payload']): FeedbackData => ({
    type: FEEDBACK_DATA,
    payload,
});

export const feedbackError = (error: CommonError): FeedbackError => ({
    type: FEEDBACK_ERROR,
    error,
});

export const feedbackCreate = (payload: FeedbackCreate['payload']): FeedbackCreate => ({
    type: FEEDBACK_CREATE,
    payload,
});

export const feedbackCreateData = (payload: FeedbackCreateData['payload']): FeedbackCreateData => ({
    type: FEEDBACK_CREATE_DATA,
    payload,
});

export const feedbackCreateError = (error: CommonError): FeedbackCreateError => ({
    type: FEEDBACK_CREATE_ERROR,
    error,
});
