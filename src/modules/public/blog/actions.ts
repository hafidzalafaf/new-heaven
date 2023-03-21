import { CommonError } from '../../types';
import { BLOGS_DATA, BLOGS_ERROR, BLOGS_FETCH, BLOGS_FAQ_DATA, BLOGS_FAQ_ERROR, BLOGS_FAQ_FETCH } from './constants';
import { Blogs } from './types';

export interface BlogsFetch {
    type: typeof BLOGS_FETCH;
    payload: {
        // limit?: string | '15';
        tag: string;
    };
}

export interface BlogsData {
    type: typeof BLOGS_DATA;
    payload: Blogs[];
}

export interface BlogsError {
    type: typeof BLOGS_ERROR;
    error: CommonError;
}

export interface FaqsFetch {
    type: typeof BLOGS_FAQ_FETCH;
}

export interface FaqsData {
    type: typeof BLOGS_FAQ_DATA;
    payload: Blogs[];
}

export interface FaqsError {
    type: typeof BLOGS_FAQ_ERROR;
    error: CommonError;
}

export type BlogsAction = BlogsFetch | BlogsData | BlogsError | FaqsFetch | FaqsData | FaqsError;

export const blogsFetch = (payload: BlogsFetch['payload']): BlogsFetch => ({
    type: BLOGS_FETCH,
    payload,
});

export const blogsData = (payload: BlogsData['payload']): BlogsData => ({
    type: BLOGS_DATA,
    payload,
});

export const blogsError = (error: CommonError): BlogsError => ({
    type: BLOGS_ERROR,
    error,
});

export const faqsFetch = (): FaqsFetch => ({
    type: BLOGS_FAQ_FETCH,
});

export const faqsData = (payload: FaqsData['payload']): FaqsData => ({
    type: BLOGS_FAQ_DATA,
    payload,
});

export const faqsError = (error: CommonError): FaqsError => ({
    type: BLOGS_FAQ_ERROR,
    error,
});
