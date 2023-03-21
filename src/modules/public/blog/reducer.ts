import { CommonState } from '../../types';
import { BlogsAction } from './actions';
import { BLOGS_FAQ_DATA, BLOGS_FAQ_ERROR, BLOGS_FAQ_FETCH, BLOGS_DATA, BLOGS_ERROR, BLOGS_FETCH } from './constants';
import { Blogs } from './types';

export interface BlogsState extends CommonState {
    blog: {
        data?: Blogs[];
        loading: boolean;
    };

    faq: {
        data?: Blogs[];
        loading: boolean;
    };
}

export const initialBlogsState: BlogsState = {
    blog: {
        data: [],
        loading: false,
    },
    faq: {
        data: [],
        loading: false,
    },
};

export const blogReducer = (state = initialBlogsState['blog'], action: BlogsAction) => {
    switch (action.type) {
        case BLOGS_FETCH:
            return {
                ...state,
                loading: true,
            };
        case BLOGS_DATA:
            return {
                ...state,
                loading: false,
                data: action.payload,
            };
        case BLOGS_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};

export const blogFaqReducer = (state = initialBlogsState['faq'], action: BlogsAction) => {
    switch (action.type) {
        case BLOGS_FAQ_FETCH:
            return {
                ...state,
                loading: true,
            };
        case BLOGS_FAQ_DATA:
            return {
                ...state,
                loading: false,
                data: action.payload,
            };
        case BLOGS_FAQ_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};

export const blogsReducer = (state = initialBlogsState, action: BlogsAction) => {
    switch (action.type) {
        case BLOGS_FETCH:
        case BLOGS_DATA:
        case BLOGS_ERROR:
            const blogState = { ...state.blog };

            return {
                ...state,
                blog: blogReducer(blogState, action),
            };

        case BLOGS_FAQ_FETCH:
        case BLOGS_FAQ_DATA:
        case BLOGS_FAQ_ERROR:
            const contactState = { ...state.faq };

            return {
                ...state,
                faq: blogFaqReducer(contactState, action),
            };
        default:
            return state;
    }
};
