import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { buildQueryString } from '../../../../helpers';
import { FeedbackCreate, feedbackCreateData, feedbackCreateError } from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'p2p',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* feedbackCreateSaga(action: FeedbackCreate) {
    try {
        let params = '';
        if (action.payload) {
            params = `?${buildQueryString(action.payload.order_number)}`;
        }
        yield call(API.post(config(getCsrfToken())), `/market/feedback/${params}`, action.payload);
        yield put(feedbackCreateData());
        yield put(alertPush({ message: ['success.feedback.created'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: feedbackCreateError,
                },
            })
        );
    }
}
