import { CommonError } from '../../types';
import {
    GetLatestVersionAction
} from './actions';
import {
    GET_LATEST_VERSION_FETCH,
    GET_LATEST_VERSION_DATA,
    GET_LATEST_VERSION_ERROR,
} from './constants';
import { LatestVersion } from './types';

export interface GetLatestVersionState {
    data: LatestVersion;
    loading: boolean;
    success: boolean;
    error?: CommonError
}

export const initialGetLatestVersionState: GetLatestVersionState = {
    data: {
        name: '',
        value: '',
    }, 
    loading: false,
    success: false,
}

export const getLatestVersionReducer = (state = initialGetLatestVersionState, action: GetLatestVersionAction): GetLatestVersionState => {
    switch (action.type) {
        case GET_LATEST_VERSION_FETCH: 
            return {
                ...state,
                loading: true,
            }
        case GET_LATEST_VERSION_DATA:
            return {
                ...state,
                loading: false,
                data: action.payload,
                success: true,
            }
        case GET_LATEST_VERSION_ERROR:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.error
            }
        default:
            return state;
    }
}