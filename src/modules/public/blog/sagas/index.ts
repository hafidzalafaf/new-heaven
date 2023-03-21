import { takeEvery } from 'redux-saga/effects';
import { BLOGS_FETCH, BLOGS_FAQ_FETCH } from '../constants';
import { blogsSaga } from './blogsSaga';
import { faqsSaga } from './faqsSaga';

export function* rootBlogsSaga() {
    yield takeEvery(BLOGS_FETCH, blogsSaga);
    yield takeEvery(BLOGS_FAQ_FETCH, faqsSaga);
}
