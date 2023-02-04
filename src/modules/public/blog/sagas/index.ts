import { takeEvery } from 'redux-saga/effects';
import { BLOGS_FETCH, BLOGS_CONTACT_FETCH } from '../constants';
import { blogsSaga } from './blogsSaga';
import { contactsSaga } from './contactsSaga';

export function* rootBlogsSaga() {
    yield takeEvery(BLOGS_FETCH, blogsSaga);
    yield takeEvery(BLOGS_CONTACT_FETCH, contactsSaga);
}
