import { CommonState } from '../../types';
import { BlogsAction } from './actions';
import {
    BLOGS_CONTACT_DATA,
    BLOGS_CONTACT_ERROR,
    BLOGS_CONTACT_FETCH,
    BLOGS_DATA,
    BLOGS_ERROR,
    BLOGS_FETCH,
} from './constants';
import { Blogs } from './types';

export interface BlogsState extends CommonState {
    blog: {
        data?: Blogs[];
        loading: boolean;
    };

    contact: {
        data?: Blogs[];
        loading: boolean;
    };
}

export const initialBlogsState: BlogsState = {
    blog: {
        data: [],
        loading: false,
    },
    contact: {
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

export const blogContactReducer = (state = initialBlogsState['contact'], action: BlogsAction) => {
    switch (action.type) {
        case BLOGS_CONTACT_FETCH:
            return {
                ...state,
                loading: true,
            };
        case BLOGS_CONTACT_DATA:
            return {
                ...state,
                loading: false,
                data: action.payload,
            };
        case BLOGS_CONTACT_ERROR:
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

        case BLOGS_CONTACT_FETCH:
        case BLOGS_CONTACT_DATA:
        case BLOGS_CONTACT_ERROR:
            const contactState = { ...state.contact };

            return {
                ...state,
                contact: blogContactReducer(contactState, action),
            };
        default:
            return state;
    }
};
