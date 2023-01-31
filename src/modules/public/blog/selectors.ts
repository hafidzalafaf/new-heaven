import { RootState } from '../../';
import { Blogs } from '../../';

export const selectBlogs = (state: RootState): Blogs[] => state.public.blogs['fetch']?.data;

export const selectBlogsLoading = (state: RootState): boolean => state.public.blogs['fetch']?.loading;
