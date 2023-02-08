import { CommonError } from '../../types';
import { P2P_PROFILE_FETCH, P2P_PROFILE_FETCH_DATA, P2P_PROFILE_FETCH_ERROR } from './constants';

export interface P2PProfileFetch {
    type: typeof P2P_PROFILE_FETCH;
}

export interface P2PProfileData {
    type: typeof P2P_PROFILE_FETCH_DATA;
    payload: [];
}

export interface P2PProfileError {
    type: typeof P2P_PROFILE_FETCH_ERROR;
    error: CommonError;
}

export type P2PProfileActions = P2PProfileFetch | P2PProfileData | P2PProfileError;

export const p2pProfileFetch = (): P2PProfileFetch => ({
    type: P2P_PROFILE_FETCH,
});

export const p2pProfileData = (payload: P2PProfileData['payload']): P2PProfileData => ({
    type: P2P_PROFILE_FETCH_DATA,
    payload,
});

export const p2pProfileError = (error: CommonError): P2PProfileError => ({
    type: P2P_PROFILE_FETCH_ERROR,
    error,
});
