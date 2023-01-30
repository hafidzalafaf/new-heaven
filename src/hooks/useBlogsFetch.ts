import * as React from 'react';
import { useDispatch } from 'react-redux';
import { blogsFetch } from '../modules';

interface BlogProps {
    limit?: string,
    tag: string
}

export const useBlogsFetch =  ({ limit= '15', tag }: BlogProps) => {
    const dispatch = useDispatch();
    React.useEffect(() => {
       if (limit) { 
        dispatch(blogsFetch({limit, tag}));
       } else {
        dispatch(blogsFetch({tag}));
       }
    }, [dispatch]);
};
