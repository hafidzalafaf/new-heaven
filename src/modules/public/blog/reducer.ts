import { CommonState } from '../../types';
import { BlogsAction } from './actions';
import { BLOGS_DATA, BLOGS_ERROR, BLOGS_FETCH } from './constants';
import { Blogs } from './types';

export interface BlogsState extends CommonState {
    data?: Blogs[];
    loading: boolean;
}

export const initialBlogsState: BlogsState = {
    data: [],
    loading: false,
};

export const blogsReducer = (state = initialBlogsState, action: BlogsAction) => {
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
