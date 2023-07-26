import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { faqsData, faqsError, FaqsFetch } from '../actions';
import axios from 'axios';
import { API, RequestOptions } from '../../../../api';
import { buildQueryString } from 'src/helpers';

async function fetchFaqs() {
    const apiKey = '81d3ce71aaee00c6c6d4472e44';
    const sURL = `https://www.heavenexchange.io/blog/ghost/api/v3/content/posts/?key=${apiKey}&limit=15&filter=tag%3Afaq`;
    const result = await axios.get(sURL);

    return result.data.posts;
}

export function* faqsSaga(action: FaqsFetch) {
    try {
        const response = yield call(fetchFaqs);
        yield put(faqsData(response));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: faqsError,
                },
            })
        );
    }
}
