import { takeEvery } from 'redux-saga/effects';
import { BLOGS_FETCH } from '../constants';
import { blogsSaga } from './blogsSaga';

export function* rootBlogsSaga() {
    yield takeEvery(BLOGS_FETCH, blogsSaga);
}
