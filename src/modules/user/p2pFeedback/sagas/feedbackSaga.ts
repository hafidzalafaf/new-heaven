import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { feedbackData, feedbackError, FeedbackFetch } from '../actions';
import { buildQueryString } from '../../../../helpers';

const config: RequestOptions = {
    apiVersion: 'p2p',
};

export function* feedbackSaga(action: FeedbackFetch) {
    try {
        let params = '';
        if (action.payload) {
            params = `?${buildQueryString(action.payload.assessment)}`;
        }
        const feedback = yield call(API.get(config), `/account/users/feedback${params}`);

        yield put(feedbackData(feedback));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: feedbackError,
                },
            })
        );
    }
}
