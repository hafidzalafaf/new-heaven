import { RootState } from '../../';
import { Blogs } from '../../';

export const selectBlogs = (state: RootState): Blogs[] => state.public.blogs.data;

export const selectBlogsLoading = (state: RootState): boolean => state.public.blogs.loading;
