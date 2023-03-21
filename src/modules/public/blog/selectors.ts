import { RootState } from '../../';
import { Blogs } from '../../';

export const selectBlogs = (state: RootState): Blogs[] => state.public.blogs.blog.data;

export const selectBlogsLoading = (state: RootState): boolean => state.public.blogs.blog.loading;

export const selectFaqs = (state: RootState): Blogs[] => state.public.blogs.faq.data;

export const selectFaqsLoading = (state: RootState): boolean => state.public.blogs.faq.loading;
