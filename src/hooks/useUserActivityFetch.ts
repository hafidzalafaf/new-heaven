import * as React from 'react';
import { useDispatch } from 'react-redux';
import { getUserActivity } from '../modules';

interface UserActivityProps {
    page?: number;
    limit?: number;
}

export const useUserActivityFetch = ({ page = 0, limit = 25 }:UserActivityProps) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(getUserActivity({ page, limit }));
    }, [dispatch, page, limit]);
};
