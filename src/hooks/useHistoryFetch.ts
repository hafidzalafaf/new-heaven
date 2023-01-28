import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHistory, selectUserInfo } from '../modules';

interface HistoryProps {
    type: string;
    currency?: string;
    limit?: number;
    page?: number;
    market?: string;
    time_from?: number;
    time_to?: number; 
}


export const useHistoryFetch = ({ type, currency, market, limit = 6, page = 0 }: HistoryProps) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUserInfo);

    React.useEffect(() => {
        if (user.level > 2) {
            dispatch(fetchHistory({ type, limit, page }));
            if (type === 'trades') {
                if (market) {
                    dispatch(fetchHistory({ type, limit, market, page }));
                }
            } else {
                if (currency) {
                    dispatch(fetchHistory({ type, limit, currency, page }));
                }
            }
        }
    }, [dispatch, type, currency, market, limit, page]);
};
