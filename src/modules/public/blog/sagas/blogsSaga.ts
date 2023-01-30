import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { blogsData, blogsError, BlogsFetch } from '../actions';
import axios from 'axios';
import { API, RequestOptions } from '../../../../api';
import { buildQueryString } from 'src/helpers';

async function fetchNews(tag) {
    const apiKey = '01c32b65528575f7b27dfb6bf2';
    const sURL = `https://www.heavenexchange.io/blog/ghost/api/v3/content/posts/?key=${apiKey}&limit=15&tag=${tag}`;
    const result = await axios.get(sURL);

    return result.data.posts;
}

export function* blogsSaga(action: BlogsFetch) {
    try {
        const payload = action.payload;
        const response = yield call(fetchNews, payload);
        yield put(blogsData(response));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: blogsError,
                },
            })
        );
    }
}



// const config: RequestOptions = {
//     apiVersion: 'news',
// };

// export function* blogsSaga(action: BlogsFetch) {
//     try {
//         const apiKey = '01c32b65528575f7b27dfb6bf2';
//         const feedback = yield call(API.get(config),`/content/posts/?key=${apiKey}&limit=${action.payload.limit}&tag=${action.payload.tag}`);

//         yield put(blogsData(feedback));
//     } catch (error) {
//         yield put(
//             sendError({
//                 error,
//                 processingType: 'alert',
//                 extraOptions: {
//                     actionError: blogsError,
//                 },
//             })
//         );
//     }
// }