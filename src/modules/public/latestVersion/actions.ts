import { CommonError } from '../../types';
import {
    GET_LATEST_VERSION_FETCH,
    GET_LATEST_VERSION_DATA,
    GET_LATEST_VERSION_ERROR,
} from './constants';
import { LatestVersion } from './types';


export interface GetLatestVersionFetch {
    type: typeof GET_LATEST_VERSION_FETCH;
}

export interface GetLatestVersionData {
    type: typeof GET_LATEST_VERSION_DATA;
    payload: LatestVersion
}

export interface GetLatestVersionError {
    type: typeof GET_LATEST_VERSION_ERROR;
    error: CommonError
}


export type GetLatestVersionAction = 
    GetLatestVersionFetch
    | GetLatestVersionData
    | GetLatestVersionError

export const getLatestVersionFetch = (): GetLatestVersionFetch => ({
    type: GET_LATEST_VERSION_FETCH
});

export const getLatestVersionData = (payload: GetLatestVersionData['payload']): GetLatestVersionData => ({
    type: GET_LATEST_VERSION_DATA,
    payload
})

export const getLatestVersionError = (error: CommonError): GetLatestVersionError => ({
    type: GET_LATEST_VERSION_ERROR,
    error
})
