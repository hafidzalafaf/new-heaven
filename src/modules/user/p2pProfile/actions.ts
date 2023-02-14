import { CommonError } from '../../types';
import { P2P_PROFILE_FETCH, P2P_PROFILE_FETCH_DATA, P2P_PROFILE_FETCH_ERROR, P2P_PROFILE_CHANGE_USERNAME_DATA, P2P_PROFILE_CHANGE_USERNAME, P2P_PROFILE_CHANGE_USERNAME_ERROR } from './constants';


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

export interface P2PProfileChangeUsername {
    type: typeof P2P_PROFILE_CHANGE_USERNAME;
    payload: {
        username: string;
    };
}

export interface P2PProfileChangeUsernameData {
    type: typeof P2P_PROFILE_CHANGE_USERNAME_DATA;
}

export interface P2PProfileChangeUsernameError {
    type: typeof P2P_PROFILE_CHANGE_USERNAME_ERROR;
    error: CommonError;
}

export type P2PProfileActions = P2PProfileFetch | P2PProfileData | P2PProfileError | P2PProfileChangeUsername | P2PProfileChangeUsernameData | P2PProfileChangeUsernameError;

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

export const p2pProfileChangeUsername = (payload: P2PProfileChangeUsername['payload']): P2PProfileChangeUsername => ({
    type: P2P_PROFILE_CHANGE_USERNAME,
    payload,
});

export const p2pProfileChangeUsernameData = (): P2PProfileChangeUsernameData => ({
    type: P2P_PROFILE_CHANGE_USERNAME_DATA,
});

export const p2pProfileChangeUsernameError = (error: CommonError): P2PProfileChangeUsernameError => ({
    type: P2P_PROFILE_CHANGE_USERNAME_ERROR,
    error,
});
