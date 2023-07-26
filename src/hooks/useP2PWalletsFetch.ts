import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectShouldFetchP2PWallets, p2pWalletsFetch } from '../modules';

export const useP2PWalletsFetch = () => {
    const shouldDispatch = useSelector(selectShouldFetchP2PWallets);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldDispatch) {
            dispatch(p2pWalletsFetch());
        }
    }, [dispatch, shouldDispatch]);
};
