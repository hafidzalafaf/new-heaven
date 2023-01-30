import { CommonError } from '../../types';
import { BLOGS_DATA, BLOGS_ERROR, BLOGS_FETCH } from './constants';
import { Blogs } from './types';

export interface BlogsFetch {
    type: typeof BLOGS_FETCH;
    payload: {
        limit?: string | '15';
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

export type BlogsAction = BlogsFetch | BlogsData | BlogsError;

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
