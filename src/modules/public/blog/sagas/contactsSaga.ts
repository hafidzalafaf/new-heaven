import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { contactsData, contactsError, ContactsFetch } from '../actions';
import axios from 'axios';
import { API, RequestOptions } from '../../../../api';
import { buildQueryString } from 'src/helpers';

async function fetchContacts() {
    const apiKey = '01c32b65528575f7b27dfb6bf2';
    const sURL = `https://api.heavenexchange.io/blog/ghost/api/v3/content/posts/?key=${apiKey}&limit=15&filter=tag%3Acontact`;
    const result = await axios.get(sURL);

    return result.data.posts;
}

export function* contactsSaga(action: ContactsFetch) {
    try {
        const response = yield call(fetchContacts);
        yield put(contactsData(response));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: contactsError,
                },
            })
        );
    }
}
