import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { p2pPublicCurrenciesFetch, selectShouldFetchP2PCurrencies } from '../modules';

export const useP2PCurrenciesFetch = ({ fiat }) => {
    const shouldDispatch = useSelector(selectShouldFetchP2PCurrencies);

    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldDispatch) {
            dispatch(p2pPublicCurrenciesFetch(fiat));
        }
    }, [shouldDispatch]);
};
