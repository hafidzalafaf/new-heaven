import { RootState } from '../../';
import { Blogs } from '../../';

export const selectBlogs = (state: RootState): Blogs[] => state.public.blogs.blog.data;

export const selectBlogsLoading = (state: RootState): boolean => state.public.blogs.blog.loading;

export const selectContact = (state: RootState): Blogs[] => state.public.blogs.contact.data;

export const selectContactLoading = (state: RootState): boolean => state.public.blogs.contact.loading;
