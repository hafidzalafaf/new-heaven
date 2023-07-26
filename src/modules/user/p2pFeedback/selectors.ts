import { RootState } from '../../../modules';
import { CommonError } from '../../../modules/types';
import { Feedback } from './types';

export const selectP2PFeedbackUser = (state: RootState): any => state.user.p2pFeedback.fetch.data;

export const selectP2PCreateFeedbackSuccess = (state: RootState): boolean => state.user.p2pFeedback.create.success;
