import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { feedbackData, feedbackError, FeedbackFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'p2p2',
};

export function* feedbackSaga(action: FeedbackFetch) {
    try {
        const feedback = yield call(API.get(config), `/market/feedback`);

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
