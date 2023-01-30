import { takeEvery, takeLatest } from 'redux-saga/effects';
import { FEEDBACK_CREATE, FEEDBACK_FETCH } from '../constants';
import { feedbackCreateSaga } from './feedbackCreateSaga';
import { feedbackSaga } from './feedbackSaga';

export function* rootP2PFeedbackSaga() {
    yield takeEvery(FEEDBACK_CREATE, feedbackCreateSaga);
    yield takeLatest(FEEDBACK_FETCH, feedbackSaga);
}
