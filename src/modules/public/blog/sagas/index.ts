import { takeLatest } from 'redux-saga/effects';
import { BLOGS_FETCH } from '../constants';
import { blogsSaga } from './blogsSaga';

export function* rootBlogsSaga() {
    yield takeLatest(BLOGS_FETCH, blogsSaga);
}
