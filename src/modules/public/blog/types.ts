import { CommonError } from 'src/modules/types';
import {BLOGS_FETCH,BLOGS_DATA,BLOGS_ERROR } from './constants';

export interface Blogs {
   id: string;
   uuid: string;
   title: string;
   slug: string;
   html: string;
   comment_id: string;
   feature_image: string;
   featured: boolean;
   visibility: string;
   email_recipient_filter: string;
   created_at: string;
   updated_at: string;
   published_at: string;
   custom_excerpt: string;
   codeinjection_head: string;
   codeinjection_foot: string;
   custom_template: string;
   canonical_url: string;
   url: string;
   excerpt: string;
   reading_time: number;
   access: boolean;
   send_email_when_published: boolean;
   og_image: string;
   og_title: string;
   og_description: string;
   twitter_image: string;
   twitter_title: string;
   twitter_description: string;
   meta_title: string;
   meta_description: string;
   email_subject: string;
}