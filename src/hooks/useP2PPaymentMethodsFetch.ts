import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { p2pPublicPaymentMethodsFetch, selectShouldFetchP2PPaymentMethods } from '../modules';

export const useP2PPaymentMethodsFetch = () => {
    const shouldDispatch = useSelector(selectShouldFetchP2PPaymentMethods);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldDispatch) {
            dispatch(p2pPublicPaymentMethodsFetch());
        }
    }, [shouldDispatch]);
};
