import * as React from 'react';
import { useDispatch } from 'react-redux';
import { withdrawSumFetch } from '../modules';

export const useWithdrawSum = () => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(withdrawSumFetch());
    }, [dispatch]);
};
