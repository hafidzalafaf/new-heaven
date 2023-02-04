import * as React from 'react';
import { useDispatch } from 'react-redux';
import { contactsFetch } from '../modules';

export const useContactsFetch = () => {
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(contactsFetch());
    }, [dispatch]);
};
